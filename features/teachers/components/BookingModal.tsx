"use client";

import { AlertCircle, LoaderCircle, Star, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useCreateBooking } from "@/features/bookings/hooks/useCreateBooking";
import { useTeacherAvailabilities } from "@/features/teachers/hooks/useTeacherAvailabilities";
import type { Teacher } from "@/features/teachers/types/teachers";

import { DateSelector } from "./DateSelector";
import { TimeSelector } from "./TimeSelector";
import { processTeacherAvailabilities } from "@/utils/localDateTime";

interface BookingModalProps {
  teacher: Teacher;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingModal({ teacher, isOpen, onClose }: BookingModalProps) {
  const router = useRouter();
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

    const handleKeyDown = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const { availabilitiesByDate, availableWeeks } =
    processTeacherAvailabilities(availabilities);

  const currentWeek = availableWeeks[currentWeekIndex] ?? [];
  const activeDateKey = selectedDateKey || currentWeek[0]?.dateKey || "";
  const availableTimes = availabilitiesByDate.get(activeDateKey) ?? [];
  const canContinue = selectedAvailabilityId !== "" && !isSubmitting;

  const handleContinue = () => {
    if (!canContinue) return;
    setIsSubmitting(true);
    setErrorMessage("");

    createBookingMutation.mutate(
      { availabilityId: selectedAvailabilityId, lessonType: "STANDARD" },
      {
        onSuccess: (booking) => {
          onClose();
          router.push(`/checkout/${booking.id}`);
        },
        onError: () =>
          setErrorMessage("Could not create the booking. Please try again."),
        onSettled: () => setIsSubmitting(false),
      },
    );
  };

  if (!isMounted || !isOpen) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 sm:items-center sm:p-6"
      onMouseDown={(e) =>
        e.target === e.currentTarget && !isSubmitting && onClose()
      }
    >
      <div className="flex max-h-[80dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-background shadow-2xl sm:max-w-2xl sm:rounded-3xl">
        <header className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4 sm:px-7">
          <h2 className="mt-0.5 text-xl font-semibold tracking-tight text-foreground">
            Book lesson
          </h2>
          <button
            type="button"
            onClick={() => !isSubmitting && onClose()}
            className="inline-flex size-10 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </header>

        <div className="overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
          {/* Teacher Summary */}
          <section className="flex items-center gap-4 rounded-2xl border border-border bg-background p-4">
            <Image
              src={teacher.profileImageUrl || "/images/empty-profile.png"}
              alt={`${teacher.user.name} profile`}
              width={56}
              height={56}
              priority
              className="size-14 shrink-0 rounded-2xl object-cover"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-0.5">
                <p className="text-base font-semibold text-foreground">
                  {teacher.user.name}
                </p>
                <div className="flex items-center gap-1.5">
                  <Star className="size-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold text-foreground">
                    5.0
                  </span>
                </div>
              </div>
              <p className="truncate text-sm text-muted-foreground">
                {teacher.headline}
              </p>
            </div>
          </section>

          {/* Date time picker */}
          {isAvailabilityLoading ? (
            <div className="mt-7 grid grid-cols-4 gap-2 sm:grid-cols-7">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[68px] animate-pulse rounded-xl bg-secondary"
                />
              ))}
            </div>
          ) : isAvailabilityError ? (
            <div className="mt-7 rounded-2xl border border-red-200 bg-red-50 p-4">
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
          ) : (
            <DateSelector
              currentWeek={currentWeek}
              currentWeekIndex={currentWeekIndex}
              totalWeeks={availableWeeks.length}
              activeDateKey={activeDateKey}
              onPrevWeek={() => {
                setCurrentWeekIndex((i) => Math.max(0, i - 1));
                setSelectedDateKey("");
                setSelectedAvailabilityId("");
              }}
              onNextWeek={() => {
                setCurrentWeekIndex((i) =>
                  Math.min(availableWeeks.length - 1, i + 1),
                );
                setSelectedDateKey("");
                setSelectedAvailabilityId("");
              }}
              onSelectDate={(key) => {
                setSelectedDateKey(key);
                setSelectedAvailabilityId("");
                setErrorMessage("");
              }}
            />
          )}

          {availableTimes.length > 0 && (
            <TimeSelector
              availableTimes={availableTimes}
              selectedAvailabilityId={selectedAvailabilityId}
              onSelectTime={(id) => {
                setSelectedAvailabilityId(id);
                setErrorMessage("");
              }}
            />
          )}

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
          <div className="flex sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleContinue}
              disabled={!canContinue}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" /> Processing
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
