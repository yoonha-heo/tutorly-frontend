"use client";

import { useState } from "react";

import { usePendingTeachers } from "./usePendingTeachers";

export function useTeacherReviewQueue(enabled: boolean) {
  const { data, isPending, isError } = usePendingTeachers(enabled);
  const [index, setIndex] = useState(0);

  const items = data?.items ?? [];
  const totalCount = items.length;
  const currentIndex = totalCount === 0 ? 0 : Math.min(index, totalCount - 1);
  const currentTeacher = items[currentIndex] ?? null;

  function goToPrevious() {
    setIndex(Math.max(currentIndex - 1, 0));
  }

  function goToNext() {
    setIndex(Math.min(currentIndex + 1, Math.max(totalCount - 1, 0)));
  }

  return {
    currentTeacher,
    currentIndex,
    totalCount,
    queuedCount: data?.totalCount ?? 0,
    hasPrevious: currentIndex > 0,
    hasNext: currentIndex < totalCount - 1,
    goToPrevious,
    goToNext,
    isPending,
    isError,
  };
}
