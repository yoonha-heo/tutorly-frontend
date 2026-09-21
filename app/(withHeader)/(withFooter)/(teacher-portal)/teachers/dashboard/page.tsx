import { redirect } from "next/navigation";

import { getMe } from "@/features/auth/api/authApi";
import {
  getMyAvailabilities,
  getMyTeacherProfile,
} from "@/features/teachers/api/teachers.api";
import { TeacherDashboardTabs } from "@/features/teachers/components/TeacherDashBoardTabs";

export default async function TeacherDashboardPage() {
  const me = await getMe();

  if (!me) {
    redirect("/teachers/login?callbackUrl=/teachers/dashboard");
  }

  if (!me.teacherProfile?.id) {
    redirect("/teachers/registration");
  }

  const teacher = await getMyTeacherProfile();
  const isApproved = teacher.status === "APPROVED";
  const isRejected = teacher.status === "REJECTED";
  const availabilities = isApproved ? await getMyAvailabilities() : [];

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

      {isApproved && (
        <TeacherDashboardTabs
          teacher={teacher}
          initialAvailabilities={availabilities}
        />
      )}
      {isRejected && (
        <TeacherDashboardTabs teacher={teacher} profileOnly />
      )}
    </main>
  );
}
