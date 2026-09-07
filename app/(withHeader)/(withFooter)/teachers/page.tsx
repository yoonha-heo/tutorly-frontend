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
  title: "Online Language Tutors | 1-on-1 Private Lessons | Language Platform",
  description:
    "Learn languages with native-speaking professional tutors. Affordable 1-on-1 online lessons tailored to your goals. Start your free trial today.",
  other: {
    rel: "preconnect",
    href: "https://storage.googleapis.com",
  },
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
