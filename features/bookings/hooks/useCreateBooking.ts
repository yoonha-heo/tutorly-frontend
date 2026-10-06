import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createBooking, CreateBookingData } from "../api/bookings.api";

interface UseCreateBookingOptions {
  teacherId: string;
}

export function useCreateBooking({ teacherId }: UseCreateBookingOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateBookingData) => createBooking(request),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["teacher-availabilities", teacherId],
        }),
        queryClient.invalidateQueries({ queryKey: ["my-bookings"] }),
      ]);
    },
  });
}
