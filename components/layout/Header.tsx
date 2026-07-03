"use client";

import { useMe } from "@/features/auth/hooks/useMe";
import { GraduationCap } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const { data: me, isLoading } = useMe();

  return (
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
              href="/teachers"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Find a tutor
            </Link>
            <Link
              href="/teachers/auth"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Become a tutor
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="h-8 w-20" />
        ) : me ? (
          <div className="flex items-center gap-2">
            {me.profileImage && (
              <img
                src={me.profileImage}
                alt={me.name ?? "User"}
                className="h-8 w-8 rounded-full"
              />
            )}
            <span className="text-sm font-medium">{me.name}</span>
          </div>
        ) : (
          <Link
            href="/login"
            className="rounded-xl px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
          >
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}
