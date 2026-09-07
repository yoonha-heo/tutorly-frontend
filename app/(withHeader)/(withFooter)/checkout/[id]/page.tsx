import { notFound } from "next/navigation";

import { getMyBookings } from "@/features/bookings/api/bookings.api";
import { CheckoutClient } from "@/features/payments/components/CheckoutClient";

interface CheckoutPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
    const { id } = await params;
    const bookings = await getMyBookings();
    const booking = bookings.find((item) => item.id === id);

    if (!booking) {
        notFound();
    }

    return <CheckoutClient booking={booking} />;
}
