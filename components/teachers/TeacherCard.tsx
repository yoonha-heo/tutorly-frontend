import { Star } from "lucide-react";
import Link from "next/link";

import type { Teacher } from "@/features/teachers/types/teachers";

type TeacherCardProps = {
  teacher: Teacher;
};

export function TeacherCard({ teacher }: TeacherCardProps) {
  return (
    <article className="flex flex-col rounded-3xl border border-border bg-background p-5">
      <header className="flex items-start justify-between gap-4">
        <div className="flex gap-4">
          <img
            src={teacher.profileImageUrl ?? "/images/empty-profile.png"}
            alt={`${teacher.user.name} profile`}
            className="size-20 rounded-2xl object-cover"
          />

          <div>
            <h2 className="font-semibold text-foreground">
              {teacher.user.name}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {teacher.teacherLanguages
                .map((item: any) => item.language.name)
                .join(", ")}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              0 reviews · 0 lessons
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 font-medium text-foreground">
          <Star className="size-4 fill-yellow-400 text-yellow-400" />
          <span>New</span>
        </div>
      </header>

      <p className="mt-5 min-h-[42px] line-clamp-2 text-sm leading-6 text-muted-foreground">
        {teacher.headline}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {teacher.teacherSpecialties.map((item: any) => (
          <span
            key={item.specialty.id}
            className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
          >
            {item.specialty.name}
          </span>
        ))}
      </div>

      <footer className="mt-5 flex items-center justify-between border-t border-border pt-5">
        <p className="text-sm text-muted-foreground">
          <span className="text-xl font-semibold text-foreground">
            ${teacher.hourlyRate}
          </span>{" "}
          / hour
        </p>

        <Link
          href={`/teachers/${teacher.id}`}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          View Profile
        </Link>
      </footer>
    </article>
  );
}
