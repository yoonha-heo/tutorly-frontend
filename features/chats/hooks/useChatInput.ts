import {
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type SubmitEvent,
} from "react";

import { useSendChat } from "./useSendChat";

export function useChatInput(recipientId?: string) {
  const sendChat = useSendChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [draft, setDraft] = useState("");
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);

  const canSend = Boolean(draft.trim() && recipientId && !sendChat.isPending);

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

    // WHY: rAF waits for the controlled value to commit before restoring the caret
    requestAnimationFrame(() => {
      textarea?.focus();
      const cursor = start + emoji.length;
      textarea?.setSelectionRange(cursor, cursor);
    });
  }

  function submitOnEnter(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing &&
      event.keyCode !== 229
    ) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  function closeEmojiIfFocusLeft(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsEmojiOpen(false);
    }
  }

  function keepInputFocused(event: MouseEvent<HTMLDivElement>) {
    if (!(event.target instanceof HTMLInputElement)) {
      event.preventDefault();
    }
  }

  return {
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
    toggleEmojiPicker: () => setIsEmojiOpen((open) => !open),
  };
}
