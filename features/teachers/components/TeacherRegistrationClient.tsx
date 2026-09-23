"use client";

import { useTeacherOptions } from "../hooks/useTeacherOptions";
import { useTeacherRegistrationAccess } from "../hooks/useTeacherRegistrationAccess";
import { TeacherRegistrationForm } from "./TeacherRegistrationForm";

export function TeacherRegistrationClient() {
  const { canRegister } = useTeacherRegistrationAccess();
  useTeacherOptions();

  if (!canRegister) {
    return <TeacherRegistrationSkeleton />;
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

      <TeacherRegistrationForm />
    </main>
  );
}

function TeacherRegistrationSkeleton() {
  return (
    <main
      className="mx-auto max-w-5xl px-6 py-14"
      aria-label="Loading registration"
    >
      <div className="h-10 w-80 max-w-full animate-pulse rounded bg-secondary" />
      <div className="mt-5 h-10 w-[36rem] max-w-full animate-pulse rounded bg-secondary" />
      <div className="mt-12 h-[640px] animate-pulse rounded-[32px] border border-border bg-secondary/50" />
    </main>
  );
}
