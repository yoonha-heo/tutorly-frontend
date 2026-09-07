import type { InfiniteData, QueryClient } from "@tanstack/react-query";

import type { ChatListResponse, ChatMessage, MessageListResponse } from "../api/chats.api";

export function appendIncomingMessage(
  queryClient: QueryClient,
  message: ChatMessage,
  options?: { myUserId?: string; viewingChannelId?: string },
) {
  queryClient.setQueryData<InfiniteData<MessageListResponse>>(
    ["chat-messages", message.channelId],
    (current) => {
      if (!current) return current;

      const alreadyExists = current.pages.some((page) =>
        page.items.some((item) => item.id === message.id),
      );
      if (alreadyExists) return current;

      const [firstPage, ...rest] = current.pages;
      if (!firstPage) {
        return {
          pages: [{ items: [message], nextCursor: null, hasNextPage: false }],
          pageParams: [undefined],
        };
      }

      return {
        ...current,
        pages: [
          { ...firstPage, items: [message, ...firstPage.items] },
          ...rest,
        ],
      };
    },
  );

  queryClient.setQueryData<ChatListResponse>(["chats"], (current) => {
    if (!current) return current;

    const index = current.items.findIndex(
      (item) => item.id === message.channelId,
    );
    if (index === -1) {
      void queryClient.invalidateQueries({ queryKey: ["chats"] });
      return current;
    }

    const currentItem = current.items[index];
    const isViewing = options?.viewingChannelId === message.channelId;
    const isOwn =
      Boolean(options?.myUserId) && message.senderId === options?.myUserId;
    const alreadyCounted = currentItem.lastMessage?.id === message.id;

    let unreadCount = currentItem.unreadCount ?? 0;
    if (isViewing) {
      unreadCount = 0;
    } else if (options?.myUserId && !isOwn && !alreadyCounted) {
      unreadCount += 1;
    }

    const updated = {
      ...currentItem,
      lastMessage: message,
      unreadCount,
    };
    const items = current.items.filter((_, i) => i !== index);

    return { items: [updated, ...items] };
  });
}
