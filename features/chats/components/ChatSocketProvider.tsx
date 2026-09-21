"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

import { useMe } from "@/features/auth/hooks/useMe";
import { useChatList } from "../hooks/useChatList";
import { useChatSocket } from "../hooks/useChatSocket";
import {
  OpenChatContext,
  type PendingChatOpen,
} from "./OpenChatContext";

const SetViewingChannelIdContext = createContext<
  (channelId: string | undefined) => void
>(() => {});

export function useSetViewingChannelId() {
  return useContext(SetViewingChannelIdContext);
}

export function ChatSocketProvider({ children }: { children: ReactNode }) {
  const { data: me } = useMe();
  const { data } = useChatList({ enabled: Boolean(me) });
  const [viewingChannelId, setViewingChannelId] = useState<
    string | undefined
  >();
  const [pendingChatOpen, setPendingChatOpen] =
    useState<PendingChatOpen | null>(null);

  useChatSocket(me ? (data?.items.map((item) => item.id) ?? []) : [], {
    myUserId: me?.id,
    viewingChannelId,
  });

  function openChatChannel(channelId: string) {
    setPendingChatOpen({ channelId, nonce: Date.now() });
  }

  function clearPendingChatOpen() {
    setPendingChatOpen(null);
  }

  return (
    <SetViewingChannelIdContext.Provider value={setViewingChannelId}>
      <OpenChatContext.Provider
        value={{ pendingChatOpen, openChatChannel, clearPendingChatOpen }}
      >
        {children}
      </OpenChatContext.Provider>
    </SetViewingChannelIdContext.Provider>
  );
}
