"use client";

import { useState, useMemo } from "react";
import { LessonStatusFilter, type LessonFilter } from "./LessonStatusFilter";
import { LessonCard } from "./LessonCard";
import { LessonsEmptyState } from "./LessonStates";
import type { Booking } from "../api/bookings.api";

interface Props {
  initialBookings: Booking[];
}

export function LessonListContainer({ initialBookings }: Props) {
  const [selectedStatus, setSelectedStatus] = useState<LessonFilter>("ALL");

  const filteredBookings = useMemo(() => {
    if (selectedStatus === "ALL") return initialBookings;
    return initialBookings.filter((b) => b.status === selectedStatus);
  }, [selectedStatus, initialBookings]);

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
