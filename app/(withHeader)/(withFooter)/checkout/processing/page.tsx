import { notFound } from "next/navigation";

import { CheckoutProcessingClient } from "@/features/payments/components/CheckoutProcessingClient";

interface CheckoutProcessingPageProps {
  searchParams: Promise<{
    booking_id?: string;
    payment_intent?: string;
  }>;
}

export default async function CheckoutProcessingPage({
  searchParams,
}: CheckoutProcessingPageProps) {
  const { booking_id: bookingId } = await searchParams;

  if (!bookingId) {
    notFound();
  }

  return <CheckoutProcessingClient bookingId={bookingId} />;
}
