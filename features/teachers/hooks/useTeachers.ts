"use client";

import { useQuery } from "@tanstack/react-query";
import { getTeachers } from "../api/teachers.api";

export function useTeachers() {
  return useQuery({
    queryKey: ["teachers"],
    queryFn: getTeachers,
  });
}
