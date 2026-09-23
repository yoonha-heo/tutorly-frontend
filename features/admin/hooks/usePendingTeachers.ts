"use client";

import { useQuery } from "@tanstack/react-query";

import { getPendingTeachers } from "../api/admin.api";

export function usePendingTeachers(enabled: boolean) {
  return useQuery({
    queryKey: ["admin", "pending-teachers"],
    queryFn: getPendingTeachers,
    enabled,
  });
}
