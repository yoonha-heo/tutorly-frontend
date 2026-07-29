import { Award, Languages, Star } from "lucide-react";
import Image from "next/image";

import type { Teacher } from "@/features/teachers/types/teachers";

interface TeacherProfileProps {
  teacher: Teacher;
}

export function TeacherProfile({ teacher }: TeacherProfileProps) {
  const languages =
    teacher.teacherLanguages?.map((item) => item.language.name) ?? [];
  const specialties =
    teacher.teacherSpecialties?.map((item) => item.specialty.name) ?? [];

  return (
    <div className="min-w-0 space-y-6">
      {/* profile header */}
      <section className="rounded-3xl border border-border bg-background p-5 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <Image
            src={teacher.profileImageUrl ?? "/images/empty-profile.png"}
            alt={`${teacher.user.name} profile`}
            width={80}
            height={80}
            className="size-20 rounded-2xl object-cover"
            priority={true}
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

            <p className="mt-5 text-sm text-muted-foreground">0 lessons</p>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="rounded-3xl border border-border bg-background p-5 sm:p-8">
        <h2 className="text-xl font-semibold text-foreground">
          About {teacher.user.name}
        </h2>
        <p className="mt-4 whitespace-pre-line text-base leading-8 text-muted-foreground">
          {teacher.bio}
        </p>
      </section>

      {/* Languages */}
      <section className="rounded-3xl border border-border bg-background p-5 sm:p-8">
        <div className="flex items-center gap-2">
          <Languages className="size-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Languages</h2>
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

      {/* Specialties */}
      <section className="rounded-3xl border border-border bg-background p-5 sm:p-8">
        <div className="flex items-center gap-2">
          <Award className="size-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Specialties</h2>
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
  );
}
