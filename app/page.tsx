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
      <header
        className="sticky top-0 z-50 
      border-b border-gray-200
      bg-white/70 backdrop-blur-md px-6 py-4 md:px-10 lg:px-32"
      >
        <nav className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex justify-center items-center size-8 bg-[lab(39.3875_51.982_-95.6741)] rounded-xl">
                <GraduationCap className="size-5 text-white" />
              </div>

              <span className="text-lg font-semibold">Tutorly</span>
            </Link>

            <div className="hidden md:flex gap-6 ml-8">
              <Link
                href="/"
                className="text-sm font-medium text-gray-500 hover:text-black"
              >
                Find a tutor
              </Link>
              <Link
                href="/"
                className="text-sm font-medium text-gray-500 hover:text-black"
              >
                Become a tutor
              </Link>
            </div>
          </div>

          <Link
            href="/login"
            className="px-3 py-2 text-sm font-medium hover:bg-gray-100 rounded-xl"
          >
            Log in
          </Link>
        </nav>
      </header>

      <main>
        {/* hero */}
        <section className="flex flex-col gap-12 px-6 py-12 md:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-32 lg:py-16">
          <div className="w-full flex flex-col items-start lg:flex-1">
            <div className="flex items-center justify-center px-3 py-1 rounded-full bg-[lab(93.9242_1.57481_-14.9132)] mb-6">
              <Star
                className="size-4 mr-2 fill-[lab(33.0003_33.4195_-70.7084)]"
                strokeWidth={0}
              />
              <span className="text-sm font-medium text-[lab(33.0003_33.4195_-70.7084)]">
                Trusted by learners worldwide
              </span>
            </div>

            <h1 className="max-w-[300px] mb-6 text-[36px] font-semibold leading-[1.1] tracking-tight md:max-w-[500px] md:text-[56px] lg:text-[60px]">
              Learn any language with a tutor who fits you
            </h1>

            <p className="max-w-[320px] text-lg font-normal text-[lab(44.0189_1.98019_-14.7408)] mb-6 md:max-w-[420px]">
              Book affordable 1-on-1 online lessons with expert tutors. Pick a
              time, hit join, and start speaking from day one.
            </p>

            <Link
              href="/"
              className="mb-8 w-full flex items-center justify-center rounded-lg bg-[oklab(0.519987_0.0188142_-0.269322)] px-3 py-2 text-white md:w-auto"
            >
              <span className="text-white mr-2">Get started</span>
              <ArrowRight className="size-4 text-white" />
            </Link>

            <div className="flex items-center justify-center">
              <div className="flex -space-x-2 mr-4">
                {avatars.map((avatar) => (
                  <img
                    key={avatar}
                    src={avatar}
                    className="size-8 border border-white rounded-full"
                  />
                ))}
              </div>
              <span className="max-w-[200px] text-sm font-normal text-[lab(44.0189_1.98019_-14.7408)] md:max-w-none">
                Join thousands of learners worldwide
              </span>
            </div>
          </div>

          <div className="relative w-full lg:flex-1">
            <img
              src="/images/hero-lesson.png"
              className="w-full border-2 border-gray-100 rounded-[32px] shadow-lg"
            />
            <div className="absolute z-10 -bottom-2 -left-2 inline-flex bg-white p-4 border border-gray-100 shadow-md rounded-[24px] lg:-bottom-6 lg:-left-6">
              <div className="flex items-center justify-center size-10 bg-[lab(93.9242_1.57481_-14.9132)] px-2 rounded-full mr-3">
                <Calendar className="size-5 text-[lab(39.3875_51.982_-95.6741)]" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-semibold">Lesson confirmed</span>
                <span className="text-xs font-normal text-[lab(44.0189_1.98019_-14.7408)]">
                  with Sofia · Today, 5:00 PM
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
