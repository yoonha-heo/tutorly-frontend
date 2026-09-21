"use client";

import { cn } from "@/utils/cn";

export type AdminFeature = "teacher-review";

const FEATURES: { id: AdminFeature; label: string; description: string }[] = [
  {
    id: "teacher-review",
    label: "Teacher profiles",
    description: "Approve or reject pending applications",
  },
];

type AdminFeatureListProps = {
  selectedFeature: AdminFeature;
  onSelectFeature: (feature: AdminFeature) => void;
  pendingCount: number;
  adminName: string | null;
  onLogout: () => void;
};

export function AdminFeatureList({
  selectedFeature,
  onSelectFeature,
  pendingCount,
  adminName,
  onLogout,
}: AdminFeatureListProps) {
  return (
    <aside className="flex w-full flex-col border-b border-border bg-background md:w-64 md:border-r md:border-b-0">
      <div className="border-b border-border px-5 py-4">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Admin
        </p>
        <h1 className="mt-1 text-lg font-semibold text-foreground">Tutorly</h1>
      </div>

      <nav className="flex-1 p-3">
        {FEATURES.map((feature) => {
          const isSelected = selectedFeature === feature.id;

          return (
            <button
              key={feature.id}
              type="button"
              onClick={() => onSelectFeature(feature.id)}
              className={cn(
                "flex w-full flex-col items-start rounded-xl px-3 py-3 text-left transition-colors",
                isSelected
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <span className="flex w-full items-center justify-between gap-2">
                <span className="text-sm font-medium">{feature.label}</span>
                {feature.id === "teacher-review" && (
                  <span className="rounded-full bg-background px-2 py-0.5 text-xs font-medium text-foreground">
                    {pendingCount}
                  </span>
                )}
              </span>
              <span className="mt-1 text-xs">{feature.description}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-border px-5 py-4">
        <p className="truncate text-sm font-medium text-foreground">
          {adminName ?? "Admin"}
        </p>
        <button
          type="button"
          onClick={onLogout}
          className="mt-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
