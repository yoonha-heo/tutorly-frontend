"use client";

import { CalendarDays, MessageCircle, ShieldCheck, Star } from "lucide-react";
import { useState } from "react";

import type { Teacher } from "@/features/teachers/types/teachers";
import { BookingModal } from "./BookingModal";

interface TeacherBookingCardProps {
  teacher: Teacher;
}

export function TeacherBookingCard({ teacher }: TeacherBookingCardProps) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  return (
    <>
      <aside className="rounded-3xl border border-border bg-background p-5 shadow-sm sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-4xl font-semibold tracking-tight text-foreground">
              ${teacher.hourlyRate}
              <span className="ml-1 text-base font-normal text-muted-foreground">
                / hour
              </span>
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              0 reviews · 0 lessons
            </p>
          </div>

          <div className="flex items-center gap-1.5 pt-2">
            <Star className="size-4 fill-foreground text-foreground" />
            <span className="text-sm font-semibold text-foreground">5.0</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsBookingModalOpen(true)}
          className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary-dark"
        >
          <CalendarDays className="size-5" />
          Book lesson
        </button>

        <button
          type="button"
          className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 text-base font-semibold text-foreground transition-colors hover:bg-secondary"
        >
          <MessageCircle className="size-5" />
          Send a message
        </button>

        <div className="mt-6 border-t border-border pt-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />

            <p className="text-sm leading-5 text-muted-foreground">
              Free trial lesson available. No payment until your lesson is
              confirmed.
            </p>
          </div>
        </div>
      </aside>

      <BookingModal
        teacher={teacher}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </>
  );
}
