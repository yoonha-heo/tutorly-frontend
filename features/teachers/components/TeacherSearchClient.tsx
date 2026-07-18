"use client";

import { useEffect, useRef, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useInfiniteTeachers } from "@/features/teachers/hooks/useInfiniteTeachers";
import { TeacherCard } from "@/features/teachers/components/TeacherCard";
import { TeacherCardSkeleton } from "@/features/teachers/components/TeacherCardSkeleton";
import { TeacherSearchFilter } from "./TeacherSearchFilter";

export function TeacherSearchClient() {
  const [language, setLanguage] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [keyword, setKeyword] = useState("");

  const debounceKeyword = useDebounce(keyword, 300);

  // 서버에서 넘겨받은 하이드레이션 캐시 덕분에 isLoading 없이 즉시 데이터를 그림.
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteTeachers({
      keyword: debounceKeyword,
      language,
      specialty,
    });

  const teachers = data?.pages.flatMap((page) => page.items) ?? [];
  const totalCount = data?.pages[0]?.totalCount ?? 0;

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Infinite scroll observer
  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: "300px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <>
      <TeacherSearchFilter
        keyword={keyword}
        setKeyword={setKeyword}
        language={language}
        setLanguage={setLanguage}
        specialty={specialty}
        setSpecialty={setSpecialty}
        totalCount={totalCount}
      />

      <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <TeacherCardSkeleton key={index} />
            ))
          : teachers.map((teacher) => (
              <TeacherCard key={teacher.id} teacher={teacher} />
            ))}

        {isFetchingNextPage &&
          Array.from({ length: 3 }).map((_, index) => (
            <TeacherCardSkeleton key={`next-${index}`} />
          ))}
      </section>

      <div ref={loadMoreRef} className="h-10" />
    </>
  );
}
