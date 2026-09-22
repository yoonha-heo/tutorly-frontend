import { CalendarDays, Clock3 } from "lucide-react";
import Image from "next/image";

import type { TeachingBooking } from "../api/bookings.api";
import { LessonStatusBadge } from "./LessonStatusBadge";
import {
  formatLocalLessonDate,
  formatLocalLessonTimeRange,
  getLessonDurationMinutes,
  formatLocalBookedDate,
} from "@/utils/localDateTime";

interface TeachingLessonCardProps {
  booking: TeachingBooking;
  priority?: boolean;
}

export function TeachingLessonCard({
  booking,
  priority,
}: TeachingLessonCardProps) {
  const studentName = booking.student.name ?? "Student";
  const durationMinutes = getLessonDurationMinutes(
    booking.lessonStartAt,
    booking.lessonEndAt,
  );

  return (
    <article className="rounded-2xl border border-border bg-background p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <div className="shrink-0">
            {booking.student.profileImage ? (
              <Image
                src={booking.student.profileImage}
                alt={studentName}
                width={56}
                height={56}
                priority={priority}
                className="size-14 rounded-2xl object-cover"
              />
            ) : (
              <div className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-lg font-semibold text-secondary-foreground">
                {studentName.charAt(0) || "S"}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-foreground">
              {studentName}
            </p>
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

          {booking.status === "CONFIRMED" && booking.meetingUrl && (
            <a
              href={booking.meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark"
            >
              Join lesson
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
