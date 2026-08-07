import type { TeacherRegisterValues } from "../schemas/teacher-register.schema";
import { env } from "@/config/env";
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
  const res = await fetch(`${env.apiUrl}/teachers/profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to submit teacher profile");
  }

  return res.json();
}

export async function getAvailableLanguages(): Promise<Languages[]> {
  const response = await fetch(`${env.apiUrl}/teachers/languages`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch langueages");
  }

  return response.json();
}

export async function getAvailableSpecialties(): Promise<Specialties[]> {
  const response = await fetch(`${env.apiUrl}/teachers/specialties`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch specialties");
  }

  return response.json();
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

  const response = await fetch(
    `${env.apiUrl}/teachers?${queryString ? `${queryString}` : ""}`,
    {
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch teachers");
  }

  return response.json();
}

export async function getTeacher(id: string): Promise<Teacher> {
  const response = await fetch(`${env.apiUrl}/teachers/${id}`, {
    headers: await getAuthHeaders(),
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch teacher");
  }

  return response.json();
}

export async function getTeacherAvailabilities(
  teacherId: string,
): Promise<TeacherAvailability[]> {
  const response = await fetch(
    `${env.apiUrl}/teachers/${teacherId}/availabilities`,
    {
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch teacher availabilities");
  }

  return response.json();
}

export async function getMyAvailabilities(): Promise<MyAvailability[]> {
  const response = await fetch(`${env.apiUrl}/availabilities/me`, {
    headers: await getAuthHeaders(),
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch my availabilities");
  }

  return response.json();
}

export type AvailabilityUpdateItem = {
  id: string;
  isOpen: boolean;
};

export async function updateAvailabilities(
  items: AvailabilityUpdateItem[],
): Promise<{ updatedCount: number }> {
  const response = await fetch(`${env.apiUrl}/availabilities`, {
    method: "PATCH",
    headers: await getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify({ items }),
  });

  if (!response.ok) {
    throw new Error("Failed to update availabilities");
  }

  return response.json();
}

export async function updateTeacherProfile(
  data: UpdateTeacherProfileData,
): Promise<Teacher> {
  const response = await fetch(`${env.apiUrl}/teachers/profile`, {
    method: "PATCH",
    headers: await getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update teacher profile");
  }

  return response.json();
}
