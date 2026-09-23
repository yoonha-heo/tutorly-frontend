"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useMe } from "@/features/auth/hooks/useMe";

export function useChatPageAccess() {
  const router = useRouter();
  const { data: me, isPending } = useMe();

  const isUnapprovedTeacher =
    me?.role === "TEACHER" && me.teacherProfile?.status !== "APPROVED";
  const canLoadChats = !isPending && Boolean(me) && !isUnapprovedTeacher;

  useEffect(() => {
    if (isPending) return;

    if (!me) {
      router.replace("/login?callbackUrl=/chats");
      return;
    }

    if (isUnapprovedTeacher) {
      router.replace("/teachers/dashboard");
    }
  }, [isPending, isUnapprovedTeacher, me, router]);

  return { canLoadChats };
}
