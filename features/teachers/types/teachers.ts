import { TeacherStatus } from "@/features/auth/types/auth.types";

export type Teacher = {
  id: string;
  headline: string;
  bio: string;
  hourlyRate: number;
  profileImageUrl: string | null;
  status: TeacherStatus;
  averageRating: number;
  reviewCount: number;
  lessonCount: number;
  rejectionReason: string | null;

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

export type TeacherAvailability = {
  id: string;
  startAt: string;
  endAt: string;
};

export type MyAvailability = {
  id: string;
  startAt: string;
  endAt: string;
  isOpen: boolean;
  blocks: { id: string }[];
};

export type UpdateTeacherProfileData = {
  headline: string;
  bio: string;
  profileImageUrl: string;
  hourlyRate: number;
  languages: string[];
  specialties: string[];
};
