"use client";

import { GoogleLogin } from "@react-oauth/google";
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginWithGoogle } from "../api/authApi";
import type { UserRole } from "../types/auth.types";
import { useQueryClient } from "@tanstack/react-query";

type AuthFormProps = {
  title: string;
  description: string;
  role: UserRole;
};

export default function AuthForm({ title, description, role }: AuthFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const redirectPath = role === "TEACHER" ? "/teachers/register" : "/teachers";

  async function handleGoogleLoginSuccess(credential?: string) {
    if (!credential) return;

    try {
      const { user } = await loginWithGoogle(credential, role);

      queryClient.setQueryData(["me"], user);
      router.replace(redirectPath);
    } catch (error) {
      console.error("Google login failed", error);
    }
  }

  function handleGoogleLoginError() {
    console.error("Google login failed");
  }

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
            onSuccess={({ credential }) => {
              handleGoogleLoginSuccess(credential);
            }}
            onError={handleGoogleLoginError}
          />
        </div>
      </section>
    </main>
  );
}
