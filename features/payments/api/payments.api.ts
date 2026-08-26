import { env } from "@/config/env";
import { apiFetch } from "@/utils/apiClient";

export type CreatePaymentIntentData = {
  bookingId: string;
};

export type CreatePaymentIntentResponse = {
  clientSecret: string;
  paymentIntentId: string;
};

export async function createPaymentIntent(data: CreatePaymentIntentData) {
  return apiFetch<CreatePaymentIntentResponse>(
    `${env.apiUrl}/payments/intent`,
    {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(data),
    },
  );
}
