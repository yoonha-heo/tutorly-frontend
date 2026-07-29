import { CalendarDays, Clock3 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { memo } from "react";

import type { Booking } from "../api/bookings.api";
import { LessonStatusBadge } from "./LessonStatusBadge";
import {
  formatLocalLessonDate,
  formatLocalLessonTimeRange,
  getLessonDurationMinutes,
  formatLocalBookedDate,
} from "@/utils/localDateTime";

interface LessonCardProps {
  booking: Booking;
  priority?: boolean;
}

export const LessonCard = memo(function LessonCard({
  booking,
  priority,
}: LessonCardProps) {
  const durationMinutes = getLessonDurationMinutes(
    booking.lessonStartAt,
    booking.lessonEndAt,
  );

  return (
    <article className="rounded-2xl border border-border bg-background p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <div className="shrink-0">
            {booking.teacher.profileImageUrl ? (
              <Image
                src={booking.teacher.profileImageUrl}
                alt={booking.teacher.user.name}
                width={56}
                height={56}
                priority={priority}
                className="size-14 rounded-2xl object-cover"
              />
            ) : (
              <div className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-lg font-semibold text-secondary-foreground">
                {booking.teacher.user.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <Link
              href={`/teachers/${booking.teacherId}`}
              className="truncate text-base font-semibold text-foreground hover:text-primary"
            >
              {booking.teacher.user.name}
            </Link>
          </div>
        </div>

        <LessonStatusBadge status={booking.status} />
      </div>

      <div className="mt-5 flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-6">
        <div className="flex items-center gap-2">
          <CalendarDays className="size-5 shrink-0" />
          <span>{formatLocalLessonDate(booking.lessonStartAt)}</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock3 className="size-5 shrink-0" />
          <span>
            {formatLocalLessonTimeRange(
              booking.lessonStartAt,
              booking.lessonEndAt,
            )}{" "}
            · {durationMinutes} min
          </span>
        </div>
      </div>

      <div className="mt-5 border-t border-border pt-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <p className="text-lg font-semibold text-foreground">
              ${booking.price}
            </p>
            <p className="text-sm text-muted-foreground">
              Booked {formatLocalBookedDate(booking.createdAt)}
            </p>
          </div>

          <LessonAction booking={booking} />
        </div>
      </div>
    </article>
  );
});

function LessonAction({ booking }: LessonCardProps) {
  if (booking.status === "PENDING_PAYMENT") {
    return (
      <Link
        href={`/bookings/${booking.id}/payment`}
        className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark"
      >
        Complete payment
      </Link>
    );
  }

  if (booking.status === "CONFIRMED") {
    return (
      <button
        type="button"
        className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-secondary/50 px-5 text-sm font-semibold text-muted-foreground cursor-not-allowed"
      >
        View lesson
      </button>
    );
  }

  if (booking.status === "COMPLETED") {
    return (
      <Link
        href={`/teachers/${booking.teacherId}`}
        className="inline-flex h-11 items-center justify-center rounded-xl bg-secondary px-5 text-sm font-semibold text-accent-foreground transition-colors hover:opacity-80"
      >
        Book again
      </Link>
    );
  }

  return null;
}
