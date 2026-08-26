import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  getTeacherReviews,
  TEACHER_REVIEWS_PAGE_SIZE,
  type TeacherReviewListResponse,
} from "../api/reviews.api";

export function useTeacherReviews(
  teacherId: string,
  page: number,
  options?: { initialData?: TeacherReviewListResponse },
) {
  return useQuery({
    queryKey: ["teacher-reviews", teacherId, page],
    queryFn: () =>
      getTeacherReviews(teacherId, {
        page,
        limit: TEACHER_REVIEWS_PAGE_SIZE,
      }),
    enabled: Boolean(teacherId),
    placeholderData: keepPreviousData,
    initialData: page === 1 ? options?.initialData : undefined,
    staleTime: 60 * 1000,
  });
}
