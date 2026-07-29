"use client";

import { Search, ChevronDown } from "lucide-react";
import { useTeacherOptions } from "@/features/teachers/hooks/useTeacherOptions";

interface TeacherSearchFilterProps {
  keyword: string;
  setKeyword: (value: string) => void;
  language: string;
  setLanguage: (value: string) => void;
  specialty: string;
  setSpecialty: (value: string) => void;
  totalCount: number;
}

export function TeacherSearchFilter({
  keyword,
  setKeyword,
  language,
  setLanguage,
  specialty,
  setSpecialty,
  totalCount,
}: TeacherSearchFilterProps) {
  // prefetched cache data
  const { data: options } = useTeacherOptions();
  const { languages, specialties } = options;

  return (
    <section className="rounded-[32px] border border-border bg-background p-6">
      <form
        className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_220px_220px]"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* Keyword Search */}
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

        {/* Language Select */}
        <div className="relative">
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className="h-14 w-full appearance-none rounded-2xl border border-border bg-background px-5 pr-12 text-base font-medium text-foreground outline-none transition-colors focus:border-primary"
            aria-label="Language selection"
          >
            <option value="">Language</option>
            {languages.map((lang) => (
              <option key={lang.id} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-5 top-1/2 size-5 -translate-y-1/2 text-foreground" />
        </div>

        {/* Specialty Select */}
        <div className="relative">
          <select
            value={specialty}
            onChange={(event) => setSpecialty(event.target.value)}
            className="h-14 w-full appearance-none rounded-2xl border border-border bg-background px-5 pr-12 text-base font-medium text-foreground outline-none transition-colors focus:border-primary"
            aria-label="Specialty selection"
          >
            <option value="">Specialty</option>
            {specialties.map((spec) => (
              <option key={spec.id} value={spec.code}>
                {spec.name}
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
  );
}
