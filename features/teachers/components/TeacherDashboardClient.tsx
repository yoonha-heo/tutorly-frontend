"use client";

import { useMyTeacherProfile } from "../hooks/useMyTeacherProfile";
import { useTeacherDashboardAccess } from "../hooks/useTeacherDashboardAccess";
import { TeacherDashboardTabs } from "./TeacherDashBoardTabs";

export function TeacherDashboardClient() {
  const { canLoad, me } = useTeacherDashboardAccess();
  const { data: teacher, isPending, isError } = useMyTeacherProfile(canLoad);

  if (!canLoad || isPending) {
    return <TeacherDashboardSkeleton />;
  }

  if (isError || !me || !teacher) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-xl font-semibold text-foreground">
          Could not load your dashboard
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Please try again in a moment.
        </p>
      </main>
    );
  }

  const isApproved = teacher.status === "APPROVED";
  const isRejected = teacher.status === "REJECTED";

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <section className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Teacher Dashboard
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          Welcome back{me.name ? `, ${me.name}` : ""}.
          {isApproved && " Manage your schedule and profile below."}
          {isRejected && " Update your profile below to submit it again."}
        </p>
        {teacher.status === "PENDING" && (
          <p className="mt-4 rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground">
            Your profile is under review. You can manage your schedule and
            profile after it is approved.
          </p>
        )}
        {isRejected && (
          <p className="mt-4 rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground">
            {teacher.rejectionReason
              ? `Your profile was not approved: ${teacher.rejectionReason}`
              : "Your profile was not approved."}
          </p>
        )}
      </section>

      {isApproved && <TeacherDashboardTabs teacher={teacher} />}
      {isRejected && <TeacherDashboardTabs teacher={teacher} profileOnly />}
    </main>
  );
}

function TeacherDashboardSkeleton() {
  return (
    <main
      className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10"
      aria-label="Loading dashboard"
    >
      <section className="mb-8">
        <div className="h-10 w-72 max-w-full animate-pulse rounded bg-secondary" />
        <div className="mt-3 h-6 w-96 max-w-full animate-pulse rounded bg-secondary" />
      </section>
      <div className="h-14 animate-pulse rounded-2xl bg-secondary/50" />
      <div className="mt-6 h-96 animate-pulse rounded-3xl border border-border bg-secondary/50" />
    </main>
  );
}
