import { useMutation, useQueryClient } from "@tanstack/react-query";

import { sendChat, type SendChatData } from "../api/chats.api";
import { appendIncomingMessage } from "../lib/appendIncomingMessage";

export function useSendChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendChatData) => sendChat(data),
    onSuccess: (message) => {
      appendIncomingMessage(queryClient, message, {
        viewingChannelId: message.channelId,
      });
    },
  });
}
