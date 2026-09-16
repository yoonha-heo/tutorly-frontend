import { ApiError, ApiErrorResponse } from './apiError';
import { env } from '@/config/env';

let refreshInFlight: Promise<boolean> | null = null;

function shouldAttemptRefresh(input: RequestInfo | URL) {
  const url = String(input);
  return (
    !url.includes('/auth/refresh') &&
    !url.includes('/auth/google') &&
    !url.includes('/auth/logout')
  );
}

async function tryRefreshSession(init?: RequestInit) {
  if (!refreshInFlight) {
    const headers = new Headers();
    const cookie = new Headers(init?.headers).get('Cookie');
    if (cookie) {
      headers.set('Cookie', cookie);
    }

    refreshInFlight = fetch(`${env.apiUrl}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers,
      cache: 'no-store',
    })
      .then((res) => res.ok)
      .catch(() => false)
      .finally(() => {
        refreshInFlight = null;
      });
  }

  return refreshInFlight;
}

export async function apiFetch<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  return requestJson<T>(input, init, false);
}

async function requestJson<T>(
  input: RequestInfo | URL,
  init: RequestInit | undefined,
  hasRetried: boolean,
): Promise<T> {
  const { headers: initHeaders, body, ...restInit } = init ?? {};
  const isFormData =
    typeof FormData !== 'undefined' && body instanceof FormData;

  const headers = new Headers(initHeaders);

  if (!isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(input, {
    ...restInit,
    body,
    headers,
  });

  if (res.status === 401 && !hasRetried && shouldAttemptRefresh(input)) {
    const refreshed = await tryRefreshSession(init);
    if (refreshed) {
      return requestJson<T>(input, init, true);
    }
  }

  if (!res.ok) {
    let errorData: Partial<ApiErrorResponse> = {};

    try {
      errorData = await res.json();
    } catch {
      // if the server sends a non-JSON error response (e.g. Nginx 502 Bad Gateway HTML)
    }

    throw new ApiError({
      statusCode: res.status,
      code: errorData.code || 'UNKNOWN_ERROR',
      message: errorData.message || 'error while processing request',
      details: errorData.details,
      traceId: errorData.traceId,
      timestamp: errorData.timestamp,
      path: errorData.path,
    });
  }

  if (res.status === 204) {
    return {} as T;
  }

  return res.json();
}
