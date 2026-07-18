import { Star } from "lucide-react";
import type { Teacher } from "@/features/teachers/types/teachers";

interface TeacherProfileHeaderProps {
  teacher: Teacher;
}

export function TeacherProfileHeader({ teacher }: TeacherProfileHeaderProps) {
  return (
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

          <p className="mt-5 text-sm text-muted-foreground">0 lessons</p>
        </div>
      </div>
    </section>
  );
}
