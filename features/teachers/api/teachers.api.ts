import type { TeacherRegisterValues } from "../schemas/teacher-register.schema";
import { env } from "@/config/env";

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
