"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useMe } from "../hooks/useMe";

type AuthGuardProps = {
  children: React.ReactNode;
  loginPath?: string;
};

export function AuthGuard({ children, loginPath = "/login" }: AuthGuardProps) {
  const router = useRouter();
  const { data: me, isLoading } = useMe();

  useEffect(() => {
    if (!isLoading && !me) {
      router.replace(loginPath);
    }
  }, [isLoading, me, router]);

  if (isLoading) {
    return null;
  }

  if (!me) {
    return null;
  }

  return children;
}
