"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

import { useMe } from "@/features/auth/hooks/useMe";
import { useChatList } from "../hooks/useChatList";
import { useChatSocket } from "../hooks/useChatSocket";

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

  useChatSocket(me ? (data?.items.map((item) => item.id) ?? []) : [], {
    myUserId: me?.id,
    viewingChannelId,
  });

  return (
    <SetViewingChannelIdContext.Provider value={setViewingChannelId}>
      {children}
    </SetViewingChannelIdContext.Provider>
  );
}
