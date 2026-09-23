"use client";

import { GoogleLogin } from "@react-oauth/google";
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { loginWithGoogle } from "@/features/auth/api/authApi";
import { getLoginRedirectPath } from "@/features/auth/lib/getLoginRedirectPath";
import type { Me, SignupRole } from "@/features/auth/types/auth.types";
import { ROLE_OPTIONS, RoleOption } from "./RoleOption";

type AuthFormProps = {
  initialRole: SignupRole;
};

export default function AuthForm({ initialRole }: AuthFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [role, setRole] = useState<SignupRole>(initialRole);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function completeLogin(user: Me, isNewAccount = false) {
    queryClient.setQueryData(["me"], user);
    router.replace(
      isNewAccount && user.role === "STUDENT"
        ? "/teachers"
        : getLoginRedirectPath(user),
    );
  }

  async function handleGoogleLoginSuccess(credential?: string) {
    if (!credential || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const result = await loginWithGoogle(credential);

      if ("user" in result) {
        completeLogin(result.user);
        return;
      }

      setIdToken(credential);
    } catch (error) {
      console.error("Google login failed", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCreateAccount() {
    if (!idToken || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const result = await loginWithGoogle(idToken, role);

      if ("user" in result) {
        completeLogin(result.user, true);
      }
    } catch (error) {
      console.error("Google login failed", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const isNewAccount = idToken !== null;

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
          <h1 className="text-3xl font-bold tracking-tight">
            {isNewAccount ? "Choose your role" : "Sign in"}
          </h1>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            {isNewAccount
              ? "This choice is saved with your new account."
              : "Sign in with Google to continue."}
          </p>
        </div>

        {isNewAccount ? (
          <>
            <div
              role="radiogroup"
              aria-label="Choose your role"
              className="mt-8 grid gap-3"
            >
              {ROLE_OPTIONS.map((option) => (
                <RoleOption
                  key={option.role}
                  option={option}
                  selected={role === option.role}
                  onSelect={setRole}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={handleCreateAccount}
              disabled={isSubmitting}
              className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              Create account
            </button>
          </>
        ) : (
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
              onError={() => {
                console.error("Google login failed");
              }}
            />
          </div>
        )}
      </section>
    </main>
  );
}
