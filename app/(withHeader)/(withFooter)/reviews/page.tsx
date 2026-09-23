import type { Metadata } from "next";

import { MyReviewsClient } from "@/features/reviews/components/MyReviewsClient";

export const metadata: Metadata = {
  other: {
    rel: "preconnect",
    href: "https://storage.googleapis.com",
  },
};

export default function MyReviewsPage() {
  return <MyReviewsClient />;
}
