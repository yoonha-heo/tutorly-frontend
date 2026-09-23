import { useInfiniteQuery } from "@tanstack/react-query";

import { getMessageList, MESSAGE_PAGE_SIZE } from "../api/chats.api";

export function useMessageList(channelId: string) {
  return useInfiniteQuery({
    queryKey: ["chat-messages", channelId],
    queryFn: ({ pageParam }) =>
      getMessageList(channelId, {
        cursor: pageParam,
        limit: MESSAGE_PAGE_SIZE,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? (lastPage.nextCursor ?? undefined) : undefined,
    enabled: Boolean(channelId),
  });
}
