import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getMyReviews, MY_REVIEWS_PAGE_SIZE } from "../api/reviews.api";

export function useMyReviews(page: number) {
  return useQuery({
    queryKey: ["my-reviews", page],
    queryFn: () =>
      getMyReviews({
        page,
        limit: MY_REVIEWS_PAGE_SIZE,
      }),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });
}
