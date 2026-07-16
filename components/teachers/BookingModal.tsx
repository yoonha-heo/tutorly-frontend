"use client";

import {
  AlertCircle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  LoaderCircle,
  Moon,
  Sun,
  Sunrise,
  Sunset,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import { useCreateBooking } from "@/features/bookings/hooks/useCreateBooking";
import { useTeacherAvailabilities } from "@/features/teachers/hooks/useTeacherAvailabilities";
import type { TeacherAvailability } from "@/features/teachers/types/teachers";
import type { Teacher } from "@/features/teachers/types/teachers";

interface BookingModalProps {
  teacher: Teacher;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingModal({ teacher, isOpen, onClose }: BookingModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [selectedDateKey, setSelectedDateKey] = useState("");
  const [selectedAvailabilityId, setSelectedAvailabilityId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    data: availabilities = [],
    isLoading: isAvailabilityLoading,
    isError: isAvailabilityError,
    refetch: refetchAvailabilities,
  } = useTeacherAvailabilities(teacher.id, isOpen);
  const createBookingMutation = useCreateBooking({ teacherId: teacher.id });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    setCurrentWeekIndex(0);
    setSelectedDateKey("");
    setSelectedAvailabilityId("");
    setIsSubmitting(false);
    setErrorMessage("");

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const availabilitiesByDate = useMemo(() => {
    return groupAvailabilitiesByDate(availabilities);
  }, [availabilities]);

  const availableDates = useMemo(() => {
    return Array.from(availabilitiesByDate.entries()).map(
      ([dateKey, dateAvailabilities]) => ({
        dateKey,
        startAt: dateAvailabilities[0].startAt,
      }),
    );
  }, [availabilitiesByDate]);

  const availableWeeks = useMemo(() => {
    return chunkArray(availableDates, 7);
  }, [availableDates]);

  const currentWeek = availableWeeks[currentWeekIndex] ?? [];

  const activeDateKey = selectedDateKey || currentWeek[0]?.dateKey || "";

  const availableTimes = availabilitiesByDate.get(activeDateKey) ?? [];
  const browserTimeZone = formatBrowserTimeZone(
    availableTimes[0]?.startAt ?? new Date(),
  );
  const timeSections = [
    {
      label: "Night",
      Icon: Moon,
      availabilities: filterAvailabilitiesByHour(availableTimes, 0, 6),
    },
    {
      label: "Morning",
      Icon: Sunrise,
      availabilities: filterAvailabilitiesByHour(availableTimes, 6, 12),
    },
    {
      label: "Afternoon",
      Icon: Sun,
      availabilities: filterAvailabilitiesByHour(availableTimes, 12, 18),
    },
    {
      label: "Evening",
      Icon: Sunset,
      availabilities: filterAvailabilitiesByHour(availableTimes, 18, 24),
    },
  ];

  const selectedAvailability =
    availabilities.find(
      (availability) => availability.id === selectedAvailabilityId,
    ) ?? null;

  const canContinue = selectedAvailability !== null && !isSubmitting;

  function handleClose() {
    if (isSubmitting) return;

    onClose();
  }

  function handleOverlayMouseDown(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  }

  function handlePreviousWeek() {
    setCurrentWeekIndex((currentIndex) => Math.max(0, currentIndex - 1));

    setSelectedDateKey("");
    setSelectedAvailabilityId("");
  }

  function handleNextWeek() {
    setCurrentWeekIndex((currentIndex) =>
      Math.min(availableWeeks.length - 1, currentIndex + 1),
    );

    setSelectedDateKey("");
    setSelectedAvailabilityId("");
  }

  function handleDateSelect(dateKey: string) {
    setSelectedDateKey(dateKey);
    setSelectedAvailabilityId("");
    setErrorMessage("");
  }

  function handleAvailabilitySelect(availabilityId: string) {
    setSelectedAvailabilityId(availabilityId);
    setErrorMessage("");
  }

  function handleContinue() {
    if (!selectedAvailability || !canContinue) return;

    setIsSubmitting(true);
    setErrorMessage("");

    createBookingMutation.mutate(
      {
        availabilityId: selectedAvailability.id,
        lessonType: "STANDARD",
      },
      {
        onError: () => {
          setErrorMessage("Could not create the booking. Please try again.");
        },
        onSettled: () => {
          setIsSubmitting(false);
        },
      },
    );
  }

  if (!isMounted || !isOpen) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      onMouseDown={handleOverlayMouseDown}
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 sm:items-center sm:p-6"
    >
      <div className="flex max-h-[80dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-background shadow-2xl sm:max-w-2xl sm:rounded-3xl">
        <header className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4 sm:px-7">
          <div>
            <p className="text-sm font-medium text-primary">Tutorly lesson</p>

            <h2
              id="booking-modal-title"
              className="mt-0.5 text-xl font-semibold tracking-tight text-foreground"
            >
              Book a lesson
            </h2>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close booking modal"
            className="inline-flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <X className="size-5" />
          </button>
        </header>

        <div className="overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
          <section className="flex items-center gap-4 rounded-2xl border border-border bg-background p-4">
            <img
              src={teacher.profileImageUrl || "/images/empty-profile.png"}
              alt={`${teacher.user.name} profile`}
              className="size-14 shrink-0 rounded-2xl object-cover"
            />

            <div className="min-w-0">
              <p className="text-base font-semibold text-foreground">
                {teacher.user.name}
              </p>

              <p className="mt-0.5 truncate text-sm text-muted-foreground">
                {teacher.headline}
              </p>
            </div>
          </section>

          <section className="mt-7">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="size-5 text-primary" />

                <h3 className="text-base font-semibold text-foreground">
                  Date
                </h3>
              </div>

              {!isAvailabilityLoading &&
                !isAvailabilityError &&
                availableWeeks.length > 0 && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePreviousWeek}
                      disabled={currentWeekIndex === 0}
                      aria-label="Previous week"
                      className="inline-flex size-9 items-center justify-center rounded-xl border border-border bg-background text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <ChevronLeft className="size-5" />
                    </button>

                    <button
                      type="button"
                      onClick={handleNextWeek}
                      disabled={currentWeekIndex >= availableWeeks.length - 1}
                      aria-label="Next week"
                      className="inline-flex size-9 items-center justify-center rounded-xl border border-border bg-background text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <ChevronRight className="size-5" />
                    </button>
                  </div>
                )}
            </div>

            {isAvailabilityLoading ? (
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                {Array.from({ length: 7 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-[68px] animate-pulse rounded-xl bg-secondary"
                  />
                ))}
              </div>
            ) : isAvailabilityError ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-700">
                  Could not load available lesson times.
                </p>

                <button
                  type="button"
                  onClick={() => refetchAvailabilities()}
                  className="mt-3 text-sm font-semibold text-red-700 underline"
                >
                  Try again
                </button>
              </div>
            ) : availableDates.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-secondary/40 px-4 py-5">
                <p className="text-sm text-muted-foreground">
                  This tutor currently has no available lesson times.
                </p>
              </div>
            ) : (
              <>
                <p className="mb-3 text-sm text-muted-foreground">
                  {formatWeekRange(currentWeek)}
                </p>

                <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                  {currentWeek.map((date) => {
                    const isSelected = activeDateKey === date.dateKey;

                    return (
                      <button
                        key={date.dateKey}
                        type="button"
                        onClick={() => handleDateSelect(date.dateKey)}
                        aria-pressed={isSelected}
                        className={`flex min-w-0 flex-col items-center rounded-xl border px-2 py-3 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-foreground hover:border-primary hover:text-primary"
                        }`}
                      >
                        <span
                          className={`text-xs font-medium ${
                            isSelected
                              ? "text-primary-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {formatAvailabilityWeekday(date.startAt)}
                        </span>

                        <span className="mt-1 text-base font-semibold">
                          {formatAvailabilityDay(date.startAt)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </section>

          <section className="mt-7">
            <div className="mb-1 flex items-center gap-2">
              <Clock3 className="size-5 text-primary" />

              <h3 className="text-base font-semibold text-foreground">Time</h3>
            </div>

            <p className="mb-3 text-sm text-muted-foreground">
              In your time zone, {browserTimeZone}
            </p>

            {availableTimes.length > 0 ? (
              <div className="space-y-7">
                {timeSections.map(({ label, Icon, availabilities }) =>
                  availabilities.length > 0 ? (
                    <section key={label}>
                      <div className="mb-3 flex items-center gap-2">
                        <Icon className="size-5 text-foreground" />
                        <h4 className="font-semibold text-foreground">
                          {label}
                        </h4>
                      </div>

                      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
                        {availabilities.map((availability) => {
                          const isSelected =
                            selectedAvailabilityId === availability.id;

                          return (
                            <button
                              key={availability.id}
                              type="button"
                              onClick={() =>
                                handleAvailabilitySelect(availability.id)
                              }
                              aria-pressed={isSelected}
                              className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                                isSelected
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border bg-background text-foreground hover:border-primary hover:text-primary"
                              }`}
                            >
                              {formatAvailabilityTime(availability.startAt)}
                            </button>
                          );
                        })}
                      </div>
                    </section>
                  ) : null,
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-secondary/40 px-4 py-5 text-sm text-muted-foreground">
                No available lesson times on this date.
              </div>
            )}
          </section>

          {errorMessage && (
            <div
              role="alert"
              className="mt-4 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700"
            >
              <AlertCircle className="mt-0.5 size-5 shrink-0" />
              <p>{errorMessage}</p>
            </div>
          )}
        </div>

        <footer className="shrink-0 border-t border-border bg-background px-5 py-4 sm:px-7">
          <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-border bg-background px-5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleContinue}
              disabled={!canContinue}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  Processing
                </>
              ) : (
                "Continue"
              )}
            </button>
          </div>
        </footer>
      </div>
    </div>,
    document.body,
  );
}

function groupAvailabilitiesByDate(availabilities: TeacherAvailability[]) {
  const groupedAvailabilities = new Map<string, TeacherAvailability[]>();

  for (const availability of availabilities) {
    const dateKey = createLocalDateKey(availability.startAt);

    const dateAvailabilities = groupedAvailabilities.get(dateKey) ?? [];

    dateAvailabilities.push(availability);

    groupedAvailabilities.set(dateKey, dateAvailabilities);
  }

  return groupedAvailabilities;
}

function createLocalDateKey(dateString: string) {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function chunkArray<T>(items: T[], size: number) {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

function formatAvailabilityWeekday(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
  }).format(new Date(dateString));
}

function formatAvailabilityDay(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
  }).format(new Date(dateString));
}

function formatAvailabilityTime(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(dateString));
}

function filterAvailabilitiesByHour(
  availabilities: TeacherAvailability[],
  startHour: number,
  endHour: number,
) {
  return availabilities.filter(({ startAt }) => {
    const hour = new Date(startAt).getHours();

    return hour >= startHour && hour < endHour;
  });
}

function formatBrowserTimeZone(dateValue: string | Date) {
  const date = new Date(dateValue);
  const timeZone =
    Intl.DateTimeFormat().resolvedOptions().timeZone || "Local time";
  const offsetMinutes = -date.getTimezoneOffset();
  const offsetSign = offsetMinutes >= 0 ? "+" : "-";
  const absoluteOffsetMinutes = Math.abs(offsetMinutes);
  const offsetHours = Math.floor(absoluteOffsetMinutes / 60);
  const offsetRemainingMinutes = String(absoluteOffsetMinutes % 60).padStart(
    2,
    "0",
  );

  return `${timeZone} (GMT ${offsetSign}${offsetHours}:${offsetRemainingMinutes})`;
}

function formatWeekRange(
  week: {
    dateKey: string;
    startAt: string;
  }[],
) {
  if (week.length === 0) return "";

  const firstDate = new Date(week[0].startAt);
  const lastDate = new Date(week[week.length - 1].startAt);

  const start = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(firstDate);

  const end = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(lastDate);

  return `${start} - ${end}`;
}
