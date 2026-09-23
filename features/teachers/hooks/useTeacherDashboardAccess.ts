"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useMe } from "@/features/auth/hooks/useMe";

export function useTeacherDashboardAccess() {
  const router = useRouter();
  const { data: me, isPending } = useMe();

  const canLoad = !isPending && Boolean(me?.teacherProfile?.id);

  useEffect(() => {
    if (isPending) return;

    if (!me) {
      router.replace(
        "/login?intent=teacher&callbackUrl=/teachers/dashboard",
      );
      return;
    }

    if (!me.teacherProfile?.id) {
      router.replace("/teachers/registration");
    }
  }, [isPending, me, router]);

  return { canLoad, me };
}
