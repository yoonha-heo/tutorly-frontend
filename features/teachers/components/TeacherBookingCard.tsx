"use client";

import { CalendarDays, MessageCircle } from "lucide-react";
import { useState } from "react";
import dynamic from "next/dynamic";

import { useMe } from "@/features/auth/hooks/useMe";
import type { Teacher } from "@/features/teachers/types/teachers";
import { cn } from "@/utils/cn";

interface TeacherBookingCardProps {
  teacher: Teacher;
}

const BookingModal = dynamic(
  () => import("./BookingModal").then((mod) => mod.BookingModal),
  {
    ssr: false,
  },
);

const MessageModal = dynamic(
  () => import("./MessageModal").then((mod) => mod.MessageModal),
  {
    ssr: false,
  },
);

export function TeacherBookingCard({ teacher }: TeacherBookingCardProps) {
  const { data: me } = useMe();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const canBookLesson = me?.role !== "TEACHER";

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

        {canBookLesson && (
          <button
            type="button"
            onClick={() => setIsBookingModalOpen(true)}
            className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary-dark"
          >
            <CalendarDays className="size-5" />
            Book lesson
          </button>
        )}

        {/* Message Button */}
        <button
          type="button"
          onClick={() => setIsMessageModalOpen(true)}
          className={cn(
            "inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 text-base font-semibold text-foreground transition-colors hover:bg-secondary",
            canBookLesson ? "mt-3" : "mt-6",
          )}
        >
          <MessageCircle className="size-5" />
          Send a message
        </button>
      </aside>

      {canBookLesson && isBookingModalOpen && (
        <BookingModal
          teacher={teacher}
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
        />
      )}

      {isMessageModalOpen && (
        <MessageModal
          teacher={teacher}
          isOpen={isMessageModalOpen}
          onClose={() => setIsMessageModalOpen(false)}
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
