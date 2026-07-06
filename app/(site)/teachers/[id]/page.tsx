import { Calendar, Languages, ShieldCheck, Sparkles, Star } from "lucide-react";
import { getTeacher } from "@/features/teachers/api/teachers.api";

type TeacherDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TeacherDetailPage({
  params,
}: TeacherDetailPageProps) {
  const { id } = await params;
  const teacher = await getTeacher(id);

  const languages =
    teacher.teacherLanguages?.map((item: any) => item.language.name) ?? [];

  const specialties =
    teacher.teacherSpecialties?.map((item: any) => item.specialty.name) ?? [];

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          <section className="flex items-center gap-6 rounded-3xl border border-border bg-background p-6">
            <img
              src={teacher.profileImageUrl ?? "/images/empty-profile.png"}
              alt={`${teacher.user?.name} profile`}
              className="size-28 rounded-3xl object-cover"
            />

            <div className="min-w-0 flex-1">
              <header className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  {teacher.user?.name}
                </h1>

                <div className="flex items-center gap-1 text-foreground">
                  <Star className="size-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">New</span>
                  <span className="text-muted-foreground">(0)</span>
                </div>
              </header>

              <p className="mt-4 text-xl leading-8 text-muted-foreground">
                {teacher.headline}
              </p>

              <p className="mt-3 text-base text-muted-foreground">
                0 lessons taught
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-background p-6">
            <h2 className="text-xl font-bold text-foreground">
              About {teacher.user?.name}
            </h2>

            <p className="mt-5 text-lg leading-9 text-muted-foreground">
              {teacher.bio}
            </p>
          </section>

          <section className="rounded-3xl border border-border bg-background p-6">
            <header className="flex items-center gap-3">
              <Languages className="size-6 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Languages</h2>
            </header>

            <div className="mt-6 flex flex-wrap gap-2">
              {languages.map((language: string) => (
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
              {specialties.map((specialty: string) => (
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
                    ${teacher.hourlyRate}
                  </span>{" "}
                  / hour
                </p>

                <p className="mt-3 text-sm text-muted-foreground">
                  0 reviews · 0 lessons
                </p>
              </div>

              <div className="flex items-center gap-1">
                <Star className="size-4 fill-yellow-400 font-semibold text-yellow-400" />
                <span className="text-foreground">New</span>
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
