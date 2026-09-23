"use client";

import { notFound } from "next/navigation";

import { useMyBookings } from "@/features/bookings/hooks/useMyBookings";
import { CheckoutClient } from "./CheckoutClient";

export function CheckoutPageClient({ bookingId }: { bookingId: string }) {
  const { data: bookings, isPending, isError } = useMyBookings();
  const booking = bookings?.find((item) => item.id === bookingId);

  if (isPending) {
    return <CheckoutSkeleton />;
  }

  if (isError || !bookings) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-xl font-semibold text-foreground">
          Could not load this checkout
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Please try again in a moment.
        </p>
      </main>
    );
  }

  if (!booking) {
    notFound();
  }

  return <CheckoutClient booking={booking} />;
}

function CheckoutSkeleton() {
  return (
    <main
      className="mx-auto max-w-6xl px-4 pt-4 pb-8 sm:px-6 sm:pt-5 sm:pb-10 lg:px-8"
      aria-label="Loading checkout"
    >
      <div className="h-[62px] animate-pulse rounded-2xl bg-amber-50" />
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="h-56 animate-pulse rounded-2xl border border-border bg-secondary/50" />
          <div className="h-52 animate-pulse rounded-2xl border border-border bg-secondary/50" />
        </div>
        <div className="h-64 animate-pulse rounded-2xl border border-border bg-secondary/50" />
      </div>
    </main>
  );
}
