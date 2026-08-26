import { env } from "@/config/env";
import { apiFetch } from "@/utils/apiClient";

export const TEACHER_REVIEWS_PAGE_SIZE = 4;

export type TeacherReview = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  booking: {
    id: string;
    lessonStartAt: string;
    lessonEndAt: string;
    student: {
      id: string;
      name: string | null;
      profileImage: string | null;
    };
  };
};

export type TeacherReviewListResponse = {
  items: TeacherReview[];
  page: number;
  limit: number;
  totalCount: number;
  hasNextPage: boolean;
  nextPage: number | null;
};

export type CreateReviewData = {
  bookingId: string;
  rating: number;
  comment: string;
};

export type CreatedReview = {
  id: string;
  bookingId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function createReview(data: CreateReviewData) {
  return apiFetch<CreatedReview>(`${env.apiUrl}/reviews`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(data),
  });
}

export async function getTeacherReviews(
  teacherId: string,
  params: { page?: number; limit?: number } = {},
): Promise<TeacherReviewListResponse> {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(params.page ?? 1));
  searchParams.set(
    "limit",
    String(params.limit ?? TEACHER_REVIEWS_PAGE_SIZE),
  );

  return apiFetch<TeacherReviewListResponse>(
    `${env.apiUrl}/reviews/teacher/${teacherId}?${searchParams.toString()}`,
    {
      credentials: "include",
      cache: "no-store",
    },
  );
}
