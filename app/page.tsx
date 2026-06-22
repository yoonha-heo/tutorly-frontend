import { GraduationCap, Star, ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const avatars = [
    "/images/avatar-1.png",
    "/images/avatar-2.png",
    "/images/avatar-3.png",
    "/images/avatar-4.png",
  ];

  return (
    <div>
      <header className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-xl bg-primary">
                <GraduationCap className="size-5 text-primary-foreground" />
              </div>

              <span className="text-lg font-semibold text-foreground">
                Tutorly
              </span>
            </Link>

            <div className="ml-8 hidden gap-6 md:flex">
              <Link
                href="/"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Find a tutor
              </Link>
              <Link
                href="/"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Become a tutor
              </Link>
            </div>
          </div>

          <Link
            href="/login"
            className="rounded-xl px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
          >
            Log in
          </Link>
        </nav>
      </header>

      <main>
        <section className="py-12 lg:py-16">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
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
                href="/"
                className="mb-8 flex w-full items-center justify-center rounded-lg bg-primary-dark px-3 py-2 text-primary-foreground md:w-auto"
              >
                <span className="mr-2">Get started</span>
                <ArrowRight className="size-4" />
              </Link>

              <div className="flex items-center justify-center">
                <div className="mr-4 flex -space-x-2">
                  {avatars.map((avatar) => (
                    <img
                      key={avatar}
                      src={avatar}
                      alt=""
                      className="size-8 rounded-full border border-background"
                    />
                  ))}
                </div>
                <span className="max-w-[200px] text-sm font-normal text-muted-foreground md:max-w-none">
                  Join thousands of learners worldwide
                </span>
              </div>
            </div>

            <div className="relative w-full">
              <img
                src="/images/hero-lesson.png"
                alt="Online language lesson"
                className="w-full rounded-3xl border border-border shadow-lg"
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
    </div>
  );
}
