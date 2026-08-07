"use client";

import { useQuery } from "@tanstack/react-query";

import { getTeacher } from "../api/teachers.api";
import type { Teacher } from "../types/teachers";

export function useTeacher(
  id: string,
  options?: { initialData?: Teacher },
) {
  return useQuery({
    queryKey: ["teacher", id],
    queryFn: () => getTeacher(id),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
    initialData: options?.initialData,
  });
}
