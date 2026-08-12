"use client";

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/utils/apiError";

function handleClientError(error: unknown) {
  if (ApiError.isApiError(error) && error.isClientError) {
    toast.error(error.message);
  }
}

function shouldThrowOnError(error: Error) {
  return ApiError.isApiError(error) ? error.isServerError : true;
}

export function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: handleClientError,
        }),
        mutationCache: new MutationCache({
          onError: handleClientError,
        }),
        defaultOptions: {
          queries: {
            throwOnError: shouldThrowOnError,
          },
          mutations: {
            throwOnError: shouldThrowOnError,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
