import { Search, Star, ChevronDown } from "lucide-react";
import Link from "next/link";

const teachers = [
  {
    id: "sofia",
    name: "Sofía M.",
    avatarUrl: "images/avatar-3.png",
    flag: "🇪🇸",
    languages: ["Spanish", "English"],
    headline: "Certified Spanish tutor — speak with confidence from day one",
    specialties: ["Conversation", "Business", "Beginners"],
    rating: 5.0,
    reviews: 3,
    lessons: 13,
    hourlyRate: 18,
  },
  {
    id: "jacob",
    name: "Jacob B.",
    avatarUrl: "images/avatar-1.png",
    flag: "🇺🇸",
    languages: ["English"],
    headline: "IELST — speak with confidence from day one",
    specialties: ["Conversation", "Business", "Beginners"],
    rating: 4.9,
    reviews: 11,
    lessons: 40,
    hourlyRate: 22,
  },
  {
    id: "Daniel",
    name: "Daniel A.",
    avatarUrl: "images/avatar-2.png",
    flag: "🇪🇸",
    languages: ["Spanish", "English"],
    headline: "Certified Spanish tutor — speak with confidence from day one",
    specialties: ["Conversation", "Business", "Beginners"],
    rating: 5.0,
    reviews: 3,
    lessons: 13,
    hourlyRate: 18,
  },
];

export default function TeachersPage() {
  return (
    <main className="grid gap-4 max-w-6xl m-auto px-4 py-8">
      <section className="rounded-[32px] border border-border bg-background p-6">
        <form className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_220px_220px]">
          <div className="flex h-14 items-center gap-3 rounded-2xl border border-border bg-background px-5 transition-colors focus-within:border-primary">
            <Search className="size-5 text-muted-foreground" />

            <input
              type="search"
              placeholder="Search by name, language, or specialty"
              className="flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>

          <div className="relative">
            <select className="h-14 w-full appearance-none rounded-2xl border border-border bg-background px-5 pr-12 text-base font-medium text-foreground outline-none transition-colors focus:border-primary">
              <option>All languages</option>
              <option>English</option>
              <option>Spanish</option>
              <option>Korean</option>
            </select>

            <ChevronDown className="pointer-events-none absolute right-5 top-1/2 size-5 -translate-y-1/2 text-foreground" />
          </div>

          <div className="relative">
            <select className="h-14 w-full appearance-none rounded-2xl border border-border bg-background px-5 pr-12 text-base font-medium text-foreground outline-none transition-colors focus:border-primary">
              <option>All Specialties</option>
              <option>Conversation</option>
              <option>IELTS</option>
              <option>Business</option>
            </select>

            <ChevronDown className="pointer-events-none absolute right-5 top-1/2 size-5 -translate-y-1/2 text-foreground" />
          </div>
        </form>

        <p className="mt-6 text-base text-muted-foreground">
          6 teachers available
        </p>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {teachers.map((teacher) => (
          <article
            key={teacher.id}
            className="flex flex-col rounded-3xl border border-border bg-background p-5"
          >
            <header className="flex items-start justify-between gap-4">
              <div className="flex gap-4">
                <img
                  src={teacher.avatarUrl}
                  alt={`${teacher.name} profile`}
                  className="size-20 rounded-2xl object-cover"
                />

                <div>
                  <h2 className="font-semibold text-foreground">
                    {teacher.name}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {teacher.languages.join(", ")}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {teacher.reviews} reviews ·{" "}
                    {teacher.lessons.toLocaleString()} lessons
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 font-medium text-foreground">
                <Star className="size-4 fill-yellow-400 text-yellow-400" />
                <span>{teacher.rating}</span>
              </div>
            </header>

            <p className="min-h-[42px] line-clamp-2 mt-5 text-sm leading-6 text-muted-foreground">
              {teacher.headline}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {teacher.specialties.map((specialty) => (
                <span
                  key={specialty}
                  className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                >
                  {specialty}
                </span>
              ))}
            </div>

            <footer className="mt-5 flex items-center justify-between border-t border-border pt-5">
              <p className="text-sm text-muted-foreground">
                <span className="text-xl font-semibold text-foreground">
                  ${teacher.hourlyRate}
                </span>{" "}
                / hour
              </p>

              <Link
                href={`/teachers/${teacher.id}`}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                View Profile
              </Link>
            </footer>
          </article>
        ))}
      </section>
    </main>
  );
}
