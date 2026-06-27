"use client";

import { GoogleLogin } from "@react-oauth/google";
import { GraduationCap } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <section className="w-full max-w-sm">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary">
            <GraduationCap className="size-5 text-primary-foreground" />
          </div>

          <span className="text-xl font-bold tracking-tight text-foreground">
            Tutorly
          </span>
        </Link>
        {/* Heading */}
        <div className="mt-12 mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back
          </h1>

          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Log in to book lessons and message your tutors.
          </p>
        </div>
        {/* Google Login */}
        <GoogleLogin
          theme="outline"
          size="large"
          shape="rectangular"
          text="continue_with"
          width="384"
          onSuccess={async (credentialResponse) => {
            const idToken = credentialResponse.credential;

            if (!idToken) {
              console.error("Google idToken not found");
              return;
            }

            const res = await fetch("http://localhost:4000/auth/google", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
                idToken,
                role: "TEACHER",
              }),
            });

            const data = await res.json();

            console.log("Tutorly login success", data);
          }}
          onError={() => {
            console.error("Google Login Failed");
          }}
        />
        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />
          <span className="text-sm text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>
        {/* Form */}
        <form className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Email
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                Password
              </label>

              <Link
                href="/forgot-password"
                className="text-sm font-medium text-primary transition-colors hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <input
              type="password"
              placeholder="••••••••"
              className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
            />
          </div>

          <button
            type="submit"
            className="h-11 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Log in
          </button>
        </form>
        {/* Footer */}
        <p className="mt-8 text-center text-sm text-muted-foreground">
          New to Tutorly?{" "}
          <Link
            href="/signup"
            className="font-semibold text-primary transition-colors hover:underline"
          >
            Sign up
          </Link>
        </p>
      </section>
    </main>
  );
}
