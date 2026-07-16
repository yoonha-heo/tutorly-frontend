"use client";

import { useEffect, useRef, useState } from "react";
import { Search, ChevronDown } from "lucide-react";

import { useTeacherOptions } from "@/features/teachers/hooks/useTeacherOptions";
import { useDebounce } from "@/hooks/useDebounce";
import { useInfiniteTeachers } from "@/features/teachers/hooks/useInfiniteTeachers";
import { TeacherCard } from "@/components/teachers/TeacherCard";
import { TeacherCardSkeleton } from "@/components/teachers/TeacherCardSkeleton";
import { Teacher } from "@/features/teachers/types/teachers";

export default function TeachersPage() {
  const [language, setLanguage] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [keyword, setKeyword] = useState("");

  const debounceKeyword = useDebounce(keyword, 300);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteTeachers({
    keyword: debounceKeyword,
    language,
    specialty,
  });

  const teachers: Teacher[] = data?.pages.flatMap((page) => page.items) ?? [];
  const totalCount = data?.pages[0]?.totalCount ?? 0;

  const { data: options } = useTeacherOptions();

  const languages = options?.languages ?? [];
  const specialties = options?.specialties ?? [];

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const target = loadMoreRef.current;

    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];

        if (firstEntry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        rootMargin: "300px",
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <main className="grid gap-4 max-w-6xl m-auto px-4 py-8">
      {/* Search Filter */}
      <section className="rounded-[32px] border border-border bg-background p-6">
        <form className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_220px_220px]">
          <div className="flex h-14 items-center gap-3 rounded-2xl border border-border bg-background px-5 transition-colors focus-within:border-primary">
            <Search className="size-5 text-muted-foreground" />

            <input
              type="search"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Search by name or keyword"
              className="flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>

          <div className="relative">
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="h-14 w-full appearance-none rounded-2xl border border-border bg-background px-5 pr-12 text-base font-medium text-foreground outline-none transition-colors focus:border-primary"
            >
              <option value="" disabled>
                Language
              </option>

              {languages.map((language) => (
                <option key={language.id} value={language.code}>
                  {language.name}
                </option>
              ))}
            </select>

            <ChevronDown className="pointer-events-none absolute right-5 top-1/2 size-5 -translate-y-1/2 text-foreground" />
          </div>

          <div className="relative">
            <select
              value={specialty}
              onChange={(event) => setSpecialty(event.target.value)}
              className="h-14 w-full appearance-none rounded-2xl border border-border bg-background px-5 pr-12 text-base font-medium text-foreground outline-none transition-colors focus:border-primary"
            >
              <option value="" disabled>
                Specialty
              </option>

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
          {totalCount} teachers available
        </p>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <TeacherCardSkeleton key={index} />
            ))
          : teachers.map((teacher: any) => (
              <TeacherCard key={teacher.id} teacher={teacher} />
            ))}

        {isFetchingNextPage &&
          Array.from({ length: 3 }).map((_, index) => (
            <TeacherCardSkeleton key={`next-${index}`} />
          ))}
      </section>

      <div ref={loadMoreRef} className="h-10" />
    </main>
  );
}
