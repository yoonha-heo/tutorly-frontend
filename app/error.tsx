"use client";

import Link from "next/link";
import { ApiError } from "@/utils/apiError";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorPageProps) {
  const isApiError = ApiError.isApiError(error);
  const isClientError = isApiError && error.isClientError;

  const message = isClientError
    ? error.message
    : "A temporary server error occurred.";

  const traceId = isApiError ? error.traceId : undefined;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <section className="w-full max-w-md rounded-3xl border border-border bg-background p-10 text-center">
        <p className="text-sm font-semibold tracking-wide text-primary">
          Something went wrong
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
          An error occurred
        </h1>

        <p className="mt-4 text-base leading-7 text-muted-foreground">
          {message}
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-primary px-8 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Try again
          </button>

          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-border px-8 text-base font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            Go home
          </Link>
        </div>

        {traceId && (
          <p className="mt-8 text-xs text-muted-foreground">
            Trace ID: {traceId}
          </p>
        )}
      </section>
    </main>
  );
}
