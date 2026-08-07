"use client";

import { useQuery } from "@tanstack/react-query";

import { getMyAvailabilities } from "../api/teachers.api";
import type { MyAvailability } from "../types/teachers";

export function useMyAvailabilities(options?: {
  enabled?: boolean;
  initialData?: MyAvailability[];
}) {
  const { enabled = true, initialData } = options ?? {};

  return useQuery({
    queryKey: ["my-availabilities"],
    queryFn: getMyAvailabilities,
    enabled,
    staleTime: 30_000,
    initialData,
  });
}
