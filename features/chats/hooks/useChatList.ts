import { useQuery } from "@tanstack/react-query";

import { getChatList } from "../api/chats.api";

export function useChatList(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["chats"],
    queryFn: getChatList,
    enabled: options?.enabled ?? true,
  });
}
