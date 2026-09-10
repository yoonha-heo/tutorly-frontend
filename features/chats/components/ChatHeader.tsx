import type { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";

import { cn } from "@/utils/cn";
import { ChatAvatar } from "./ChatAvatar";

export function ChatHeader({
  name,
  avatarSrc,
  onBack,
}: {
  name: string;
  avatarSrc: string;
  onBack: () => void;
}) {
  return (
    <header className="flex min-h-[73px] items-center border-b border-border bg-background px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <IconButton
          label="Back to conversations"
          className="md:hidden"
          onClick={onBack}
        >
          <ChevronLeft className="size-5" />
        </IconButton>
        <ChatAvatar src={avatarSrc} alt={name} size="md" />
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold">{name}</h2>
        </div>
      </div>
    </header>
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
