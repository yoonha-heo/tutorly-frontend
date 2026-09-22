import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  getMyReviews,
  MY_REVIEWS_PAGE_SIZE,
  type WrittenReviewListResponse,
} from "../api/reviews.api";

export function useMyReviews(
  page: number,
  options?: { initialData?: WrittenReviewListResponse },
) {
  return useQuery({
    queryKey: ["my-reviews", page],
    queryFn: () =>
      getMyReviews({
        page,
        limit: MY_REVIEWS_PAGE_SIZE,
      }),
    placeholderData: keepPreviousData,
    initialData: page === 1 ? options?.initialData : undefined,
    staleTime: 60 * 1000,
  });
}
