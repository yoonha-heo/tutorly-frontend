"use client";

import { CalendarDays, CreditCard, Star } from "lucide-react";
import { useState } from "react";

import { LessonCard } from "@/features/bookings/components/LessonCard";
import {
  LessonsEmptyState,
  LessonsErrorState,
  LessonsLoadingState,
} from "@/features/bookings/components/LessonStates";
import {
  LessonStatusFilter,
  type LessonFilter,
} from "@/features/bookings/components/LessonStatusFilter";
import { LessonSummaryCard } from "@/features/bookings/components/LessonSummaryCard";
import { useMyBookings } from "@/features/bookings/hooks/useMyBookings";

export function LessonListClient() {
  const [selectedStatus, setSelectedStatus] = useState<LessonFilter>("ALL");
  const { data: bookings = [], isLoading, isError, refetch } = useMyBookings();

  const filteredBookings =
    selectedStatus === "ALL"
      ? bookings
      : bookings.filter((booking) => booking.status === selectedStatus);

  const upcomingCount = bookings.filter((b) => b.status === "CONFIRMED").length;
  const paymentRequiredCount = bookings.filter(
    (b) => b.status === "PENDING_PAYMENT",
  ).length;
  const completedCount = bookings.filter(
    (b) => b.status === "COMPLETED",
  ).length;

  return (
    <>
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

      <LessonStatusFilter
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      <section className="mt-6">
        {isLoading ? (
          <LessonsLoadingState />
        ) : isError ? (
          <LessonsErrorState onRetry={() => void refetch()} />
        ) : filteredBookings.length > 0 ? (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <LessonCard key={booking.id} booking={booking} />
            ))}
          </div>
        ) : (
          <LessonsEmptyState />
        )}
      </section>
    </>
  );
}
