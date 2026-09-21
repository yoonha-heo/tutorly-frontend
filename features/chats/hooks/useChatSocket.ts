"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";

import { env } from "@/config/env";
import { appendIncomingMessage } from "../lib/appendIncomingMessage";
import { notifyIncomingChat } from "../lib/notifyIncomingChat";
import type { ChatMessage } from "../api/chats.api";

export function useChatSocket(
  channelIds: string[],
  options?: { myUserId?: string; viewingChannelId?: string },
) {
  const queryClient = useQueryClient();
  const channelsKey = [...channelIds].sort().join(",");
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    if (!channelIds.length) return;

    const socket = io(`${env.socketUrl}/chat`, {
      transports: ["websocket"],
    });

    function joinRooms() {
      for (const channelId of channelIds) {
        socket.emit("join_room", { channelId });
      }
    }

    function handleNewMessage(message: ChatMessage) {
      if (!message?.id || !message.channelId) return;

      appendIncomingMessage(queryClient, message, optionsRef.current);

      const { myUserId, viewingChannelId } = optionsRef.current ?? {};
      const isOwn = Boolean(myUserId) && message.senderId === myUserId;
      if (isOwn || viewingChannelId === message.channelId) return;

      notifyIncomingChat({
        channelId: message.channelId,
        senderName:
          message.type === "SYSTEM"
            ? "Tutorly"
            : (message.sender?.name ?? "Someone"),
        senderImage: message.sender?.profileImage ?? null,
        preview: message.content,
      });
    }

    socket.on("connect", joinRooms);
    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("connect", joinRooms);
      socket.off("new_message", handleNewMessage);
      socket.disconnect();
    };
  }, [channelsKey, queryClient]);
}
