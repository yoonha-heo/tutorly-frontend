"use client";

import { useState } from "react";

import { useApprovedTeacherAccess } from "@/features/bookings/hooks/useApprovedTeacherAccess";
import { MY_REVIEWS_PAGE_SIZE } from "../api/reviews.api";
import { useMyTeachingReviews } from "../hooks/useMyTeachingReviews";
import { ReviewFeed } from "./ReviewFeed";

export function TeachingReviewsClient() {
  const { canAccess } = useApprovedTeacherAccess("/teachers/reviews");
  const [page, setPage] = useState(1);
  const { data, isPending } = useMyTeachingReviews(page, canAccess);

  if (!canAccess || isPending || !data) {
    return <ReviewsPageSkeleton />;
  }

  return (
    <main className="mx-auto min-h-[85vh] w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <ReviewFeed
        totalCount={data.totalCount}
        items={data.items.map((review) => ({
          id: review.id,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt,
          name: review.booking.student.name ?? "Student",
          imageUrl: review.booking.student.profileImage,
        }))}
        page={page}
        pageSize={MY_REVIEWS_PAGE_SIZE}
        onPageChange={setPage}
      />
    </main>
  );
}

function ReviewsPageSkeleton() {
  return (
    <main
      className="mx-auto min-h-[85vh] w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10"
      aria-label="Loading reviews"
    >
      <section className="rounded-3xl border border-border bg-background p-5 sm:p-8">
        <div className="h-7 w-24 animate-pulse rounded bg-secondary" />
        <div className="mt-6 divide-y divide-border">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="flex items-start gap-3 py-6 first:pt-0">
              <div className="size-10 shrink-0 animate-pulse rounded-full bg-secondary" />
              <div className="flex-1 space-y-3">
                <div className="h-4 w-32 animate-pulse rounded bg-secondary" />
                <div className="h-4 w-24 animate-pulse rounded bg-secondary" />
                <div className="h-4 w-full max-w-xl animate-pulse rounded bg-secondary" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
