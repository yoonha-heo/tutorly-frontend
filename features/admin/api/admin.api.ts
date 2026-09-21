import { env } from "@/config/env";
import { apiFetch } from "@/utils/apiClient";

import type {
  AdminTeacherListResponse,
  AdminTeacherProfile,
} from "../types/admin";

const PENDING_PAGE_SIZE = 50;

async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {};

  if (typeof window === "undefined") {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();

    if (cookieString) {
      headers.Cookie = cookieString;
    }
  }

  return headers;
}

export async function getPendingTeachers(): Promise<AdminTeacherListResponse> {
  const searchParams = new URLSearchParams({
    status: "PENDING",
    page: "1",
    limit: String(PENDING_PAGE_SIZE),
  });

  return apiFetch<AdminTeacherListResponse>(
    `${env.apiUrl}/admin/teachers?${searchParams.toString()}`,
    {
      headers: await getAuthHeaders(),
      credentials: "include",
      cache: "no-store",
    },
  );
}

export async function approveTeacher(
  id: string,
): Promise<AdminTeacherProfile> {
  return apiFetch<AdminTeacherProfile>(
    `${env.apiUrl}/admin/teachers/${id}/approve`,
    {
      method: "PATCH",
      credentials: "include",
    },
  );
}

export async function rejectTeacher(
  id: string,
  rejectionReason: string,
): Promise<AdminTeacherProfile> {
  return apiFetch<AdminTeacherProfile>(
    `${env.apiUrl}/admin/teachers/${id}/reject`,
    {
      method: "PATCH",
      credentials: "include",
      body: JSON.stringify({ rejectionReason }),
    },
  );
}
