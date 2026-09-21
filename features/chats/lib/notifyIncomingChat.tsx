"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import { useOpenChatChannel } from "../components/OpenChatContext";

export const CHAT_TOASTER_ID = "chat-notifications";

const EMPTY_PROFILE = "/images/empty-profile.png";

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

export function notifyIncomingChat({
  channelId,
  senderName,
  senderImage,
  preview,
}: {
  channelId: string;
  senderName: string;
  senderImage: string | null;
  preview: string;
}) {
  playMessageSound();

  toast.custom(
    (toastId) => (
      <IncomingMessageToast
        toastId={toastId}
        channelId={channelId}
        senderName={senderName}
        senderImage={senderImage}
        preview={preview}
      />
    ),
    {
      toasterId: CHAT_TOASTER_ID,
      duration: 5000,
      unstyled: true,
      className: "w-[min(24rem,calc(100vw-2rem))]",
    },
  );
}

function IncomingMessageToast({
  toastId,
  channelId,
  senderName,
  senderImage,
  preview,
}: {
  toastId: string | number;
  channelId: string;
  senderName: string;
  senderImage: string | null;
  preview: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const openChatChannel = useOpenChatChannel();

  function handleView() {
    toast.dismiss(toastId);
    openChatChannel(channelId);
    if (pathname !== "/chats") {
      router.push("/chats");
    }
  }

  return (
    <button
      type="button"
      onClick={handleView}
      aria-label={`New message from ${senderName}`}
      className="group flex w-[min(24rem,calc(100vw-2rem))] min-w-0 cursor-pointer items-center gap-3 overflow-hidden rounded-xl border border-border bg-background p-3 text-left shadow-lg"
    >
      <Image
        src={senderImage ?? EMPTY_PROFILE}
        alt=""
        width={48}
        height={48}
        className="size-12 shrink-0 rounded-xl object-cover"
      />

      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold tracking-wide text-primary uppercase">
          New message
        </p>
        <p className="block truncate text-xs font-semibold text-foreground">
          {senderName}
        </p>
        <p className="block truncate text-xs text-muted-foreground">
          {preview || "Sent you a new message"}
        </p>
      </div>

      <span className="shrink-0 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-primary transition-colors group-hover:bg-primary/20">
        View message
      </span>
    </button>
  );
}
