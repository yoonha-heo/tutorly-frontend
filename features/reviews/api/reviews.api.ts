import { env } from "@/config/env";
import { apiFetch } from "@/utils/apiClient";

export const TEACHER_REVIEWS_PAGE_SIZE = 4;
export const MY_REVIEWS_PAGE_SIZE = 20;

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

export type WrittenReview = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  booking: {
    id: string;
    lessonStartAt: string;
    lessonEndAt: string;
    teacher: {
      id: string;
      headline: string | null;
      profileImageUrl: string | null;
      user: {
        id: string;
        name: string | null;
      };
    };
  };
};

export type ReviewListResponse<TItem> = {
  items: TItem[];
  page: number;
  limit: number;
  totalCount: number;
  hasNextPage: boolean;
  nextPage: number | null;
};

export type TeacherReviewListResponse = ReviewListResponse<TeacherReview>;
export type WrittenReviewListResponse = ReviewListResponse<WrittenReview>;

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
  return apiFetch<TeacherReviewListResponse>(
    `${env.apiUrl}/reviews/teacher/${teacherId}?${toReviewQuery(params)}`,
    {
      credentials: "include",
      cache: "no-store",
    },
  );
}

export async function getMyReviews(
  params: { page?: number; limit?: number } = {},
): Promise<WrittenReviewListResponse> {
  return apiFetch<WrittenReviewListResponse>(
    `${env.apiUrl}/reviews/me?${toReviewQuery(params, MY_REVIEWS_PAGE_SIZE)}`,
    {
      headers: await getAuthHeaders(),
      credentials: "include",
      cache: "no-store",
    },
  );
}

export async function getMyTeachingReviews(
  params: { page?: number; limit?: number } = {},
): Promise<TeacherReviewListResponse> {
  return apiFetch<TeacherReviewListResponse>(
    `${env.apiUrl}/reviews/teaching?${toReviewQuery(params, MY_REVIEWS_PAGE_SIZE)}`,
    {
      credentials: "include",
      cache: "no-store",
    },
  );
}

function toReviewQuery(
  params: { page?: number; limit?: number },
  defaultLimit = TEACHER_REVIEWS_PAGE_SIZE,
) {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(params.page ?? 1));
  searchParams.set("limit", String(params.limit ?? defaultLimit));
  return searchParams.toString();
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {};

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
