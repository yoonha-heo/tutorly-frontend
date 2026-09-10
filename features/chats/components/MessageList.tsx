import type { RefObject } from "react";
import { Bell } from "lucide-react";

import { cn } from "@/utils/cn";
import type { ChatMessage } from "../api/chats.api";

export function MessageList({
  scrollerRef,
  loadOlderRef,
  isFetchingNextPage,
  messages,
  myUserId,
}: {
  scrollerRef: RefObject<HTMLDivElement | null>;
  loadOlderRef: RefObject<HTMLDivElement | null>;
  isFetchingNextPage: boolean;
  messages: ChatMessage[];
  myUserId?: string;
}) {
  return (
    <div
      ref={scrollerRef}
      className="min-h-0 flex-1 overflow-y-auto bg-secondary/40 px-4 py-6 sm:px-8"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-5">
        <div ref={loadOlderRef} className="h-px" />
        {isFetchingNextPage && (
          <p className="text-center text-xs text-muted-foreground">
            Loading older messages...
          </p>
        )}
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isMine={message.senderId === myUserId}
          />
        ))}
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  isMine,
}: {
  message: ChatMessage;
  isMine: boolean;
}) {
  if (message.type === "SYSTEM") {
    return (
      <div className="mx-auto flex max-w-lg items-start gap-2 rounded-xl border border-border bg-secondary px-4 py-3 text-center text-xs leading-relaxed whitespace-pre-wrap text-muted-foreground">
        <Bell
          className="mt-0.5 size-3.5 shrink-0 text-primary"
          aria-hidden="true"
        />
        <span>{message.content}</span>
      </div>
    );
  }

  return (
    <div className={cn("flex", isMine ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "flex max-w-[78%] flex-col gap-1",
          isMine ? "items-end" : "items-start",
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
            isMine
              ? "rounded-br-sm bg-primary text-primary-foreground"
              : "rounded-bl-sm bg-background text-foreground shadow-sm ring-1 ring-border",
          )}
        >
          {message.content}
        </div>
        <span className="px-1 text-[11px] text-muted-foreground">
          {new Date(message.createdAt).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}
