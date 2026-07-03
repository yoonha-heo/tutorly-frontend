"use client";

import { GoogleLogin } from "@react-oauth/google";
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type AuthRole = "STUDENT" | "TEACHER";

type AuthFormProps = {
  title: string;
  description: string;
  role: AuthRole;
};

export default function AuthForm({ title, description, role }: AuthFormProps) {
  const router = useRouter();

  const redirectPath = role === "TEACHER" ? "/teachers/register" : "/teachers";

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <section className="w-full max-w-md rounded-3xl border border-border bg-background p-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary">
            <GraduationCap className="size-5 text-primary-foreground" />
          </div>

          <span className="text-2xl font-bold tracking-tight">Tutorly</span>
        </Link>

        <div className="mt-10">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>

          <p className="mt-3 text-base leading-7 text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <GoogleLogin
            theme="outline"
            size="large"
            shape="rectangular"
            text="continue_with"
            width="360"
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
                  role,
                }),
              });

              if (!res.ok) {
                console.error("Login failed");
                return;
              }

              router.push(redirectPath);
            }}
            onError={() => {
              console.error("Google Login Failed");
            }}
          />
        </div>
        {/* 
        <p className="mt-8 text-center text-sm leading-6 text-muted-foreground">
          By continuing, you agree to our{" "}
          <Link
            href="/terms"
            className="font-medium text-foreground hover:underline"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="font-medium text-foreground hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </p> */}
      </section>
    </main>
  );
}
