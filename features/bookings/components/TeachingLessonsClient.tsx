"use client";

import { CalendarDays, Star } from "lucide-react";

import { useApprovedTeacherAccess } from "../hooks/useApprovedTeacherAccess";
import { useMyTeachingBookings } from "../hooks/useMyTeachingBookings";
import { LessonSummaryCard } from "./LessonSummaryCard";
import { TeachingLessonList } from "./TeachingLessonList";
import { LessonsLoadingState } from "./LessonStates";

export function TeachingLessonsClient() {
  const { canAccess } = useApprovedTeacherAccess();
  const { data: bookings, isPending } = useMyTeachingBookings(canAccess);
  const lessons = bookings ?? [];

  const upcomingCount = lessons.filter(
    (booking) => booking.status === "CONFIRMED",
  ).length;
  const completedCount = lessons.filter(
    (booking) => booking.status === "COMPLETED",
  ).length;

  if (!canAccess || isPending) {
    return <TeachingLessonsSkeleton />;
  }

  return (
    <main className="mx-auto min-h-[85vh] w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <section
        aria-label="Lesson summary"
        className="mt-8 grid gap-4 md:grid-cols-2"
      >
        <LessonSummaryCard
          label="Upcoming lessons"
          value={upcomingCount}
          icon={<CalendarDays className="size-5 text-primary" />}
          iconClassName="bg-secondary"
        />
        <LessonSummaryCard
          label="Completed lessons"
          value={completedCount}
          icon={<Star className="size-5 text-muted-foreground" />}
          iconClassName="bg-slate-50"
        />
      </section>

      <TeachingLessonList bookings={lessons} />
    </main>
  );
}

function TeachingLessonsSkeleton() {
  return (
    <main
      className="mx-auto min-h-[85vh] w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10"
      aria-label="Loading lessons"
    >
      <section
        aria-label="Lesson summary"
        className="mt-8 grid gap-4 md:grid-cols-2"
      >
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
