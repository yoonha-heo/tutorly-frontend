"use client";

import { CalendarDays, CreditCard, Star } from "lucide-react";

import { useMyBookings } from "../hooks/useMyBookings";
import { LessonListContainer } from "./LessonListContainer";
import { LessonSummaryCard } from "./LessonSummaryCard";
import { LessonsLoadingState } from "./LessonStates";

export function MyLessonsClient() {
  const { data: bookings, isPending } = useMyBookings();
  const lessons = bookings ?? [];

  const upcomingCount = lessons.filter(
    (booking) => booking.status === "CONFIRMED",
  ).length;
  const paymentRequiredCount = lessons.filter(
    (booking) => booking.status === "PENDING_PAYMENT",
  ).length;
  const completedCount = lessons.filter(
    (booking) => booking.status === "COMPLETED",
  ).length;

  if (isPending) {
    return <MyLessonsSkeleton />;
  }

  return (
    <main className="mx-auto min-h-[85vh] w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <section
        aria-label="Lesson summary"
        className="mt-8 grid gap-4 md:grid-cols-3"
      >
        <LessonSummaryCard
          label="Upcoming lessons"
          value={upcomingCount}
          icon={<CalendarDays className="size-5 text-primary" />}
          iconClassName="bg-secondary"
        />
        <LessonSummaryCard
          label="Payment required"
          value={paymentRequiredCount}
          icon={<CreditCard className="size-5 text-amber-600" />}
          iconClassName="bg-amber-50"
        />
        <LessonSummaryCard
          label="Completed lessons"
          value={completedCount}
          icon={<Star className="size-5 text-muted-foreground" />}
          iconClassName="bg-slate-50"
        />
      </section>

      <LessonListContainer bookings={lessons} />
    </main>
  );
}

function MyLessonsSkeleton() {
  return (
    <main
      className="mx-auto min-h-[85vh] w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10"
      aria-label="Loading lessons"
    >
      <section
        aria-label="Lesson summary"
        className="mt-8 grid gap-4 md:grid-cols-3"
      >
        <SummaryCardSkeleton />
        <SummaryCardSkeleton />
        <SummaryCardSkeleton />
      </section>

      <div className="mt-8 h-10 w-72 animate-pulse rounded-full bg-secondary/50" />

      <section className="mt-6 min-h-[450px]">
        <LessonsLoadingState />
      </section>
    </main>
  );
}

function SummaryCardSkeleton() {
  return (
    <article className="flex items-center gap-4 rounded-2xl border border-border bg-background p-5">
      <div className="size-12 shrink-0 animate-pulse rounded-2xl bg-secondary" />
      <div className="space-y-2">
        <div className="h-7 w-10 animate-pulse rounded bg-secondary" />
        <div className="h-4 w-32 animate-pulse rounded bg-secondary" />
      </div>
    </article>
  );
}
