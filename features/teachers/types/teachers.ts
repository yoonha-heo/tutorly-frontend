import { TeacherStatus } from "@/features/auth/types/auth.types";

export type Teacher = {
  id: string;
  headline: string;
  bio: string;
  hourlyRate: number;
  profileImageUrl: string | null;
  status: TeacherStatus;

  user: {
    id: string;
    name: string;
    email: string;
    profileImage: string | null;
  };

  teacherLanguages: TeacherLanguage[];

  teacherSpecialties: TeacherSpecialty[];
};

export type TeacherLanguage = {
  language: {
    id: string;
    code: string;
    name: string;
  };
};

export type TeacherSpecialty = {
  specialty: {
    id: string;
    code: string;
    name: string;
  };
};
