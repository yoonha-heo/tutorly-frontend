export function TeacherDetailSkeleton() {
  return (
    <main className="mx-auto max-w-7xl animate-pulse px-6 py-10">
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          <section className="flex items-center gap-6 rounded-3xl border border-border bg-background p-6">
            <div className="size-28 rounded-3xl bg-muted-foreground/30" />

            <div className="min-w-0 flex-1">
              <div className="h-8 w-48 rounded bg-muted-foreground/30" />
              <div className="mt-4 h-6 w-full rounded bg-muted-foreground/30" />
              <div className="mt-3 h-5 w-40 rounded bg-muted-foreground/30" />
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-background p-6">
            <div className="h-7 w-40 rounded bg-muted-foreground/30" />
            <div className="mt-5 space-y-3">
              <div className="h-5 w-full rounded bg-muted-foreground/30" />
              <div className="h-5 w-full rounded bg-muted-foreground/30" />
              <div className="h-5 w-4/5 rounded bg-muted-foreground/30" />
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-background p-6">
            <div className="h-7 w-36 rounded bg-muted-foreground/30" />
            <div className="mt-6 flex gap-2">
              <div className="h-8 w-24 rounded-full bg-muted-foreground/30" />
              <div className="h-8 w-20 rounded-full bg-muted-foreground/30" />
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-background p-6">
            <div className="h-7 w-36 rounded bg-muted-foreground/30" />
            <div className="mt-6 flex gap-2">
              <div className="h-8 w-28 rounded-full bg-muted-foreground/30" />
              <div className="h-8 w-20 rounded-full bg-muted-foreground/30" />
              <div className="h-8 w-24 rounded-full bg-muted-foreground/30" />
            </div>
          </section>
        </div>

        <aside className="lg:col-span-1">
          <div className="rounded-3xl border border-border bg-background p-6 lg:sticky lg:top-24">
            <div className="h-10 w-32 rounded bg-muted-foreground/30" />
            <div className="mt-3 h-5 w-40 rounded bg-muted-foreground/30" />
            <div className="mt-7 h-14 w-full rounded-2xl bg-muted-foreground/30" />

            <div className="mt-7 border-t border-border pt-6">
              <div className="h-5 w-full rounded bg-muted-foreground/30" />
              <div className="mt-2 h-5 w-3/4 rounded bg-muted-foreground/30" />
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
