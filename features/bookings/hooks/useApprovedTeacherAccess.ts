"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useMe } from "@/features/auth/hooks/useMe";

export function useApprovedTeacherAccess(
  callbackUrl = "/teachers/lessons",
) {
  const router = useRouter();
  const { data: me, isPending } = useMe();

  const canAccess =
    me?.role === "TEACHER" && me.teacherProfile?.status === "APPROVED";

  useEffect(() => {
    if (isPending) return;

    if (!me) {
      router.replace(
        `/login?intent=teacher&callbackUrl=${encodeURIComponent(callbackUrl)}`,
      );
      return;
    }

    if (me.role !== "TEACHER") {
      router.replace("/");
      return;
    }

    if (!me.teacherProfile?.id) {
      router.replace("/teachers/registration");
      return;
    }

    if (me.teacherProfile.status !== "APPROVED") {
      router.replace("/teachers/dashboard");
    }
  }, [callbackUrl, isPending, me, router]);

  return { canAccess: !isPending && canAccess };
}
