import type { UserRole, Me } from "../types/auth.types";
import { apiFetch } from "@/utils/apiClient";
import { ApiError } from "@/utils/apiError";

type LoginWithGoogleResponse = {
  user: Me;
};

export async function loginWithGoogle(idToken: string, role: UserRole) {
  return apiFetch<LoginWithGoogleResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/google`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        idToken,
        role,
      }),
    },
  );
}

export async function getMe(): Promise<Me | null> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // 서버 환경(RSC)일 때만 dynamic import로 next/headers를 불러옵니다.
  if (typeof window === "undefined") {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();

    if (cookieString) {
      headers["Cookie"] = cookieString;
    }
  }

  try {
    const data = await apiFetch<{ user: Me }>(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
      {
        headers,
        credentials: "include", // 클라이언트(브라우저) 환경 대응
        cache: "no-store",
      },
    );

    return data.user;
  } catch (error) {
    if (ApiError.isApiError(error) && error.statusCode === 401) {
      return null;
    }

    throw error;
  }
}

export async function logout(): Promise<void> {
  await apiFetch<{ success: boolean }>(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
    {
      method: "POST",
      credentials: "include",
    },
  );
}
