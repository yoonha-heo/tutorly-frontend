"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createReview } from "../api/reviews.api";

export function useCreateReview() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: createReview,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      await queryClient.invalidateQueries({ queryKey: ["teacher-reviews"] });
      router.refresh();
      toast.success("Review submitted.");
    },
  });
}
