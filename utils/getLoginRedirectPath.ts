import type { Me } from "../features/auth/types/auth.types";

export function getLoginRedirectPath(user: Me) {
  if (user.role === "STUDENT") {
    return "/teachers";
  }

  if (user.role === "TEACHER") {
    if (user.teacherProfile) {
      return "/teachers/dashboard";
    }

    return "/teachers/registration";
  }

  return "/teachers";
}
