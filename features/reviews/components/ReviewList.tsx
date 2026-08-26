"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { cn } from "@/utils/cn";
import {
  TEACHER_REVIEWS_PAGE_SIZE,
  type TeacherReview,
  type TeacherReviewListResponse,
} from "../api/reviews.api";
import { useTeacherReviews } from "../hooks/useTeacherReviews";

interface ReviewListProps {
  teacherId: string;
  initialData: TeacherReviewListResponse;
}

export function ReviewList({ teacherId, initialData }: ReviewListProps) {
  const [page, setPage] = useState(1);
  const { data } = useTeacherReviews(teacherId, page, { initialData });
  const list = data ?? initialData;
  const reviews = list.items;
  const totalCount = list.totalCount;
  const totalPages = Math.ceil(totalCount / TEACHER_REVIEWS_PAGE_SIZE);

  return (
    <section className="rounded-3xl border border-border bg-background p-5 sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-foreground">Reviews</h2>
        <p className="text-sm text-muted-foreground">
          {totalCount} {totalCount === 1 ? "review" : "reviews"}
        </p>
      </div>

      {reviews.length === 0 ? (
        <p className="mt-6 text-base text-muted-foreground">No reviews yet.</p>
      ) : (
        <ul className="mt-6 divide-y divide-border">
          {reviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <nav
          aria-label="Reviews pagination"
          className="mt-6 flex items-center justify-center gap-2"
        >
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;
            const isActive = pageNumber === page;

            return (
              <button
                key={pageNumber}
                type="button"
                aria-current={isActive ? "page" : undefined}
                onClick={() => setPage(pageNumber)}
                className={cn(
                  "inline-flex size-9 items-center justify-center rounded-lg text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-secondary",
                )}
              >
                {pageNumber}
              </button>
            );
          })}
        </nav>
      )}
    </section>
  );
}

function ReviewItem({ review }: { review: TeacherReview }) {
  const student = review.booking.student;
  const displayName = formatReviewerName(student.name);
  const initial = displayName.charAt(0);

  return (
    <li className="py-6 first:pt-0 last:pb-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          {student.profileImage ? (
            <Image
              src={student.profileImage}
              alt={displayName}
              width={40}
              height={40}
              className="size-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex size-10 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
              {initial}
            </div>
          )}
          <p className="truncate font-semibold text-foreground">
            {displayName}
          </p>
        </div>
        <time
          dateTime={review.createdAt}
          className="shrink-0 text-sm text-muted-foreground"
        >
          {formatReviewTime(review.createdAt)}
        </time>
      </div>

      <div className="mt-3 flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, index) => {
          const isFilled = index < review.rating;
          return (
            <Star
              key={index}
              className={
                isFilled
                  ? "size-4 fill-yellow-400 text-yellow-400"
                  : "size-4 text-muted-foreground/40"
              }
            />
          );
        })}
      </div>

      {review.comment && (
        <p className="mt-3 text-base leading-7 text-muted-foreground">
          {review.comment}
        </p>
      )}
    </li>
  );
}

function formatReviewerName(name: string | null) {
  if (!name) return "Student";

  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];

  return `${parts[0]} ${parts[parts.length - 1].charAt(0).toUpperCase()}.`;
}

function formatReviewTime(createdAt: string) {
  const diffMs = Date.now() - new Date(createdAt).getTime();
  const minutes = Math.max(0, Math.floor(diffMs / 60_000));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years >= 1) return years === 1 ? "1 year ago" : `${years} years ago`;
  if (months >= 1)
    return months === 1 ? "1 month ago" : `${months} months ago`;
  if (days >= 1) return days === 1 ? "1 day ago" : `${days} days ago`;
  if (hours >= 1) return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  if (minutes >= 1)
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  return "Just now";
}
