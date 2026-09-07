"use client";

import { Check, LoaderCircle, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { useSendChat } from "@/features/chats/hooks/useSendChat";
import type { Teacher } from "@/features/teachers/types/teachers";

interface MessageModalProps {
  teacher: Teacher;
  isOpen: boolean;
  onClose: () => void;
}

export function MessageModal({ teacher, isOpen, onClose }: MessageModalProps) {
  const firstName = teacher.user.name.split(" ")[0];
  const [isMounted, setIsMounted] = useState(false);
  const [message, setMessage] = useState(`Hi ${firstName}!\n\n`);
  const [isSent, setIsSent] = useState(false);
  const sendChat = useSendChat();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    setMessage(`Hi ${firstName}!\n\n`);
    setIsSent(false);
  }, [firstName, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !sendChat.isPending) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, sendChat.isPending]);

  const canSend = message.trim().length > 2 && !sendChat.isPending;

  function sendMessage() {
    if (!canSend) return;

    sendChat.mutate(
      { recipientId: teacher.user.id, content: message.trim() },
      { onSuccess: () => setIsSent(true) },
    );
  }

  if (!isMounted || !isOpen) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-tutor-title"
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !sendChat.isPending) {
          onClose();
        }
      }}
    >
      <div className="relative max-h-[90dvh] w-full overflow-y-auto rounded-t-3xl bg-background px-5 py-6 shadow-2xl sm:max-w-xl sm:rounded-3xl sm:px-8 sm:py-8">
        <button
          type="button"
          onClick={() => !sendChat.isPending && onClose()}
          aria-label="Close message modal"
          className="absolute top-5 right-5 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="size-6" />
        </button>

        {isSent ? (
          <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
              <Check className="size-7" />
            </div>
            <h2 className="mt-5 text-2xl font-semibold text-foreground">
              Message sent
            </h2>
            <p className="mt-2 max-w-md leading-relaxed text-muted-foreground">
              {teacher.user.name} will receive your message and get back to you
              soon.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-base font-semibold text-primary-foreground hover:bg-primary-dark"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center text-center">
              <Image
                src={teacher.profileImageUrl ?? "/images/empty-profile.png"}
                alt={`${teacher.user.name} profile`}
                width={96}
                height={96}
                className="size-24 rounded-2xl object-cover"
              />
              <h2
                id="contact-tutor-title"
                className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
              >
                Contact {teacher.user.name}
              </h2>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
                Introduce yourself to the tutor, share your learning goals and
                ask any questions.
              </p>
            </div>

            <label htmlFor="tutor-message" className="sr-only">
              Message for {teacher.user.name}
            </label>
            <textarea
              id="tutor-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Write your message here..."
              rows={5}
              className="mt-5 min-h-32 w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary sm:text-base"
            />

            <button
              type="button"
              onClick={sendMessage}
              disabled={!canSend}
              className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-base font-semibold text-primary-foreground hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              {sendChat.isPending ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" /> Sending
                </>
              ) : (
                "Send message"
              )}
            </button>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
