import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Star, ArrowRight, Calendar } from "lucide-react";

import heroLessonImg from "@/public/images/hero-lesson.png";

export const metadata: Metadata = {
  title: "Find Language Tutors | Filter by Language, Specialty & Schedule",
  description:
    "Find and book the perfect online tutor. Filter by native language, specialty (TOEFL, Business, Conversation), and hourly rates to match your schedule.",
};

export default function HomePage() {
  const avatars = [
    "/images/avatar-1.png",
    "/images/avatar-2.png",
    "/images/avatar-3.png",
    "/images/avatar-4.png",
  ];

  return (
    <main>
      <section className="py-12 lg:py-16">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
          {/* Left Content */}
          <div className="flex w-full flex-col items-start">
            <div className="mb-6 flex items-center justify-center rounded-full bg-secondary px-3 py-1">
              <Star
                className="mr-2 size-4 fill-accent-foreground"
                strokeWidth={0}
              />
              <span className="text-sm font-medium text-accent-foreground">
                Trusted by learners worldwide
              </span>
            </div>

            <h1 className="mb-6 max-w-3xl text-balance text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
              Learn any language with a tutor who fits you
            </h1>

            <p className="mb-6 max-w-md text-pretty text-lg text-muted-foreground">
              Book affordable 1-on-1 online lessons with expert tutors. Pick a
              time, hit join, and start speaking from day one.
            </p>

            <Link
              href="/teachers"
              className="mb-8 flex w-full items-center justify-center rounded-lg bg-primary-dark px-3 py-2 text-primary-foreground md:w-auto"
            >
              <span className="mr-2">Get started</span>
              <ArrowRight className="size-4" />
            </Link>

            <div className="flex items-center justify-center">
              <div className="mr-4 flex -space-x-2">
                {avatars.map((avatar, index) => (
                  <Image
                    key={avatar}
                    src={avatar}
                    alt={`Learner avatar ${index + 1}`}
                    width={32}
                    height={32}
                    className="size-8 rounded-full border border-background"
                  />
                ))}
              </div>
              <span className="max-w-[200px] text-sm font-normal text-muted-foreground md:max-w-none">
                Join thousands of learners worldwide
              </span>
            </div>
          </div>

          {/* Right Visual Image */}
          <div className="relative w-full">
            <Image
              src={heroLessonImg}
              alt="Online language lesson with a tutor"
              width={600}
              height={450}
              priority={true}
              sizes="(min-width: 1024px) 600px, 100vw"
              className="w-full h-auto rounded-3xl border border-border shadow-lg"
            />

            <div className="absolute -bottom-2 -left-2 z-10 inline-flex rounded-3xl border border-border bg-background p-4 shadow-md lg:-bottom-6 lg:-left-6">
              <div className="mr-3 flex size-10 items-center justify-center rounded-full bg-secondary px-2">
                <Calendar className="size-5 text-primary" />
              </div>

              <div className="flex flex-col items-start">
                <span className="text-sm font-semibold text-foreground">
                  Lesson confirmed
                </span>
                <span className="text-xs font-normal text-muted-foreground">
                  with Sofia · Today, 5:00 PM
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
