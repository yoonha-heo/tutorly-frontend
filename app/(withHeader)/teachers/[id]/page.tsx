import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { TeacherBookingCard } from "@/features/teachers/components/TeacherBookingCard";
import { TeacherProfile } from "@/features/teachers/components/TeacherProfile"; // 💡 새로 만든 메인 프로필 컴포넌트
import { getTeacher } from "@/features/teachers/api/teachers.api";

interface TeacherDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

// TODO: 동적 SEO로 변경
export const metadata: Metadata = {
  title: "Find Expert Online Language Tutors | Language Platform",
  description:
    "Book affordable 1-on-1 lessons with native-speaking language teachers. Filter by language, specialty, and schedule.",
};

export default async function TeacherDetailPage({
  params,
}: TeacherDetailPageProps) {
  const { id } = await params;

  let teacher;
  try {
    teacher = await getTeacher(id);
  } catch {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <TeacherProfile teacher={teacher} />

        <div className="lg:sticky lg:top-24">
          <TeacherBookingCard teacher={teacher} />
        </div>
      </div>
    </main>
  );
}
