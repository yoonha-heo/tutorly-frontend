"use client";

import { useQuery } from "@tanstack/react-query";

import { getMyTeacherProfile } from "../api/teachers.api";

export function useMyTeacherProfile(enabled: boolean) {
  return useQuery({
    queryKey: ["my-teacher-profile"],
    queryFn: getMyTeacherProfile,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}
