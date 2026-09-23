"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useMe } from "@/features/auth/hooks/useMe";

export function useTeacherRegistrationAccess() {
  const router = useRouter();
  const { data: me, isPending } = useMe();
  const hasTeacherProfile = Boolean(me?.teacherProfile);

  const canRegister =
    !isPending && Boolean(me) && me?.role !== "STUDENT" && !hasTeacherProfile;

  useEffect(() => {
    if (isPending) return;

    if (!me) {
      router.replace(
        "/login?intent=teacher&callbackUrl=/teachers/registration",
      );
      return;
    }

    if (me.role === "STUDENT") {
      router.replace("/teachers");
      return;
    }

    if (hasTeacherProfile) {
      router.replace("/teachers/dashboard");
    }
  }, [hasTeacherProfile, isPending, me, router]);

  return { canRegister };
}
