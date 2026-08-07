"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateAvailabilities } from "../api/teachers.api";

export type AvailabilityChange = {
  id: string;
  isOpen: boolean;
};

export function useSaveAvailabilities() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (changes: AvailabilityChange[]) =>
      updateAvailabilities(changes),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["my-availabilities"] });
    },
  });
}
