import { CheckCircle2 } from "lucide-react";

export function LessonsEmptyState() {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-border px-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-secondary">
        <CheckCircle2 className="size-7 text-primary" />
      </div>

      <h2 className="mt-5 text-2xl font-semibold text-foreground">
        No lessons with this status
      </h2>

      <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
        Your lessons matching this status will appear here.
      </p>
    </div>
  );
}

export function LessonsLoadingState() {
  return (
    <div className="space-y-4" aria-label="Loading lessons">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="h-48 animate-pulse rounded-2xl border border-border bg-secondary/50"
        />
      ))}
    </div>
  );
}

export function LessonsErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-border px-6 text-center">
      <h2 className="text-xl font-semibold text-foreground">
        Could not load your lessons
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Please try again in a moment.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground"
      >
        Try again
      </button>
    </div>
  );
}
