import { Calendar, Languages, ShieldCheck, Sparkles, Star } from "lucide-react";

type TeacherDetailPageProps = {
  params: {
    id: string;
  };
};

export default async function TeacherDetailPage({
  params,
}: TeacherDetailPageProps) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          <section className="flex items-center gap-6 rounded-3xl border border-border bg-background p-6">
            <div className="relative shrink-0">
              <img
                src="/images/avatar-1.png"
                alt="Sofía profile"
                className="size-28 rounded-3xl object-cover"
              />
              <span className="absolute -bottom-1 -right-2 text-2xl">🇪🇸</span>
            </div>

            <div className="min-w-0 flex-1">
              <header className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  Sofía M.
                </h1>

                <div className="flex items-center gap-1 text-foreground">
                  <Star className="size-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">5.0</span>
                  <span className="text-muted-foreground">(214)</span>
                </div>
              </header>

              <p className="mt-4 text-xl leading-8 text-muted-foreground">
                Certified Spanish tutor — speak with confidence from day one
              </p>

              <p className="mt-3 text-base text-muted-foreground">
                1,820 lessons taught
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-background p-6">
            <h2 className="text-xl font-bold text-foreground">About Sofía</h2>

            <p className="mt-5 text-lg leading-9 text-muted-foreground">
              ¡Hola! I'm Sofía, a certified language teacher from Madrid with 6
              years of experience helping learners of every level. My lessons
              are relaxed, conversation-first, and tailored to your goals —
              whether that's travel, work, or simply chatting with friends.
              We'll build real speaking habits, not just memorize rules.
            </p>
          </section>

          <section className="rounded-3xl border border-border bg-background p-6">
            <header className="flex items-center gap-3">
              <Languages className="size-6 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Languages</h2>
            </header>

            <div className="mt-6 flex flex-wrap gap-2">
              {["Spanish", "English"].map((language) => (
                <span
                  key={language}
                  className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
                >
                  {language}
                </span>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-background p-6">
            <header className="flex items-center gap-3">
              <Sparkles className="size-6 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Specialties</h2>
            </header>

            <div className="mt-6 flex flex-wrap gap-2">
              {["Conversation", "Business", "Beginners"].map((specialty) => (
                <span
                  key={specialty}
                  className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </section>
        </div>

        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-24 rounded-3xl border border-border bg-background p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground">
                  <span className="text-4xl font-bold text-foreground">
                    $18
                  </span>{" "}
                  / hour
                </p>

                <p className="mt-3 text-sm text-muted-foreground">
                  214 reviews · 1,820 lessons
                </p>
              </div>

              <div className="flex items-center gap-1 font-semibold text-foreground">
                <Star className="size-4 fill-foreground text-foreground" />
                <span>5.0</span>
              </div>
            </div>

            <button className="mt-7 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90">
              <Calendar className="size-5" />
              Book lesson
            </button>

            <div className="mt-7 border-t border-border pt-6">
              <div className="flex gap-3 text-sm leading-6 text-muted-foreground">
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
                <p>
                  Free trial lesson available. No payment until your lesson is
                  confirmed.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
