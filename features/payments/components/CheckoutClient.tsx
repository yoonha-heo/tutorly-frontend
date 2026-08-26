"use client";

import {
  Elements as StripeElements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Calendar, Clock, LoaderCircle, Lock } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";

import type { Booking } from "@/features/bookings/api/bookings.api";
import { useCreatePaymentIntent } from "@/features/payments/hooks/useCreatePaymentIntent";
import { env } from "@/config/env";
import { cn } from "@/utils/cn";
import {
  formatLocalLessonDate,
  formatLocalLessonTimeRange,
  getLessonDurationMinutes,
} from "@/utils/localDateTime";

const stripePromise = loadStripe(env.stripePublishableKey);

interface CheckoutClientProps {
  booking: Booking;
}

export function CheckoutClient({ booking }: CheckoutClientProps) {
  const [secondsLeft, setSecondsLeft] = useState(() =>
    getSecondsUntil(booking.paymentExpiresAt),
  );
  const { data } = useCreatePaymentIntent(booking.id);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft(getSecondsUntil(booking.paymentExpiresAt));
    }, 1000);

    return () => clearInterval(interval);
  }, [booking.paymentExpiresAt]);

  const clientSecret = data?.clientSecret;

  return (
    <main className="mx-auto max-w-6xl px-4 pt-4 pb-8 sm:px-6 sm:pt-5 sm:pb-10 lg:px-8">
      <CountdownBanner secondsLeft={secondsLeft} />

      {clientSecret ? (
        <StripeElements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: "stripe",
            },
          }}
        >
          <CheckoutLayout
            booking={booking}
            paymentMethod={<PaymentElement />}
            payButton={
              <PayButton
                bookingId={booking.id}
                secondsLeft={secondsLeft}
                amount={booking.price}
              />
            }
          />
        </StripeElements>
      ) : (
        <CheckoutLayout
          booking={booking}
          paymentMethod={<PaymentMethodSkeleton />}
          payButton={<PayButtonFallback />}
        />
      )}
    </main>
  );
}

function CheckoutLayout({
  booking,
  paymentMethod,
  payButton,
}: {
  booking: Booking;
  paymentMethod: ReactNode;
  payButton: ReactNode;
}) {
  const durationMinutes = getLessonDurationMinutes(
    booking.lessonStartAt,
    booking.lessonEndAt,
  );
  const lessonLabel = `${durationMinutes}-Min Lesson`;
  const lessonPrice = booking.price;
  const teacherName = booking.teacher.user.name;

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Main content */}
      <div className="flex flex-col gap-6 lg:col-span-2">
        {/* Lesson info card */}
        <section className="rounded-2xl border border-border bg-background p-6">
          <h2 className="mb-4 text-base font-semibold">Lesson details</h2>

          <div className="flex items-center gap-3.5 border-b border-border pb-5">
            <Image
              src={
                booking.teacher.profileImageUrl || "/images/empty-profile.png"
              }
              alt={`${teacherName} profile`}
              width={56}
              height={56}
              className="size-14 rounded-xl object-cover"
            />
            <div className="min-w-0">
              <p className="font-semibold text-foreground">{teacherName}</p>
              <p className="truncate text-sm text-muted-foreground">
                {booking.teacher.headline}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                <Calendar className="size-4" />
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {formatLocalLessonDate(booking.lessonStartAt)}
                </p>
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="size-3.5" />
                  {formatLocalLessonTimeRange(
                    booking.lessonStartAt,
                    booking.lessonEndAt,
                  )}
                  <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                    {booking.teacher.timezone}
                  </span>
                </p>
              </div>
            </div>
            <span className="inline-flex w-fit items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
              {durationMinutes} min lesson
            </span>
          </div>
        </section>

        {/* Payment method box */}
        <section className="rounded-2xl border border-border bg-background p-6">
          <h2 className="mb-4 text-base font-semibold">Payment method</h2>

          {paymentMethod}


        </section>
      </div>

      {/* Sidebar */}
      <div className="flex flex-col gap-6 lg:col-span-1">
        <section className="rounded-2xl border border-border bg-background p-6">
          <h2 className="mb-4 text-base font-semibold">Order summary</h2>

          <dl className="space-y-2.5 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">1x {lessonLabel}</dt>
              <dd className="font-medium text-foreground">${lessonPrice}</dd>
            </div>
          </dl>

          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <span className="text-sm font-semibold text-foreground">
              Total amount
            </span>
            <span className="text-xl font-bold text-foreground">
              ${lessonPrice}
            </span>
          </div>

          {payButton}
        </section>
      </div>
    </div>
  );
}

function PayButton({
  bookingId,
  secondsLeft,
  amount,
}: {
  bookingId: string;
  secondsLeft: number;
  amount: number;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handlePay() {
    if (!stripe || !elements) return;

    setIsSubmitting(true);

    const returnUrl = `${window.location.origin}/checkout/processing?booking_id=${bookingId}`;

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
      },
      redirect: "if_required",
    });

    if (error) {
      toast.error(error.message || "Payment could not be completed.");
      setIsSubmitting(false);
      return;
    }

    const processingUrl = paymentIntent
      ? `${returnUrl}&payment_intent=${paymentIntent.id}`
      : returnUrl;

    router.push(processingUrl);
  }

  const canPay = Boolean(stripe && elements) && !isSubmitting && secondsLeft > 0;

  return (
    <button
      type="button"
      onClick={handlePay}
      disabled={!canPay}
      className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
    >
      {isSubmitting ? (
        <>
          <LoaderCircle className="size-4 animate-spin" />
          Processing
        </>
      ) : (
        <>
          <Lock className="size-4" />
          Pay ${amount}
        </>
      )}
    </button>
  );
}

function PayButtonFallback() {
  return (
    <button
      type="button"
      disabled
      className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40"
    >
      <LoaderCircle className="size-4 animate-spin" />
      Processing
    </button>
  );
}

function PaymentMethodSkeleton() {
  return (
    <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-border bg-secondary/50 p-6">
      <LoaderCircle className="size-5 animate-spin text-muted-foreground" />
    </div>
  );
}

function CountdownBanner({ secondsLeft }: { secondsLeft: number }) {
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedCountdown = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  const isExpiring = secondsLeft <= 60;

  return (
    <div
      role="status"
      className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-amber-900"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-100">
        <Clock className="size-4" />
      </span>
      <div className="flex min-w-0 flex-1 flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <p className="text-sm leading-snug">
          Your lesson is reserved. Please complete payment.
        </p>
        <p
          className={cn(
            "shrink-0 font-mono text-sm font-semibold tabular-nums",
            isExpiring && "text-red-700",
          )}
        >
          {formattedCountdown}
        </p>
      </div>
    </div>
  );
  }

function getSecondsUntil(expiresAt: string | null) {
  if (!expiresAt) return 0;

  return Math.max(
    0,
    Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000),
  );
}
