"use client";

import type {
  Dispatch,
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  RefObject,
  SetStateAction,
  SubmitEvent,
} from "react";
import dynamic from "next/dynamic";
import { Send, Smile } from "lucide-react";
import { EmojiStyle, Theme } from "emoji-picker-react";

import { cn } from "@/utils/cn";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

export function MessageInput({
  draft,
  setDraft,
  isEmojiOpen,
  textareaRef,
  canSend,
  sendMessage,
  insertEmoji,
  submitOnEnter,
  closeEmojiIfFocusLeft,
  keepInputFocused,
  toggleEmojiPicker,
}: {
  draft: string;
  setDraft: Dispatch<SetStateAction<string>>;
  isEmojiOpen: boolean;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  canSend: boolean;
  sendMessage: (event: SubmitEvent<HTMLFormElement>) => void;
  insertEmoji: (emoji: string) => void;
  submitOnEnter: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  closeEmojiIfFocusLeft: (event: FocusEvent<HTMLDivElement>) => void;
  keepInputFocused: (event: MouseEvent<HTMLDivElement>) => void;
  toggleEmojiPicker: () => void;
}) {
  return (
    <div className="border-t border-border bg-background px-4 py-3 sm:px-6">
      <form
        onSubmit={sendMessage}
        className="mx-auto flex max-w-3xl items-center gap-2"
      >
        <div className="relative h-11 flex-1" onBlur={closeEmojiIfFocusLeft}>
          {isEmojiOpen && (
            <div
              className="absolute right-0 bottom-[calc(100%+8px)] z-10"
              onMouseDown={keepInputFocused}
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
            onKeyDown={submitOnEnter}
            placeholder="Write a message"
            rows={1}
            className="block h-11 w-full resize-none overflow-hidden rounded-xl border border-border bg-background px-4 py-2.5 pr-11 text-sm leading-5 outline-none focus:ring-2 focus:ring-primary"
            aria-label="Message"
          />
          <IconButton
            label="Add emoji"
            className="absolute top-1/2 right-1 size-9 -translate-y-1/2"
            onClick={toggleEmojiPicker}
          >
            <Smile className="size-5" />
          </IconButton>
        </div>
        <button
          type="submit"
          disabled={!canSend}
          aria-label="Send message"
          className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
        >
          <Send className="size-5" />
        </button>
      </form>
    </div>
  );
}

function IconButton({
  label,
  children,
  className = "",
  onClick,
}: {
  label: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
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
