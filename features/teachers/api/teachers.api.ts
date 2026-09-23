import type { TeacherRegisterValues } from "../schemas/teacher-register.schema";
import { env } from "@/config/env";
import { apiFetch } from "@/utils/apiClient";
import {
  MyAvailability,
  Teacher,
  TeacherAvailability,
  UpdateTeacherProfileData,
} from "../types/teachers";

async function getAuthHeaders(
  contentType = "application/json",
): Promise<Record<string, string>> {
  const headers: Record<string, string> = {};

  if (contentType) {
    headers["Content-Type"] = contentType;
  }

  if (typeof window === "undefined") {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();

    if (cookieString) {
      headers["Cookie"] = cookieString;
    }
  }

  return headers;
}

export type Languages = {
  id: string;
  code: string;
  name: string;
};

export type Specialties = {
  id: string;
  code: string;
  name: string;
};

export type GetTeachersParams = {
  language?: string;
  specialty?: string;
  keyword?: string;
  page?: number;
  limit?: number;
};

export type TeacherListResponse = {
  items: Teacher[];
  page: number;
  limit: number;
  totalCount: number;
  hasNextPage: boolean;
  nextPage: number | null;
};

export async function submitTeacherProfile(data: TeacherRegisterValues) {
  return apiFetch<Teacher>(`${env.apiUrl}/teachers/profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
}

export async function getAvailableLanguages(): Promise<Languages[]> {
  return apiFetch<Languages[]>(`${env.apiUrl}/teachers/languages`, {
    credentials: "omit",
  });
}

export async function getAvailableSpecialties(): Promise<Specialties[]> {
  return apiFetch<Specialties[]>(`${env.apiUrl}/teachers/specialties`, {
    credentials: "omit",
  });
}

export async function getTeachers(
  params: GetTeachersParams = {},
): Promise<TeacherListResponse> {
  const searchParams = new URLSearchParams();

  if (params.keyword) searchParams.set("keyword", params.keyword);
  if (params.language) searchParams.set("language", params.language);
  if (params.specialty) searchParams.set("specialty", params.specialty);
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));

  const queryString = searchParams.toString();

  return apiFetch<TeacherListResponse>(
    `${env.apiUrl}/teachers?${queryString ? `${queryString}` : ""}`,
    {
      credentials: "omit",
    },
  );
}

export async function getMyTeacherProfile(): Promise<Teacher> {
  return apiFetch<Teacher>(`${env.apiUrl}/teachers/profile`, {
    credentials: "include",
    cache: "no-store",
  });
}

export async function getTeacher(id: string): Promise<Teacher> {
  return apiFetch<Teacher>(`${env.apiUrl}/teachers/${id}`, {
    credentials: "omit",
    cache: "no-store",
  });
}

export async function getTeacherAvailabilities(
  teacherId: string,
): Promise<TeacherAvailability[]> {
  return apiFetch<TeacherAvailability[]>(
    `${env.apiUrl}/teachers/${teacherId}/availabilities`,
    {
      credentials: "omit",
    },
  );
}

export async function getMyAvailabilities(): Promise<MyAvailability[]> {
  return apiFetch<MyAvailability[]>(`${env.apiUrl}/availabilities/me`, {
    credentials: "include",
    cache: "no-store",
  });
}

export type AvailabilityUpdateItem = {
  id: string;
  isOpen: boolean;
};

export async function updateAvailabilities(
  items: AvailabilityUpdateItem[],
): Promise<{ updatedCount: number }> {
  return apiFetch<{ updatedCount: number }>(`${env.apiUrl}/availabilities`, {
    method: "PATCH",
    headers: await getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify({ items }),
  });
}

export async function updateTeacherProfile(
  data: UpdateTeacherProfileData,
): Promise<Teacher> {
  return apiFetch<Teacher>(`${env.apiUrl}/teachers/profile`, {
    method: "PATCH",
    headers: await getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify(data),
  });
}
