"use client";

import { useState } from "react";

import {
  MY_REVIEWS_PAGE_SIZE,
  type WrittenReviewListResponse,
} from "../api/reviews.api";
import { useMyReviews } from "../hooks/useMyReviews";
import { ReviewFeed } from "./ReviewFeed";

interface MyReviewsClientProps {
  initialData: WrittenReviewListResponse;
}

export function MyReviewsClient({ initialData }: MyReviewsClientProps) {
  const [page, setPage] = useState(1);
  const { data } = useMyReviews(page, { initialData });
  const list = data ?? initialData;

  return (
    <main className="mx-auto min-h-[85vh] w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <ReviewFeed
        totalCount={list.totalCount}
        items={list.items.map((review) => ({
          id: review.id,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt,
          name: review.booking.teacher.user.name ?? "Teacher",
          imageUrl: review.booking.teacher.profileImageUrl,
        }))}
        page={page}
        pageSize={MY_REVIEWS_PAGE_SIZE}
        onPageChange={setPage}
      />
    </main>
  );
}
