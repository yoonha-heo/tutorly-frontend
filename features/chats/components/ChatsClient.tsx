"use client";

import { useEffect, useState } from "react";

import { ChatList } from "./ChatList";
import { ChatRoom } from "./ChatRoom";
import { useChatList } from "../hooks/useChatList";
import { useChatPageAccess } from "../hooks/useChatPageAccess";
import { useMarkChatAsRead } from "../hooks/useMarkChatAsRead";
import { useSetViewingChannelId } from "./ChatSocketProvider";
import {
  useClearPendingChatOpen,
  usePendingChatOpen,
} from "./OpenChatContext";

export function ChatsClient() {
  const { canLoadChats } = useChatPageAccess();
  const { data, isPending } = useChatList({ enabled: canLoadChats });

  const markAsRead = useMarkChatAsRead();
  const setViewingChannelId = useSetViewingChannelId();
  const pendingChatOpen = usePendingChatOpen();
  const clearPendingChatOpen = useClearPendingChatOpen();

  const items = data?.items ?? [];
  const [selectedId, setSelectedId] = useState("");
  const [isListOpen, setIsListOpen] = useState(true);

  const selected = items.find((item) => item.id === selectedId) ?? items[0];

  useEffect(() => {
    setViewingChannelId(isListOpen ? undefined : selected?.id);
    return () => setViewingChannelId(undefined);
  }, [isListOpen, selected?.id, setViewingChannelId]);

  useEffect(() => {
    if (!pendingChatOpen) return;

    setSelectedId(pendingChatOpen.channelId);
    setIsListOpen(false);
    markAsRead.mutate(pendingChatOpen.channelId);
    clearPendingChatOpen();
  }, [pendingChatOpen, markAsRead, clearPendingChatOpen]);

  function openConversation(id: string) {
    setSelectedId(id);
    setIsListOpen(false);
    markAsRead.mutate(id);
  }

  if (!canLoadChats || isPending) {
    return <ChatsSkeleton />;
  }

  return (
    <main className="bg-background text-foreground">
      <div className="mx-auto flex h-[calc(100vh-4.5rem)] max-w-7xl overflow-hidden border-x border-border">
        <ChatList
          items={items}
          selectedId={selected?.id ?? ""}
          isListOpen={isListOpen}
          onSelect={openConversation}
        />
        {selected ? (
          <ChatRoom
            key={selected.id}
            channel={selected}
            isListOpen={isListOpen}
            onBack={() => setIsListOpen(true)}
          />
        ) : (
          <section
            className={`flex min-w-0 flex-1 items-center justify-center ${
              isListOpen ? "hidden md:flex" : "flex"
            }`}
          >
            <p className="text-sm text-muted-foreground">
              Select a conversation to start chatting.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}

function ChatsSkeleton() {
  return (
    <main
      className="bg-background text-foreground"
      aria-label="Loading messages"
    >
      <div className="mx-auto flex h-[calc(100vh-4.5rem)] max-w-7xl overflow-hidden border-x border-border">
        <aside className="w-full shrink-0 border-r border-border bg-background md:w-[330px] lg:w-[360px]">
          <div className="flex h-[61px] items-center border-b border-border px-5">
            <div className="h-7 w-28 animate-pulse rounded bg-secondary" />
          </div>
          <div>
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 border-b border-border px-4 py-3"
              >
                <div className="size-11 shrink-0 animate-pulse rounded-xl bg-secondary" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-4 w-32 animate-pulse rounded bg-secondary" />
                  <div className="h-3 w-48 max-w-full animate-pulse rounded bg-secondary" />
                </div>
              </div>
            ))}
          </div>
        </aside>
        <section className="hidden min-h-0 min-w-0 flex-1 md:block" />
      </div>
    </main>
  );
}
