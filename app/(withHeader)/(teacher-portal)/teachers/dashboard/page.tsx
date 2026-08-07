import { redirect } from "next/navigation";

import { getMe } from "@/features/auth/api/authApi";
import {
  getMyAvailabilities,
  getTeacher,
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

  const teacherId = me.teacherProfile.id;

  const [teacher, availabilities] = await Promise.all([
    getTeacher(teacherId),
    getMyAvailabilities(),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <section className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Teacher Dashboard
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          Welcome back{me.name ? `, ${me.name}` : ""}. Manage your schedule and
          profile below.
        </p>
      </section>

      <TeacherDashboardTabs
        teacher={teacher}
        initialAvailabilities={availabilities}
      />
    </main>
  );
}
