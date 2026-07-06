"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getTeachers } from "../api/teachers.api";

type UseInfiniteTeachersParams = {
  keyword?: string;
  language?: string;
  specialty?: string;
};

export function useInfiniteTeachers(params: UseInfiniteTeachersParams) {
  return useInfiniteQuery({
    queryKey: ["teachers", params],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getTeachers({
        ...params,
        page: pageParam,
        limit: 6,
      }),
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.nextPage : undefined;
    },
  });
}
