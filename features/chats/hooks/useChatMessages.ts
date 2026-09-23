import { useEffect, useRef } from "react";

import { useMarkChatAsRead } from "./useMarkChatAsRead";
import { useMessageList } from "./useMessageList";

export function useChatMessages(
  channelId: string,
  options: { isListOpen: boolean },
) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    useMessageList(channelId);
  const markAsRead = useMarkChatAsRead();
  const seenMessageIdRef = useRef<string | undefined>(undefined);

  const messages =
    data?.pages.flatMap((page) => page.items).toReversed() ?? [];
  const lastMessageId = messages.at(-1)?.id;
  const pageCount = data?.pages.length ?? 0;

  useEffect(() => {
    seenMessageIdRef.current = undefined;
  }, [channelId]);

  useEffect(() => {
    if (options.isListOpen || !lastMessageId) return;

    if (seenMessageIdRef.current === undefined) {
      seenMessageIdRef.current = lastMessageId;
      return;
    }

    if (seenMessageIdRef.current === lastMessageId) return;
    seenMessageIdRef.current = lastMessageId;
    markAsRead.mutate(channelId);
  }, [channelId, lastMessageId, options.isListOpen]);

  return {
    messages,
    lastMessageId,
    pageCount,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
  };
}
