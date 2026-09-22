import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  getMyTeachingReviews,
  MY_REVIEWS_PAGE_SIZE,
} from "../api/reviews.api";

export function useMyTeachingReviews(page: number, enabled = true) {
  return useQuery({
    queryKey: ["my-teaching-reviews", page],
    queryFn: () =>
      getMyTeachingReviews({
        page,
        limit: MY_REVIEWS_PAGE_SIZE,
      }),
    enabled,
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });
}
