"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateTeacherProfile } from "../api/teachers.api";
import type { UpdateTeacherProfileData } from "../types/teachers";

export function useUpdateTeacherProfile(teacherId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTeacherProfileData) => updateTeacherProfile(data),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["teacher", teacherId] }),
        queryClient.invalidateQueries({ queryKey: ["me"] }),
      ]);
    },
  });
}
