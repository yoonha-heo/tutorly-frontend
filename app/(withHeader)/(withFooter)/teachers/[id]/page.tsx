import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { TeacherBookingCard } from "@/features/teachers/components/TeacherBookingCard";
import { TeacherProfile } from "@/features/teachers/components/TeacherProfile";
import { ReviewList } from "@/features/reviews/components/ReviewList";
import { getTeacher } from "@/features/teachers/api/teachers.api";
import { getTeacherReviews } from "@/features/reviews/api/reviews.api";
import type { Teacher } from "@/features/teachers/types/teachers";

interface TeacherDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: TeacherDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const teacher: Teacher = await getTeacher(id);

    const name = teacher.user?.name || "Tutor";
    const language =
      teacher.teacherLanguages?.[0]?.language?.name || "Language";
    const specialties =
      teacher.teacherSpecialties
        ?.map((ts) => ts.specialty?.name)
        .filter(Boolean)
        .slice(0, 2)
        .join(", ") || "General";

    const title = `${name} | 1-on-1 ${language} Tutor (${specialties})`;
    const description = `Book a lesson with ${name}. Specialized in ${specialties}. View schedule and hourly rates.`;

    return {
      title,
      description,
      other: {
        rel: "preconnect",
        href: "https://storage.googleapis.com",
      },
      openGraph: {
        title,
        description,
        type: "profile",
        images: [
          {
            url:
              teacher.profileImageUrl ||
              teacher.user?.profileImage ||
              "/images/empty-profile.png",
          },
        ],
      },
    };
  } catch {
    return {
      title: "Find Language Tutors | Filter by Language, Specialty & Schedule",
      description:
        "Find and book the perfect online tutor. Filter by native language, specialty (TOEFL, Business, Conversation), and hourly rates to match your schedule.",
    };
  }
}

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

  const initialReviews = await getTeacherReviews(id, { page: 1, limit: 4 });

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-6">
          <TeacherProfile teacher={teacher} />
          <ReviewList teacherId={id} initialData={initialReviews} />
        </div>

        <div className="lg:sticky lg:top-24">
          <TeacherBookingCard teacher={teacher} />
        </div>
      </div>
    </main>
  );
}
