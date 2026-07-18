import { Award, Languages } from "lucide-react";
import type { Teacher } from "@/features/teachers/types/teachers";
import { TeacherProfileHeader } from "./TeacherProfileHeader";

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
      <section className="rounded-3xl border border-border bg-background p-5 sm:p-8">
        <TeacherProfileHeader teacher={teacher} />
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
