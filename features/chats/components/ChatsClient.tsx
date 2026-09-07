"use client";

import { useEffect, useState } from "react";

import { ChatList } from "./ChatList";
import { ChatRoom } from "./ChatRoom";
import { useChatList } from "../hooks/useChatList";
import { useMarkChatAsRead } from "../hooks/useMarkChatAsRead";
import { useSetViewingChannelId } from "./ChatSocketProvider";
import type { ChatListResponse, MessageListResponse } from "../api/chats.api";

export function ChatsClient({
  initialChats,
  initialMessages,
  initialChannelId,
}: {
  initialChats: ChatListResponse;
  initialMessages?: MessageListResponse;
  initialChannelId?: string;
}) {
  const { data } = useChatList({ initialData: initialChats });
  console.log('@@@ data', data)
  const markAsRead = useMarkChatAsRead();
  const setViewingChannelId = useSetViewingChannelId();

  const items = data?.items ?? initialChats.items;
  const [selectedId, setSelectedId] = useState(initialChannelId ?? "");
  const [isListOpen, setIsListOpen] = useState(true);

  const selected = items.find((item) => item.id === selectedId) ?? items[0];

  useEffect(() => {
    setViewingChannelId(isListOpen ? undefined : selected?.id);
    return () => setViewingChannelId(undefined);
  }, [isListOpen, selected?.id, setViewingChannelId]);

  function openConversation(id: string) {
    setSelectedId(id);
    setIsListOpen(false);
    markAsRead.mutate(id);
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
            initialMessages={
              selected.id === initialChannelId ? initialMessages : undefined
            }
          />
        ) : (
          <section
            className={`flex min-w-0 flex-1 items-center justify-center ${isListOpen ? "hidden md:flex" : "flex"
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
