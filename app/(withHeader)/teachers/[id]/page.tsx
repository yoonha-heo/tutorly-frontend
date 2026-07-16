import { Award, Languages, Star } from "lucide-react";
import { notFound } from "next/navigation";

import { TeacherBookingCard } from "@/components/teachers/TeacherBookingCard";
import { getTeacher } from "@/features/teachers/api/teachers.api";
import type { Teacher } from "@/features/teachers/types/teachers";

interface TeacherDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TeacherDetailPage({
  params,
}: TeacherDetailPageProps) {
  const { id } = await params;

  let teacher: Teacher;

  try {
    teacher = await getTeacher(id);
  } catch {
    notFound();
  }

  const languages =
    teacher.teacherLanguages?.map((item) => item.language.name) ?? [];

  const specialties =
    teacher.teacherSpecialties?.map((item) => item.specialty.name) ?? [];

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-6">
          <section className="rounded-3xl border border-border bg-background p-5 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <img
                src={teacher.profileImageUrl || "/images/empty-profile.png"}
                alt={`${teacher.user.name} profile`}
                className="size-28 shrink-0 rounded-3xl object-cover"
              />

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                    {teacher.user.name}
                  </h1>

                  <div className="flex items-center gap-1.5 text-sm">
                    <Star className="size-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-foreground">5.0</span>
                    <span className="text-muted-foreground">(0)</span>
                  </div>
                </div>

                <p className="mt-3 text-lg leading-7 text-muted-foreground">
                  {teacher.headline}
                </p>

                <p className="mt-5 text-sm text-muted-foreground">
                  0 lessons taught
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-background p-5 sm:p-8">
            <h2 className="text-xl font-semibold text-foreground">
              About {teacher.user.name}
            </h2>

            <p className="mt-4 whitespace-pre-line text-base leading-8 text-muted-foreground">
              {teacher.bio}
            </p>
          </section>

          <section className="rounded-3xl border border-border bg-background p-5 sm:p-8">
            <div className="flex items-center gap-2">
              <Languages className="size-5 text-primary" />

              <h2 className="text-xl font-semibold text-foreground">
                Languages
              </h2>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {languages.map((language) => (
                <span
                  key={language}
                  className="rounded-full bg-secondary px-3 py-1.5 text-sm font-medium text-accent-foreground"
                >
                  {language}
                </span>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-background p-5 sm:p-8">
            <div className="flex items-center gap-2">
              <Award className="size-5 text-primary" />

              <h2 className="text-xl font-semibold text-foreground">
                Specialties
              </h2>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {specialties.map((specialty) => (
                <span
                  key={specialty}
                  className="rounded-full bg-secondary px-3 py-1.5 text-sm font-medium text-accent-foreground"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:sticky lg:top-24">
          <TeacherBookingCard teacher={teacher} />
        </div>
      </div>
    </main>
  );
}
