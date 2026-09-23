import { BookOpen, Check, GraduationCap } from "lucide-react";

import type { SignupRole } from "@/features/auth/types/auth.types";
import { cn } from "@/utils/cn";

export const ROLE_OPTIONS: {
  role: SignupRole;
  title: string;
  description: string;
  icon: typeof BookOpen;
}[] = [
    {
      role: "STUDENT",
      title: "I want to learn",
      description: "Find a tutor and book lessons.",
      icon: BookOpen,
    },
    {
      role: "TEACHER",
      title: "I want to teach",
      description: "Create a profile and start teaching.",
      icon: GraduationCap,
    },
  ];

export function RoleOption({
  option,
  selected,
  onSelect,
}: {
  option: (typeof ROLE_OPTIONS)[number];
  selected: boolean;
  onSelect: (role: SignupRole) => void;
}) {
  const Icon = option.icon;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={() => onSelect(option.role)}
      className={cn(
        "flex items-center gap-4 rounded-2xl border px-4 py-3 text-left transition-colors",
        selected
          ? "border-primary bg-secondary"
          : "border-border hover:bg-secondary",
      )}
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-background">
        <Icon className="size-5 text-foreground" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-foreground">
          {option.title}
        </span>
        <span className="mt-1 block text-sm leading-5 text-muted-foreground">
          {option.description}
        </span>
      </span>
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full border",
          selected ? "border-primary bg-primary" : "border-border",
        )}
      >
        {selected && (
          <Check className="size-3 text-primary-foreground" strokeWidth={3} />
        )}
      </span>
    </button>
  );
}
