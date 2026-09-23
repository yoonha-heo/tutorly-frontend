"use client";

import { cn } from "@/utils/cn";
import { useMe } from "@/features/auth/hooks/useMe";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { useChatMessages } from "../hooks/useChatMessages";
import { useChatRoomScroll } from "../hooks/useChatRoomScroll";
import { useChatInput } from "../hooks/useChatInput";
import type { ChatListItem } from "../api/chats.api";

const EMPTY_PROFILE = "/images/empty-profile.png";

export function ChatRoom({
  channel,
  isListOpen,
  onBack,
}: {
  channel: ChatListItem;
  isListOpen: boolean;
  onBack: () => void;
}) {
  const { data: me } = useMe();
  const {
    messages,
    lastMessageId,
    pageCount,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
  } = useChatMessages(channel.id, { isListOpen });
  const { scrollerRef, loadOlderRef } = useChatRoomScroll({
    channelId: channel.id,
    isListOpen,
    lastMessageId,
    pageCount,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });
  const {
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
  } = useChatInput(channel.otherUser?.id);

  return (
    <section
      className={cn(
        "flex min-h-0 min-w-0 flex-1 flex-col",
        isListOpen ? "hidden md:flex" : "flex",
      )}
    >
      <ChatHeader
        name={channel.otherUser?.name ?? "User"}
        avatarSrc={channel.otherUser?.profileImage ?? EMPTY_PROFILE}
        onBack={onBack}
      />
      {isPending ? (
        <div
          className="min-h-0 flex-1 bg-secondary/40 px-4 py-6 sm:px-8"
          aria-label="Loading messages"
        />
      ) : (
        <MessageList
          scrollerRef={scrollerRef}
          loadOlderRef={loadOlderRef}
          isFetchingNextPage={isFetchingNextPage}
          messages={messages}
          myUserId={me?.id}
        />
      )}
      <MessageInput
        draft={draft}
        setDraft={setDraft}
        isEmojiOpen={isEmojiOpen}
        textareaRef={textareaRef}
        canSend={canSend}
        sendMessage={sendMessage}
        insertEmoji={insertEmoji}
        submitOnEnter={submitOnEnter}
        closeEmojiIfFocusLeft={closeEmojiIfFocusLeft}
        keepInputFocused={keepInputFocused}
        toggleEmojiPicker={toggleEmojiPicker}
      />
    </section>
  );
}
