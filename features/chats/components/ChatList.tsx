"use client";

import { ChatAvatar } from "./ChatAvatar";
import { cn } from "@/utils/cn";
import type { ChatListItem } from "../api/chats.api";

const EMPTY_PROFILE = "/images/empty-profile.png";

export function ChatList({
  items,
  selectedId,
  isListOpen,
  onSelect,
}: {
  items: ChatListItem[];
  selectedId: string;
  isListOpen: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <aside
      className={`w-full shrink-0 border-r border-border bg-background md:w-[330px] lg:w-[360px] ${
        isListOpen ? "block" : "hidden md:block"
      }`}
    >
      <div className="flex items-center border-b border-border px-5 py-4">
        <h1 className="text-lg font-semibold tracking-tight">Messages</h1>
      </div>

      <div className="overflow-y-auto">
        {items.length === 0 ? (
          <p className="px-5 py-8 text-sm text-muted-foreground">
            No conversations yet.
          </p>
        ) : (
          items.map((item) => (
            <ConversationItem
              key={item.id}
              item={item}
              selected={item.id === selectedId}
              onClick={() => onSelect(item.id)}
            />
          ))
        )}
      </div>
    </aside>
  );
}

function ConversationItem({
  item,
  selected,
  onClick,
}: {
  item: ChatListItem;
  selected: boolean;
  onClick: () => void;
}) {
  const name = item.otherUser?.name ?? "User";
  const unreadCount = item.unreadCount ?? 0;
  const hasUnread = unreadCount > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left transition-colors hover:bg-secondary/60 ${
        selected ? "bg-secondary" : "bg-background"
      }`}
      aria-label={
        hasUnread
          ? `Open chat with ${name}, ${unreadCount} unread`
          : `Open chat with ${name}`
      }
    >
      <ChatAvatar
        src={item.otherUser?.profileImage ?? EMPTY_PROFILE}
        alt={name}
        size="lg"
      />
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block truncate text-sm",
            hasUnread ? "font-bold text-foreground" : "font-semibold text-foreground",
          )}
        >
          {name}
        </span>
        <span
          className={cn(
            "mt-1 block truncate text-xs",
            hasUnread ? "font-medium text-foreground" : "text-muted-foreground",
          )}
        >
          {item.lastMessage?.content ?? "No messages yet"}
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-4">
        {hasUnread && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] leading-none font-semibold text-primary-foreground">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
        {item.lastMessage && (
          <span className="text-[11px] leading-none text-muted-foreground">
            {formatChatTime(item.lastMessage.createdAt)}
          </span>
        )}
      </span>
    </button>
  );
}

function formatChatTime(iso: string) {
  const date = new Date(iso);
  const now = new Date();

  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
