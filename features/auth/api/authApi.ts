import type { UserRole, Me } from "../types/auth.types";

export async function loginWithGoogle(idToken: string, role: UserRole) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      idToken,
      role,
    }),
  });

  if (!res.ok) {
    throw new Error("Google login failed");
  }

  return res.json();
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

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    headers,
    credentials: "include", // 클라이언트(브라우저) 환경 대응
    cache: "no-store",
  });

  if (res.status === 401) {
    return null;
  }

  if (!res.ok) {
    throw new Error("Failed to fetch me");
  }

  const data: { user: Me } = await res.json();
  return data.user;
}

export async function logout(): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Logout failed");
  }
}
