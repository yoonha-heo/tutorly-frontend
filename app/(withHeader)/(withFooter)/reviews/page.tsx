import type { Metadata } from "next";

import {
  getMyReviews,
  MY_REVIEWS_PAGE_SIZE,
} from "@/features/reviews/api/reviews.api";
import { MyReviewsClient } from "@/features/reviews/components/MyReviewsClient";

export const metadata: Metadata = {
  other: {
    rel: "preconnect",
    href: "https://storage.googleapis.com",
  },
};

export default async function MyReviewsPage() {
  const initialData = await getMyReviews({
    page: 1,
    limit: MY_REVIEWS_PAGE_SIZE,
  });

  return <MyReviewsClient initialData={initialData} />;
}
