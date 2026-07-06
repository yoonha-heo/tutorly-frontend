"use client";

import { useQuery } from "@tanstack/react-query";
import { getTeacher } from "../api/teachers.api";

export function useTeacher(id: string) {
  return useQuery({
    queryKey: ["teacher", id],
    queryFn: () => getTeacher(id),
    enabled: Boolean(id),
  });
}
