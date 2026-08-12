import { ApiError, ApiErrorResponse } from './apiError';

export async function apiFetch<T>(
    input: RequestInfo | URL,
    init?: RequestInit,
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