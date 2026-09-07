import { useQuery } from "@tanstack/react-query";

import { getChatList, type ChatListResponse } from "../api/chats.api";

export function useChatList(options?: {
  initialData?: ChatListResponse;
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: ["chats"],
    queryFn: getChatList,
    initialData: options?.initialData,
    enabled: options?.enabled ?? true,
  });
}
