"use client";

import { Bell } from "lucide-react";
import { toast } from "sonner";

const CHAT_TOASTER_ID = "chat-notifications";

let audioContext: AudioContext | null = null;

function playMessageSound() {
  try {
    const context = (audioContext ??= new AudioContext());
    void context.resume();

    const now = context.currentTime;

    function tone(frequency: number, start: number, duration: number) {
      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.14, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + duration);
    }

    tone(880, now, 0.12);
    tone(1174, now + 0.1, 0.18);
  } catch {
  }
}

export function notifyIncomingChat(senderName: string) {
  playMessageSound();

  toast.custom(
    () => (
      <div className="flex items-center gap-2.5 rounded-xl border border-border bg-background px-4 py-2.5 shadow-md">
        <Bell className="size-4 shrink-0 text-primary" aria-hidden="true" />
        <p className="text-sm text-foreground">
          {senderName} sent you a new message
        </p>
      </div>
    ),
    {
      toasterId: CHAT_TOASTER_ID,
      duration: 4000,
      unstyled: true,
    },
  );
}
