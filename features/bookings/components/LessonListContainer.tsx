"use client";

import { useState } from "react";
import { LessonStatusFilter, type LessonFilter } from "./LessonStatusFilter";
import { LessonCard } from "./LessonCard";
import { LessonsEmptyState } from "./LessonStates";
import type { Booking } from "../api/bookings.api";

interface Props {
  bookings: Booking[];
}

export function LessonListContainer({ bookings }: Props) {
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
      />

      <section className="mt-6 space-y-4 min-h-[450px]">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking, index) => (
            <LessonCard
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
