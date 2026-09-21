import type { TeacherStatus } from "@/features/auth/types/auth.types";
import type {
  TeacherLanguage,
  TeacherSpecialty,
} from "@/features/teachers/types/teachers";

export type AdminTeacherProfile = {
  id: string;
  userId: string;
  timezone: string;
  headline: string | null;
  bio: string | null;
  profileImageUrl: string | null;
  hourlyRate: number | null;
  status: TeacherStatus;
  rejectionReason: string | null;
  averageRating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    profileImage: string | null;
  };
  teacherLanguages: TeacherLanguage[];
  teacherSpecialties: TeacherSpecialty[];
};

export type AdminTeacherListResponse = {
  items: AdminTeacherProfile[];
  page: number;
  limit: number;
  totalCount: number;
  hasNextPage: boolean;
  nextPage: number | null;
};
