import { memo } from "react";
import { TeacherCard } from "@/features/teachers/components/TeacherCard";
import { TeacherCardSkeleton } from "@/features/teachers/components/TeacherCardSkeleton";
import type { Teacher } from "@/features/teachers/types/teachers";

interface TeacherListSectionProps {
  isLoading: boolean;
  isFetchingNextPage: boolean;
  teachers: Teacher[];
}

export const TeacherListSection = memo(function TeacherListSection({
  isLoading,
  isFetchingNextPage,
  teachers,
}: TeacherListSectionProps) {
  return (
    <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {isLoading
        ? Array.from({ length: 6 }).map((_, index) => (
            <TeacherCardSkeleton key={index} />
          ))
        : teachers.map((teacher, index) => (
            <TeacherCard
              key={teacher.id}
              teacher={teacher}
              priority={index < 3}
            />
          ))}

      {isFetchingNextPage &&
        Array.from({ length: 3 }).map((_, index) => (
          <TeacherCardSkeleton key={`next-${index}`} />
        ))}
    </section>
  );
});
