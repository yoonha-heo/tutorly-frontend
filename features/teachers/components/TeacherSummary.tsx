import type { Teacher } from "@/features/teachers/types/teachers";

export function TeacherSummary({ teacher }: { teacher: Teacher }) {
  return (
    <section className="flex items-center gap-4 rounded-2xl border border-border bg-background p-4">
      <img
        src={teacher.profileImageUrl || "/images/empty-profile.png"}
        alt={`${teacher.user.name} profile`}
        className="size-14 shrink-0 rounded-2xl object-cover"
      />
      <div className="min-w-0">
        <p className="text-base font-semibold text-foreground">
          {teacher.user.name}
        </p>
        <p className="mt-0.5 truncate text-sm text-muted-foreground">
          {teacher.headline}
        </p>
      </div>
    </section>
  );
}
