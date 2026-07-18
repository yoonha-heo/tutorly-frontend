import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { TeacherSearchClient } from "@/features/teachers/components/TeacherSearchClient";
import {
  getAvailableLanguages,
  getAvailableSpecialties,
  getTeachers,
} from "@/features/teachers/api/teachers.api";

export const metadata: Metadata = {
  title: "Find Expert Online Language Tutors | Language Platform",
  description:
    "Book affordable 1-on-1 lessons with native-speaking language teachers. Filter by language, specialty, and schedule.",
};

export default async function TeachersPage() {
  const queryClient = new QueryClient();

  const initialParams = { keyword: "", language: "", specialty: "" };

  await Promise.all([
    queryClient.prefetchInfiniteQuery({
      queryKey: ["teachers", initialParams],
      queryFn: ({ pageParam }) =>
        getTeachers({
          ...initialParams,
          page: pageParam,
          limit: 6,
        }),
      initialPageParam: 1,
    }),

    queryClient.prefetchQuery({
      queryKey: ["teacher-options"],
      queryFn: async () => {
        const [languages, specialties] = await Promise.all([
          getAvailableLanguages(),
          getAvailableSpecialties(),
        ]);

        return { languages, specialties };
      },
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="grid gap-4 max-w-6xl m-auto px-4 py-8">
        <TeacherSearchClient />
      </main>
    </HydrationBoundary>
  );
}
