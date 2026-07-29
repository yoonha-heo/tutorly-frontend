import { Metadata } from "next";
import { getMyBookings } from "@/features/bookings/api/bookings.api"; // Server API
import { LessonSummaryCard } from "@/features/bookings/components/LessonSummaryCard";
import { LessonListContainer } from "@/features/bookings/components/LessonListContainer";
import { CalendarDays, CreditCard, Star } from "lucide-react";

export const metadata: Metadata = {
  other: {
    rel: "preconnect",
    href: "https://storage.googleapis.com",
  },
};

export default async function LessonsPage() {
  const bookings = await getMyBookings();

  const upcomingCount = bookings.filter((b) => b.status === "CONFIRMED").length;
  const paymentRequiredCount = bookings.filter(
    (b) => b.status === "PENDING_PAYMENT",
  ).length;
  const completedCount = bookings.filter(
    (b) => b.status === "COMPLETED",
  ).length;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 min-h-[85vh]">
      <section
        aria-label="Lesson summary"
        className="mt-8 grid gap-4 md:grid-cols-3"
      >
        <LessonSummaryCard
          label="Upcoming lessons"
          value={upcomingCount}
          icon={<CalendarDays className="size-5 text-primary" />}
          iconClassName="bg-secondary"
        />
        <LessonSummaryCard
          label="Payment required"
          value={paymentRequiredCount}
          icon={<CreditCard className="size-5 text-amber-600" />}
          iconClassName="bg-amber-50"
        />
        <LessonSummaryCard
          label="Completed lessons"
          value={completedCount}
          icon={<Star className="size-5 text-muted-foreground" />}
          iconClassName="bg-slate-50"
        />
      </section>

      <LessonListContainer initialBookings={bookings} />
    </main>
  );
}
