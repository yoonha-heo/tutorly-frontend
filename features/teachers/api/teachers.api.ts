import type { TeacherRegisterValues } from "../schemas/teacher-register.schema";
import { env } from "@/config/env";
import { Teacher } from "../types/teachers";

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

export async function getTeacher(id: string) {
  const response = await fetch(`${env.apiUrl}/teachers/${id}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch teacher");
  }

  return response.json();
}
