import type { Me } from "@/features/auth/types/auth.types";

export function getLoginRedirectPath(user: Me) {
  if (user.role === "TEACHER" && !user.teacherProfile) {
    return "/teachers/registration";
  }

  const callbackUrl = new URLSearchParams(window.location.search).get(
    "callbackUrl",
  );

  if (callbackUrl) {
    return callbackUrl;
  }

  if (user.role === "ADMIN") {
    return "/admin";
  }

  if (user.role === "TEACHER") {
    return "/teachers/dashboard";
  }

  return "/";
}
