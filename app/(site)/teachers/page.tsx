"use client";

import { useTeacherOptions } from "@/features/teachers/hooks/useTeacherOptions";
import { useTeachers } from "@/features/teachers/hooks/useTeachers";
import { Search, Star, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function TeachersPage() {
  const { data: teachers = [], isLoading, isError } = useTeachers();
  const { data: options } = useTeacherOptions();
  const languages = options?.languages ?? [];
  const specialties = options?.specialties ?? [];

  return (
    <main className="grid gap-4 max-w-6xl m-auto px-4 py-8">
      <section className="rounded-[32px] border border-border bg-background p-6">
        <form className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_220px_220px]">
          <div className="flex h-14 items-center gap-3 rounded-2xl border border-border bg-background px-5 transition-colors focus-within:border-primary">
            <Search className="size-5 text-muted-foreground" />

            <input
              type="search"
              placeholder="Search by name, language, or specialty"
              className="flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>

          <div className="relative">
            <select className="h-14 w-full appearance-none rounded-2xl border border-border bg-background px-5 pr-12 text-base font-medium text-foreground outline-none transition-colors focus:border-primary">
              <option>All languages</option>

              {languages.map((language) => (
                <option key={language.id} value={language.code}>
                  {language.name}
                </option>
              ))}
            </select>

            <ChevronDown className="pointer-events-none absolute right-5 top-1/2 size-5 -translate-y-1/2 text-foreground" />
          </div>

          <div className="relative">
            <select className="h-14 w-full appearance-none rounded-2xl border border-border bg-background px-5 pr-12 text-base font-medium text-foreground outline-none transition-colors focus:border-primary">
              <option>All Specialties</option>

              {specialties.map((specialty) => (
                <option key={specialty.id} value={specialty.code}>
                  {specialty.name}
                </option>
              ))}
            </select>

            <ChevronDown className="pointer-events-none absolute right-5 top-1/2 size-5 -translate-y-1/2 text-foreground" />
          </div>
        </form>

        <p className="mt-6 text-base text-muted-foreground">
          6 teachers available
        </p>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {teachers.map((teacher: any) => (
          <article
            key={teacher.id}
            className="flex flex-col rounded-3xl border border-border bg-background p-5"
          >
            <header className="flex items-start justify-between gap-4">
              <div className="flex gap-4">
                <img
                  src={teacher.profileImageUrl}
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
        ))}
      </section>
    </main>
  );
}
