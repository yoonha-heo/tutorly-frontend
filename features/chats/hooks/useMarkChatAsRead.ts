import { useMutation, useQueryClient } from "@tanstack/react-query";

import { markChatAsRead } from "../api/chats.api";
import type { ChatListResponse } from "../api/chats.api";

export function useMarkChatAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markChatAsRead,
    onSuccess: (_data, channelId) => {
      queryClient.setQueryData<ChatListResponse>(["chats"], (current) => {
        if (!current) return current;

        return {
          items: current.items.map((item) =>
            item.id === channelId ? { ...item, unreadCount: 0 } : item,
          ),
        };
      });
    },
  });
}
