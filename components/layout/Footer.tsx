import { GraduationCap } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-background">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary">
              <GraduationCap className="size-5 text-primary-foreground" />
            </div>

            <span className="text-xl font-semibold">Tutorly</span>
          </Link>

          <p className="mt-4 max-w-xs text-sm leading-7 text-muted-foreground">
            Learn languages from professional tutors anywhere in the world.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-foreground">Product</h3>

          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>
              <Link href="/teachers">Find a tutor</Link>
            </li>
            <li>
              <Link href="/">Become a tutor</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-foreground">Languages</h3>

          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>English</li>
            <li>Spanish</li>
            <li>Japanese</li>
            <li>Korean</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-foreground">Company</h3>

          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>About</li>
            <li>Blog</li>
            <li>Careers</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-foreground">Support</h3>

          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>Help Center</li>
            <li>Contact</li>
            <li>Privacy</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 text-sm text-muted-foreground">
          <span>© 2026 Tutorly. All rights reserved.</span>

          <div className="flex gap-6">
            <Link href="/">Terms</Link>
            <Link href="/">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
