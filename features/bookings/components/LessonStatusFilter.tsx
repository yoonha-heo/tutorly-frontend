"use client";

import type { BookingStatus } from "@/features/bookings/api/bookings.api";

export type LessonFilter =
  | Extract<BookingStatus, "CONFIRMED" | "COMPLETED" | "PENDING_PAYMENT">
  | "ALL";

const LESSON_STATUS_FILTERS: {
  label: string;
  value: LessonFilter;
}[] = [
  { label: "All", value: "ALL" },
  { label: "Upcoming", value: "CONFIRMED" },
  { label: "Payment required", value: "PENDING_PAYMENT" },
  { label: "Completed", value: "COMPLETED" },
];

interface LessonStatusFilterProps {
  selectedStatus: LessonFilter;
  onStatusChange: (status: LessonFilter) => void;
}

export function LessonStatusFilter({
  selectedStatus,
  onStatusChange,
}: LessonStatusFilterProps) {
  return (
    <div className="mt-8 overflow-x-auto">
      <div className="flex min-w-max gap-2">
        {LESSON_STATUS_FILTERS.map((filter) => {
          const isSelected = selectedStatus === filter.value;

          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => onStatusChange(filter.value)}
              aria-pressed={isSelected}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
