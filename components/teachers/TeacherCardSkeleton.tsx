export function TeacherCardSkeleton() {
  return (
    <article className="flex animate-pulse flex-col rounded-3xl border border-border bg-background p-5">
      <header className="flex items-start justify-between gap-4">
        <div className="flex gap-4">
          <div className="size-20 rounded-2xl bg-muted-foreground/30" />

          <div>
            <div className="h-5 w-28 rounded bg-muted-foreground/30" />
            <div className="mt-3 h-4 w-24 rounded bg-muted-foreground/30" />
            <div className="mt-3 h-4 w-32 rounded bg-muted-foreground/30" />
          </div>
        </div>

        <div className="h-5 w-12 rounded bg-muted-foreground/30" />
      </header>

      <div className="mt-5 space-y-2">
        <div className="h-4 w-full rounded bg-muted-foreground/30" />
        <div className="h-4 w-4/5 rounded bg-muted-foreground/30" />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <div className="h-6 w-24 rounded-full bg-muted-foreground/30" />
        <div className="h-6 w-20 rounded-full bg-muted-foreground/30" />
        <div className="h-6 w-16 rounded-full bg-muted-foreground/30" />
      </div>

      <footer className="mt-5 flex items-center justify-between border-t border-border pt-5">
        <div className="h-7 w-24 rounded bg-muted-foreground/30" />
        <div className="h-10 w-28 rounded-xl bg-muted-foreground/30" />
      </footer>
    </article>
  );
}
