import type { ReactNode } from "react";

interface LessonSummaryCardProps {
  label: string;
  value: number;
  icon: ReactNode;
  iconClassName: string;
}

export function LessonSummaryCard({
  label,
  value,
  icon,
  iconClassName,
}: LessonSummaryCardProps) {
  return (
    <article className="flex items-center gap-4 rounded-2xl border border-border bg-background p-5">
      <div
        className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${iconClassName}`}
      >
        {icon}
      </div>

      <div>
        <p className="text-2xl font-semibold text-foreground">{value}</p>

        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </article>
  );
}
