"use client";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type LessonStatus =
  | "PENDING_PAYMENT"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELED"
  | "EXPIRED";

type LessonType = "STANDARD" | "INTENSIVE";

interface Lesson {
  id: string;
  teacher: {
    id: string;
    name: string;
    profileImage: string | null;
    flag: string;
  };
  lessonType: LessonType;
  status: LessonStatus;
  startAt: string;
  durationMinutes: number;
  price: number;
  bookedAt: string;
}

const LESSON_STATUS_FILTERS: {
  label: string;
  value: LessonStatus | "ALL";
}[] = [
  { label: "All", value: "ALL" },
  { label: "Pending payment", value: "PENDING_PAYMENT" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Canceled", value: "CANCELED" },
  { label: "Expired", value: "EXPIRED" },
];

const ACCOUNT_NAVIGATION = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Messages",
    href: "/messages",
  },
  {
    label: "My lessons",
    href: "/lessons",
  },
  {
    label: "Settings",
    href: "/settings",
  },
];

const MOCK_LESSONS: Lesson[] = [
  {
    id: "booking-1",
    teacher: {
      id: "teacher-1",
      name: "Sofía M.",
      profileImage: "/images/teachers/sofia.jpg",
      flag: "🇪🇸",
    },
    lessonType: "STANDARD",
    status: "PENDING_PAYMENT",
    startAt: "2026-07-15T10:00:00+09:00",
    durationMinutes: 50,
    price: 18,
    bookedAt: "2026-07-10T11:00:00+09:00",
  },
  {
    id: "booking-2",
    teacher: {
      id: "teacher-2",
      name: "Louis D.",
      profileImage: "/images/teachers/louis.jpg",
      flag: "🇫🇷",
    },
    lessonType: "INTENSIVE",
    status: "CONFIRMED",
    startAt: "2026-07-19T10:00:00+09:00",
    durationMinutes: 50,
    price: 31,
    bookedAt: "2026-07-10T13:00:00+09:00",
  },
  {
    id: "booking-3",
    teacher: {
      id: "teacher-3",
      name: "Yuki T.",
      profileImage: "/images/teachers/yuki.jpg",
      flag: "🇯🇵",
    },
    lessonType: "STANDARD",
    status: "COMPLETED",
    startAt: "2026-07-08T09:00:00+09:00",
    durationMinutes: 50,
    price: 25,
    bookedAt: "2026-07-03T10:00:00+09:00",
  },
  {
    id: "booking-4",
    teacher: {
      id: "teacher-4",
      name: "Marco R.",
      profileImage: "/images/teachers/marco.jpg",
      flag: "🇮🇹",
    },
    lessonType: "STANDARD",
    status: "EXPIRED",
    startAt: "2026-07-05T11:00:00+09:00",
    durationMinutes: 50,
    price: 20,
    bookedAt: "2026-07-01T14:00:00+09:00",
  },
];

export default function LessonsPage() {
  const [selectedStatus, setSelectedStatus] = useState<LessonStatus | "ALL">(
    "ALL",
  );

  const filteredLessons = useMemo(() => {
    if (selectedStatus === "ALL") {
      return MOCK_LESSONS;
    }

    return MOCK_LESSONS.filter((lesson) => lesson.status === selectedStatus);
  }, [selectedStatus]);

  const upcomingLessonCount = MOCK_LESSONS.filter(
    (lesson) => lesson.status === "CONFIRMED",
  ).length;

  const pendingPaymentCount = MOCK_LESSONS.filter(
    (lesson) => lesson.status === "PENDING_PAYMENT",
  ).length;

  const completedLessonCount = MOCK_LESSONS.filter(
    (lesson) => lesson.status === "COMPLETED",
  ).length;

  return (
    <>
      <AccountNavigation />

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            My lessons
          </h1>

          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Track your upcoming, completed, and pending bookings.
          </p>
        </header>

        <section
          aria-label="Lesson summary"
          className="mt-8 grid gap-4 md:grid-cols-3"
        >
          <LessonSummaryCard
            label="Upcoming lessons"
            value={upcomingLessonCount}
            icon={<CalendarDays className="size-5 text-primary" />}
            iconClassName="bg-secondary"
          />

          <LessonSummaryCard
            label="Pending payment"
            value={pendingPaymentCount}
            icon={<CreditCard className="size-5 text-amber-600" />}
            iconClassName="bg-amber-50"
          />

          <LessonSummaryCard
            label="Completed lessons"
            value={completedLessonCount}
            icon={<Star className="size-5 text-muted-foreground" />}
            iconClassName="bg-slate-50"
          />
        </section>

        <LessonStatusFilter
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
        />

        <section className="mt-6">
          {filteredLessons.length > 0 ? (
            <div className="space-y-4">
              {filteredLessons.map((lesson) => (
                <LessonCard key={lesson.id} lesson={lesson} />
              ))}
            </div>
          ) : (
            <LessonsEmptyState status={selectedStatus} />
          )}
        </section>
      </main>
    </>
  );
}

function AccountNavigation() {
  return (
    <nav className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-6xl gap-7 overflow-x-auto px-4 sm:px-6">
        {ACCOUNT_NAVIGATION.map((item) => {
          const isActive = item.href === "/lessons";

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative shrink-0 py-4 text-sm font-medium transition-colors sm:text-base ${
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}

              {isActive && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

interface LessonSummaryCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconClassName: string;
}

function LessonSummaryCard({
  label,
  value,
  icon,
  iconClassName,
}: LessonSummaryCardProps) {
  return (
    <article className="flex items-center gap-4 rounded-2xl border border-border bg-background p-5">
      <div
        className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${iconClassName}`}
      >
        {icon}
      </div>

      <div>
        <p className="text-2xl font-semibold text-foreground">{value}</p>

        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </article>
  );
}

interface LessonStatusFilterProps {
  selectedStatus: LessonStatus | "ALL";
  onStatusChange: (status: LessonStatus | "ALL") => void;
}

function LessonStatusFilter({
  selectedStatus,
  onStatusChange,
}: LessonStatusFilterProps) {
  return (
    <div className="mt-8 overflow-x-auto">
      <div className="flex min-w-max gap-2">
        {LESSON_STATUS_FILTERS.map((filter) => {
          const isSelected = selectedStatus === filter.value;

          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => onStatusChange(filter.value)}
              aria-pressed={isSelected}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface LessonCardProps {
  lesson: Lesson;
}

function LessonCard({ lesson }: LessonCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-background p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <TeacherAvatar
            name={lesson.teacher.name}
            profileImage={lesson.teacher.profileImage}
            flag={lesson.teacher.flag}
          />

          <div className="min-w-0">
            <Link
              href={`/teachers/${lesson.teacher.id}`}
              className="truncate text-base font-semibold text-foreground hover:text-primary"
            >
              {lesson.teacher.name}
            </Link>

            <p className="mt-1 text-sm text-muted-foreground">
              {formatLessonType(lesson.lessonType)}
            </p>
          </div>
        </div>

        <LessonStatusBadge status={lesson.status} />
      </div>

      <div className="mt-5 flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-6">
        <div className="flex items-center gap-2">
          <CalendarDays className="size-5 shrink-0" />
          <span>{formatLessonDate(lesson.startAt)}</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock3 className="size-5 shrink-0" />
          <span>
            {formatLessonTime(lesson.startAt)} · {lesson.durationMinutes} min
          </span>
        </div>
      </div>

      <div className="mt-5 border-t border-border pt-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <p className="text-lg font-semibold text-foreground">
              ${lesson.price}
            </p>

            <p className="text-sm text-muted-foreground">
              Booked {formatBookedDate(lesson.bookedAt)}
            </p>
          </div>

          <LessonAction lesson={lesson} />
        </div>
      </div>
    </article>
  );
}

interface TeacherAvatarProps {
  name: string;
  profileImage: string | null;
  flag: string;
}

function TeacherAvatar({ name, profileImage, flag }: TeacherAvatarProps) {
  return (
    <div className="relative shrink-0">
      {profileImage ? (
        <img
          src={profileImage}
          alt={name}
          className="size-14 rounded-2xl object-cover"
        />
      ) : (
        <div className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-lg font-semibold text-secondary-foreground">
          {name.charAt(0)}
        </div>
      )}

      <span
        aria-hidden="true"
        className="absolute -bottom-1 -right-1 rounded-full bg-background px-0.5 text-xs"
      >
        {flag}
      </span>
    </div>
  );
}

function LessonStatusBadge({ status }: { status: LessonStatus }) {
  const statusStyles: Record<LessonStatus, string> = {
    PENDING_PAYMENT: "bg-amber-100 text-amber-700",
    CONFIRMED: "bg-emerald-100 text-emerald-700",
    COMPLETED: "bg-secondary text-accent-foreground",
    CANCELED: "bg-slate-100 text-slate-600",
    EXPIRED: "bg-slate-100 text-slate-600",
  };

  const statusLabels: Record<LessonStatus, string> = {
    PENDING_PAYMENT: "Pending payment",
    CONFIRMED: "Confirmed",
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

function LessonAction({ lesson }: LessonCardProps) {
  if (lesson.status === "PENDING_PAYMENT") {
    return (
      <Link
        href={`/bookings/${lesson.id}/payment`}
        className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark"
      >
        Complete payment
      </Link>
    );
  }

  if (lesson.status === "CONFIRMED") {
    return (
      <a
        href={`/lessons/${lesson.id}/join`}
        className="inline-flex h-11 items-center justify-center rounded-xl border border-border px-5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
      >
        View lesson
      </a>
    );
  }

  if (lesson.status === "COMPLETED") {
    return (
      <Link
        href={`/lessons/${lesson.id}/review`}
        className="inline-flex h-11 items-center justify-center rounded-xl bg-secondary px-5 text-sm font-semibold text-accent-foreground transition-colors hover:opacity-80"
      >
        Write a review
      </Link>
    );
  }

  if (lesson.status === "EXPIRED") {
    return (
      <Link
        href={`/teachers/${lesson.teacher.id}`}
        className="inline-flex h-11 items-center justify-center rounded-xl border border-border px-5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
      >
        Book again
      </Link>
    );
  }

  return null;
}

function LessonsEmptyState({ status }: { status: LessonStatus | "ALL" }) {
  const isAllLessons = status === "ALL";

  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-border px-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-secondary">
        <CheckCircle2 className="size-7 text-primary" />
      </div>

      <h2 className="mt-5 text-2xl font-semibold text-foreground">
        {isAllLessons ? "No lessons yet" : "No lessons with this status"}
      </h2>

      <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
        {isAllLessons
          ? "As soon as you find a suitable tutor and book your first lesson, you'll see it here."
          : "Your lessons matching this status will appear here."}
      </p>

      {isAllLessons && (
        <Link
          href="/teachers"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark"
        >
          Find a tutor
        </Link>
      )}
    </div>
  );
}

function formatLessonType(lessonType: LessonType) {
  return lessonType === "INTENSIVE" ? "Intensive lesson" : "Standard lesson";
}

function formatLessonDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function formatLessonTime(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(date));
}

function formatBookedDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}
