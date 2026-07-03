import type { UserRole } from "../types/auth.types";

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
