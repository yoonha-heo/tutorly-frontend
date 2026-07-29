"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useInfiniteTeachers } from "@/features/teachers/hooks/useInfiniteTeachers";
import { TeacherSearchFilter } from "./TeacherSearchFilter";
import { TeacherListSection } from "./TeacherListSection";

export function TeacherSearchClient() {
  const [language, setLanguage] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [keyword, setKeyword] = useState("");

  const debounceKeyword = useDebounce(keyword, 300);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteTeachers({
      keyword: debounceKeyword,
      language,
      specialty,
    });

  const teachers = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? [];
  }, [data]);

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

      <TeacherListSection
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        teachers={teachers}
      />

      <div ref={loadMoreRef} className="h-10" />
    </>
  );
}
