import { useQuery } from "@tanstack/react-query";

import { createPaymentIntent } from "../api/payments.api";

export function useCreatePaymentIntent(bookingId: string) {
  return useQuery({
    queryKey: ["payment-intent", bookingId],
    queryFn: () => createPaymentIntent({ bookingId }),
    enabled: Boolean(bookingId),
    staleTime: Infinity,
    retry: false,
  });
}
