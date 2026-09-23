"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useMe } from "@/features/auth/hooks/useMe";

export function useAdminAccess() {
  const router = useRouter();
  const { data: me, isPending } = useMe();

  const canLoad = !isPending && me?.role === "ADMIN";

  useEffect(() => {
    if (isPending) return;

    if (!me) {
      router.replace("/login?callbackUrl=/admin");
      return;
    }

    if (me.role !== "ADMIN") {
      router.replace("/");
    }
  }, [isPending, me, router]);

  return { canLoad, me };
}
