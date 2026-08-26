"use client";

import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useMyBookings } from "@/features/bookings/hooks/useMyBookings";

interface CheckoutProcessingClientProps {
  bookingId: string;
}

const POLL_INTERVAL_MS = 2000;
const TIMEOUT_MS = 45_000;

export function CheckoutProcessingClient({
  bookingId,
}: CheckoutProcessingClientProps) {
  const router = useRouter();
  const [waitedMs, setWaitedMs] = useState(0);
  const { data: bookings } = useMyBookings({
    refetchInterval: POLL_INTERVAL_MS,
  });

  const booking = bookings?.find((item) => item.id === bookingId);
  const isConfirmed = booking?.status === "CONFIRMED";
  const hasTimedOut = waitedMs >= TIMEOUT_MS && !isConfirmed;

  useEffect(() => {
    if (isConfirmed) {
      router.replace("/lessons");
    }
  }, [isConfirmed, router]);

  useEffect(() => {
    if (isConfirmed) return;

    const interval = setInterval(() => {
      setWaitedMs((current) => current + POLL_INTERVAL_MS);
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [isConfirmed]);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-secondary">
        <LoaderCircle className="size-7 animate-spin text-primary" />
      </span>

      <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground">
        {hasTimedOut ? "Payment received" : "Confirming your payment"}
      </h1>

      <p className="mt-3 text-base leading-7 text-muted-foreground">
        {hasTimedOut
          ? "Your lesson will appear on My lessons shortly."
          : "This usually takes a few seconds. Please don't close this page."}
      </p>

      {hasTimedOut && (
        <Link
          href="/lessons"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground hover:bg-primary-dark"
        >
          Go to My lessons
        </Link>
      )}
    </main>
  );
}
