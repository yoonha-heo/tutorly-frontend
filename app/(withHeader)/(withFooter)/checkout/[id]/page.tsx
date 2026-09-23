import { CheckoutPageClient } from "@/features/payments/components/CheckoutPageClient";

interface CheckoutPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { id } = await params;

  return <CheckoutPageClient bookingId={id} />;
}
