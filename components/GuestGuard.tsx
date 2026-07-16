"use client";

import { useRouter } from "next/navigation";
import { useMe } from "@/features/auth/hooks/useMe";
import { useEffect } from "react";

type GuestGuardProps = {
  children: React.ReactNode;
};

export function GuestGuard({ children }: GuestGuardProps) {
  const router = useRouter();
  const { data: me, isLoading } = useMe();

  useEffect(() => {
    if (!isLoading && me) {
      router.replace("/");
    }
  }, [isLoading, me, router]);

  if (isLoading || me) return null;

  return children;
}
