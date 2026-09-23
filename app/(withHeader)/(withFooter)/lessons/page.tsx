import type { Metadata } from "next";

import { MyLessonsClient } from "@/features/bookings/components/MyLessonsClient";

export const metadata: Metadata = {
  other: {
    rel: "preconnect",
    href: "https://storage.googleapis.com",
  },
};

export default function LessonsPage() {
  return <MyLessonsClient />;
}
