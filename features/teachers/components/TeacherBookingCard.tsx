"use client";

import { CalendarDays, MessageCircle, Star } from "lucide-react";
import { useState } from "react";
import dynamic from "next/dynamic";

import type { Teacher } from "@/features/teachers/types/teachers";

interface TeacherBookingCardProps {
  teacher: Teacher;
}

const BookingModal = dynamic(
  () => import("./BookingModal").then((mod) => mod.BookingModal),
  {
    ssr: false,
  },
);

export function TeacherBookingCard({ teacher }: TeacherBookingCardProps) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  return (
    <>
      <aside className="rounded-3xl border border-border bg-background p-5 shadow-sm sm:p-6">
        {/* Summary */}
        <div className="flex items-start">
          <div>
            <p className="text-4xl font-semibold tracking-tight text-foreground">
              ${teacher.hourlyRate}
              <span className="ml-1 text-base font-normal text-muted-foreground">
                / lesson
              </span>
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              {formatReviewLessonCount(
                teacher.reviewCount,
                teacher.lessonCount,
              )}
            </p>
          </div>
        </div>

        {/* Booking Button */}
        <button
          type="button"
          onClick={() => setIsBookingModalOpen(true)}
          className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary-dark"
        >
          <CalendarDays className="size-5" />
          Book lesson
        </button>

        {/* Message Button */}
        <button
          type="button"
          className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 text-base font-semibold text-foreground transition-colors hover:bg-secondary"
        >
          <MessageCircle className="size-5" />
          Send a message
        </button>
      </aside>

      {isBookingModalOpen && (
        <BookingModal
          teacher={teacher}
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
        />
      )}
    </>
  );
}

function formatReviewLessonCount(reviewCount: number, lessonCount: number) {
  const reviewsLabel = reviewCount === 1 ? "review" : "reviews";
  const lessonsLabel = lessonCount === 1 ? "lesson" : "lessons";
  return `${reviewCount} ${reviewsLabel} · ${lessonCount} ${lessonsLabel}`;
}
