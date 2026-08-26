"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { cancelBooking } from "../api/bookings.api";

export function useCancelBooking() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (bookingId: string) => cancelBooking(bookingId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      router.refresh();
      toast.success("Lesson cancelled.");
    },
  });
}
