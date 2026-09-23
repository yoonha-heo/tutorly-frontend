"use client";

import { useQuery } from "@tanstack/react-query";

import { getMyAvailabilities } from "../api/teachers.api";

export function useMyAvailabilities(enabled = true) {
  return useQuery({
    queryKey: ["my-availabilities"],
    queryFn: getMyAvailabilities,
    enabled,
    staleTime: 30_000,
  });
}
