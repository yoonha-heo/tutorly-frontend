import { redirect } from "next/navigation";

import { getPendingTeachers } from "@/features/admin/api/admin.api";
import { AdminClient } from "@/features/admin/components/AdminClient";
import { getMe } from "@/features/auth/api/authApi";

export default async function AdminPage() {
  const me = await getMe();

  if (!me) {
    redirect("/login?callbackUrl=/admin");
  }

  if (me.role !== "ADMIN") {
    redirect("/");
  }

  const initialTeachers = await getPendingTeachers();

  return <AdminClient me={me} initialTeachers={initialTeachers} />;
}
