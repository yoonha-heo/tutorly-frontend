"use client";

import { LoaderCircle, Star, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import type { Booking } from "@/features/bookings/api/bookings.api";
import { useCreateReview } from "@/features/reviews/hooks/useCreateReview";
import { cn } from "@/utils/cn";
import {
  createLocalDateKey,
  formatAvailabilityTime,
} from "@/utils/localDateTime";

const MAX_REVIEW_LENGTH = 500;

interface ReviewModalProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: () => void;
}

export function ReviewModal({
  booking,
  isOpen,
  onClose,
  onSubmitted,
}: ReviewModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const createReviewMutation = useCreateReview();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    setRating(0);
    setHoveredRating(0);
    setComment("");
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !createReviewMutation.isPending) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, createReviewMutation.isPending]);

  const trimmedComment = comment.trim();
  const canSubmit =
    rating > 0 &&
    trimmedComment.length > 0 &&
    comment.length <= MAX_REVIEW_LENGTH &&
    !createReviewMutation.isPending;

  const displayedRating = hoveredRating || rating;

  const handleSubmit = () => {
    if (!canSubmit) return;

    createReviewMutation.mutate(
      {
        bookingId: booking.id,
        rating,
        comment: trimmedComment,
      },
      {
        onSuccess: () => {
          onSubmitted();
          onClose();
        },
      },
    );
  };

  if (!isMounted || !isOpen) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-title"
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !createReviewMutation.isPending
        ) {
          onClose();
        }
      }}
    >
      <div className="flex max-h-[90dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-background shadow-2xl sm:max-w-lg sm:rounded-3xl">
        <header className="flex shrink-0 items-start justify-between gap-4 px-5 pt-5 sm:px-7 sm:pt-6">
          <h2
            id="review-modal-title"
            className="text-xl font-semibold tracking-tight text-foreground"
          >
            Review your lesson with {booking.teacher.user.name}
          </h2>
          <button
            type="button"
            onClick={() => !createReviewMutation.isPending && onClose()}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </header>

        <div className="overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
          <section className="flex items-center gap-3">
            {booking.teacher.profileImageUrl ? (
              <Image
                src={booking.teacher.profileImageUrl}
                alt={booking.teacher.user.name}
                width={48}
                height={48}
                className="size-12 rounded-2xl object-cover"
              />
            ) : (
              <div className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-base font-semibold text-secondary-foreground">
                {booking.teacher.user.name.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <p className="font-semibold text-foreground">Standard lesson</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {createLocalDateKey(booking.lessonStartAt)} ·{" "}
                {formatAvailabilityTime(booking.lessonStartAt)}
              </p>
            </div>
          </section>

          <section className="mt-8">
            <p className="font-medium text-foreground">How was your lesson?</p>
            <div
              className="mt-3 flex items-center gap-1"
              onMouseLeave={() => setHoveredRating(0)}
            >
              {Array.from({ length: 5 }, (_, index) => {
                const value = index + 1;
                const isActive = value <= displayedRating;

                return (
                  <button
                    key={value}
                    type="button"
                    aria-label={`Rate ${value} star${value === 1 ? "" : "s"}`}
                    onMouseEnter={() => setHoveredRating(value)}
                    onClick={() => setRating(value)}
                    className="rounded-md p-0.5 text-muted-foreground/40 transition-colors hover:text-yellow-400"
                  >
                    <Star
                      className={cn(
                        "size-8",
                        isActive && "fill-yellow-400 text-yellow-400",
                      )}
                    />
                  </button>
                );
              })}
            </div>
          </section>

          <section className="mt-8">
            <label
              htmlFor="review-comment"
              className="font-medium text-foreground"
            >
              Your review
            </label>
            <textarea
              id="review-comment"
              value={comment}
              maxLength={MAX_REVIEW_LENGTH}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Share what you enjoyed about this lesson."
              className="mt-3 min-h-32 w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm leading-6 text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
            />
            <p className="mt-2 text-right text-xs text-muted-foreground">
              {comment.length}/{MAX_REVIEW_LENGTH}
            </p>
          </section>
        </div>

        <footer className="flex shrink-0 justify-end gap-2 px-5 pb-5 sm:px-7 sm:pb-6">
          <button
            type="button"
            onClick={() => !createReviewMutation.isPending && onClose()}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-background px-5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
          >
            {createReviewMutation.isPending ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                Submitting
              </>
            ) : (
              "Submit review"
            )}
          </button>
        </footer>
      </div>
    </div>,
    document.body,
  );
}
