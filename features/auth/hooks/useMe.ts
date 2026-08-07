"use client";

import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api/authApi";
import type { Me } from "../types/auth.types";

export function useMe(options?: { initialData?: Me }) {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
    initialData: options?.initialData,
  });
}
