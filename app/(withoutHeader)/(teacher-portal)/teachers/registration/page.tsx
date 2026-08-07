import { getMe } from "@/features/auth/api/authApi";
import {
  getAvailableLanguages,
  getAvailableSpecialties,
} from "@/features/teachers/api/teachers.api";
import { TeacherRegistrationForm } from "@/features/teachers/components/TeacherRegistrationForm";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";

export default async function TeacherRegistrationPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["teacher-options"],
    queryFn: async () => {
      const [languages, specialties] = await Promise.all([
        getAvailableLanguages(),
        getAvailableSpecialties(),
      ]);

      return { languages, specialties };
    },
  });

  // teacher registration guard
  const me = await getMe();

  if (me?.role === "STUDENT") {
    redirect("/teachers");
  }

  if (me?.teacherProfile) {
    redirect("/teachers/dashboard");
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-14">
      <section>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Become a Tutorly teacher
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-10 text-muted-foreground">
          Share your teaching style and expertise. Once approved, learners
          around the world can book lessons with you.
        </p>
      </section>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <TeacherRegistrationForm />
      </HydrationBoundary>
    </main>
  );
}
