"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Calendar, UserPen } from "lucide-react";

import { DashboardAvailabilityGrid } from "@/features/teachers/components/DashBoardAvailabilityGrid";
import type { Teacher } from "@/features/teachers/types/teachers";

const DashboardProfileEditor = dynamic(
  () =>
    import("@/features/teachers/components/DashBoardProfileEditor").then(
      (mod) => mod.DashboardProfileEditor,
    )
);

type TabId = "availability" | "profile";

const TABS: { id: TabId; label: string; shortLabel: string; icon: typeof Calendar }[] =
  [
    {
      id: "availability",
      label: "Manage Schedule",
      shortLabel: "Schedule",
      icon: Calendar,
    },
    {
      id: "profile",
      label: "Edit profile",
      shortLabel: "Profile",
      icon: UserPen,
    },
  ];

interface TeacherDashboardTabsProps {
  teacher: Teacher;
  profileOnly?: boolean;
}

export function TeacherDashboardTabs({
  teacher,
  profileOnly = false,
}: TeacherDashboardTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>(
    profileOnly ? "profile" : "availability",
  );

  if (profileOnly) {
    return <DashboardProfileEditor teacher={teacher} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div
        role="tablist"
        aria-label="Teacher dashboard sections"
        className="flex gap-2 rounded-2xl border border-border bg-secondary/40 p-1.5"
      >
        {TABS.map(({ id, label, shortLabel, icon: Icon }) => {
          const isActive = activeTab === id;

          return (
            <button
              key={id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${id}`}
              id={`tab-${id}`}
              type="button"
              onClick={() => setActiveTab(id)}
              className={[
                "flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors",
                isActive
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              <Icon className="size-4 shrink-0" />
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{shortLabel}</span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id="tabpanel-availability"
        aria-labelledby="tab-availability"
        hidden={activeTab !== "availability"}
      >
        {activeTab === "availability" && (
          <section className="rounded-3xl border border-border bg-background p-5 sm:p-8">
            <DashboardAvailabilityGrid />
          </section>
        )}
      </div>

      <div
        role="tabpanel"
        id="tabpanel-profile"
        aria-labelledby="tab-profile"
        hidden={activeTab !== "profile"}
      >
        {activeTab === "profile" && (
          <DashboardProfileEditor teacher={teacher} />
        )}
      </div>
    </div>
  );
}
