import type { BookingStatus } from "../api/bookings.api";

export function LessonStatusBadge({ status }: { status: BookingStatus }) {
  const statusStyles: Record<BookingStatus, string> = {
    PENDING_PAYMENT: "bg-amber-100 text-amber-700",
    CONFIRMED: "bg-emerald-100 text-emerald-700",
    COMPLETED: "bg-secondary text-accent-foreground",
    CANCELED: "bg-slate-100 text-slate-600",
    EXPIRED: "bg-slate-100 text-slate-600",
  };

  const statusLabels: Record<BookingStatus, string> = {
    PENDING_PAYMENT: "Payment required",
    CONFIRMED: "Upcoming",
    COMPLETED: "Completed",
    CANCELED: "Canceled",
    EXPIRED: "Expired",
  };

  return (
    <span
      className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}
