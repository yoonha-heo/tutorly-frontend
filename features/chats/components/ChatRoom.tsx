"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type SubmitEvent } from "react";
import dynamic from "next/dynamic";
import { Bell, ChevronLeft, Send, Smile } from "lucide-react";
import { EmojiStyle, Theme } from "emoji-picker-react";

import { cn } from "@/utils/cn";
import { useMe } from "@/features/auth/hooks/useMe";
import { ChatAvatar } from "./ChatAvatar";
import { useMessageList } from "../hooks/useMessageList";
import { useMarkChatAsRead } from "../hooks/useMarkChatAsRead";
import { useSendChat } from "../hooks/useSendChat";
import type { ChatListItem, ChatMessage, MessageListResponse } from "../api/chats.api";

const EMPTY_PROFILE = "/images/empty-profile.png";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

export function ChatRoom({
  channel,
  isListOpen,
  onBack,
  initialMessages,
}: {
  channel: ChatListItem;
  isListOpen: boolean;
  onBack: () => void;
  initialMessages?: MessageListResponse;
}) {
  const { data: me } = useMe();
  const [draft, setDraft] = useState("");
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const loadOlderRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useMessageList(channel.id, { initialData: initialMessages });
  const sendChat = useSendChat();
  const markAsRead = useMarkChatAsRead();
  const seenMessageIdRef = useRef<string | undefined>(undefined);

  const messages =
    data?.pages.flatMap((page) => page.items).toReversed() ?? [];
  const lastMessageId = messages.at(-1)?.id;
  const name = channel.otherUser?.name ?? "User";
  const recipientId = channel.otherUser?.id;

  useEffect(() => {
    seenMessageIdRef.current = undefined;
  }, [channel.id]);

  useEffect(() => {
    if (isListOpen || !lastMessageId) return;

    if (seenMessageIdRef.current === undefined) {
      seenMessageIdRef.current = lastMessageId;
      return;
    }

    if (seenMessageIdRef.current === lastMessageId) return;
    seenMessageIdRef.current = lastMessageId;
    markAsRead.mutate(channel.id);
  }, [channel.id, lastMessageId, isListOpen]);

  useLayoutEffect(() => {
    if (!lastMessageId) return;

    function pinToLatest() {
      const scroller = scrollerRef.current;
      if (!scroller) return;
      scroller.scrollTop = scroller.scrollHeight;
    }

    pinToLatest();
    const frame = requestAnimationFrame(pinToLatest);
    return () => cancelAnimationFrame(frame);
  }, [channel.id, lastMessageId, isListOpen]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const target = loadOlderRef.current;
    if (!scroller || !target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          !entries[0].isIntersecting ||
          !hasNextPage ||
          isFetchingNextPage ||
          scroller.scrollTop > 16
        ) {
          return;
        }

        const previousHeight = scroller.scrollHeight;
        void fetchNextPage().then(() => {
          scroller.scrollTop = scroller.scrollHeight - previousHeight;
        });
      },
      { root: scroller, rootMargin: "80px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [channel.id, fetchNextPage, hasNextPage, isFetchingNextPage]);

  function sendMessage(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = draft.trim();
    if (!body || !recipientId || sendChat.isPending) return;

    sendChat.mutate(
      { recipientId, content: body },
      {
        onSuccess: () => {
          setDraft("");
          setIsEmojiOpen(false);
        },
      },
    );
  }

  function insertEmoji(emoji: string) {
    const textarea = textareaRef.current;
    const start = textarea?.selectionStart ?? draft.length;
    const end = textarea?.selectionEnd ?? draft.length;
    const next = draft.slice(0, start) + emoji + draft.slice(end);

    setDraft(next);

    requestAnimationFrame(() => {
      textarea?.focus();
      const cursor = start + emoji.length;
      textarea?.setSelectionRange(cursor, cursor);
    });
  }

  return (
    <section
      className={`flex min-w-0 flex-1 flex-col ${isListOpen ? "hidden md:flex" : "flex"
        }`}
    >
      <header className="flex min-h-[73px] items-center border-b border-border bg-background px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <IconButton
            label="Back to conversations"
            className="md:hidden"
            onClick={onBack}
          >
            <ChevronLeft className="size-5" />
          </IconButton>
          <ChatAvatar
            src={channel.otherUser?.profileImage ?? EMPTY_PROFILE}
            alt={name}
            size="md"
          />
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold">{name}</h2>
          </div>
        </div>
      </header>

      <div
        ref={scrollerRef}
        className="flex-1 overflow-y-auto bg-secondary/40 px-4 py-6 sm:px-8"
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
              isMine={message.senderId === me?.id}
            />
          ))}
        </div>
      </div>

      <div className="border-t border-border bg-background px-4 py-3 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <form onSubmit={sendMessage} className="flex items-center gap-2">
            <div
              className="relative h-11 flex-1"
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  setIsEmojiOpen(false);
                }
              }}
            >
              {isEmojiOpen && (
                <div
                  className="absolute right-0 bottom-[calc(100%+8px)] z-10"
                  onMouseDown={(event) => {
                    if (!(event.target instanceof HTMLInputElement)) {
                      event.preventDefault();
                    }
                  }}
                >
                  <EmojiPicker
                    onEmojiClick={(emojiData) => insertEmoji(emojiData.emoji)}
                    theme={Theme.AUTO}
                    emojiStyle={EmojiStyle.NATIVE}
                    width={320}
                    height={360}
                    lazyLoadEmojis
                    previewConfig={{ showPreview: false }}
                  />
                </div>
              )}
              <textarea
                ref={textareaRef}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey &&
                    !event.nativeEvent.isComposing &&
                    event.keyCode !== 229
                  ) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                placeholder="Write a message"
                rows={1}
                className="block h-11 w-full resize-none overflow-hidden rounded-xl border border-border bg-background px-4 py-2.5 pr-11 text-sm leading-5 outline-none focus:ring-2 focus:ring-primary"
                aria-label="Message"
              />
              <IconButton
                label="Add emoji"
                type="button"
                className="absolute top-1/2 right-1 size-9 -translate-y-1/2"
                onClick={() => setIsEmojiOpen((open) => !open)}
              >
                <Smile className="size-5" />
              </IconButton>
            </div>
            <button
              type="submit"
              disabled={!draft.trim() || !recipientId || sendChat.isPending}
              aria-label="Send message"
              className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
            >
              <Send className="size-5" />
            </button>
          </form>
        </div>
      </div>
    </section>
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
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex max-w-[78%] flex-col gap-1 ${isMine ? "items-end" : "items-start"
          }`}
      >
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${isMine
            ? "rounded-br-sm bg-primary text-primary-foreground"
            : "rounded-bl-sm bg-background text-foreground shadow-sm ring-1 ring-border"
            }`}
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

function IconButton({
  label,
  children,
  className = "",
  type = "button",
  onClick,
}: {
  label: string;
  children: ReactNode;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={label}
      className={cn(
        "flex size-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
        className,
      )}
    >
      {children}
    </button>
  );
}
