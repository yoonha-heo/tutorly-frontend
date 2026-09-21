"use client";

import { useQuery } from "@tanstack/react-query";

import { getPendingTeachers } from "../api/admin.api";
import type { AdminTeacherListResponse } from "../types/admin";

export function usePendingTeachers(initialData: AdminTeacherListResponse) {
  return useQuery({
    queryKey: ["admin", "pending-teachers"],
    queryFn: getPendingTeachers,
    initialData,
  });
}
