"use client";

import { useState } from "react";

import type { TeachingBooking } from "../api/bookings.api";
import {
  LessonStatusFilter,
  TEACHING_LESSON_STATUS_FILTERS,
  type LessonFilter,
} from "./LessonStatusFilter";
import { TeachingLessonCard } from "./TeachingLessonCard";
import { LessonsEmptyState } from "./LessonStates";

interface TeachingLessonListProps {
  bookings: TeachingBooking[];
}

export function TeachingLessonList({ bookings }: TeachingLessonListProps) {
  const [selectedStatus, setSelectedStatus] = useState<LessonFilter>("ALL");

  const filteredBookings =
    selectedStatus === "ALL"
      ? bookings
      : bookings.filter((booking) => booking.status === selectedStatus);

  return (
    <>
      <LessonStatusFilter
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        filters={TEACHING_LESSON_STATUS_FILTERS}
      />

      <section className="mt-6 min-h-[450px] space-y-4">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking, index) => (
            <TeachingLessonCard
              key={booking.id}
              booking={booking}
              priority={index < 3}
            />
          ))
        ) : (
          <LessonsEmptyState />
        )}
      </section>
    </>
  );
}
