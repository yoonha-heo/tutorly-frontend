"use client";

import { cn } from "@/utils/cn";
import { useMe } from "@/features/auth/hooks/useMe";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { useChatMessages } from "../hooks/useChatMessages";
import { useChatRoomScroll } from "../hooks/useChatRoomScroll";
import { useChatInput } from "../hooks/useChatInput";
import type { ChatListItem, MessageListResponse } from "../api/chats.api";

const EMPTY_PROFILE = "/images/empty-profile.png";

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
  const {
    messages,
    lastMessageId,
    pageCount,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useChatMessages(channel.id, { initialMessages, isListOpen });
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
      <MessageList
        scrollerRef={scrollerRef}
        loadOlderRef={loadOlderRef}
        isFetchingNextPage={isFetchingNextPage}
        messages={messages}
        myUserId={me?.id}
      />
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
