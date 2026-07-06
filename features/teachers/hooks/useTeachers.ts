"use client";

import { useQuery } from "@tanstack/react-query";
import { getTeachers, GetTeachersParams } from "../api/teachers.api";

export function useTeachers(params: GetTeachersParams = {}) {
  return useQuery({
    queryKey: ["teachers", params],
    queryFn: () => getTeachers(params),
  });
}
