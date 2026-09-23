"use client";

import { useState } from "react";

import { useLogout } from "@/features/auth/hooks/useLogout";

import { useAdminAccess } from "../hooks/useAdminAccess";
import { useReviewTeacher } from "../hooks/useReviewTeacher";
import { useTeacherReviewQueue } from "../hooks/useTeacherReviewQueue";
import {
  AdminFeatureList,
  type AdminFeature,
} from "./AdminFeatureList";
import { TeacherReviewPanel } from "./TeacherReviewPanel";

export function AdminClient() {
  const { canLoad, me } = useAdminAccess();
  const [selectedFeature, setSelectedFeature] =
    useState<AdminFeature>("teacher-review");
  const logoutMutation = useLogout();
  const {
    currentTeacher,
    currentIndex,
    totalCount,
    queuedCount,
    hasPrevious,
    hasNext,
    goToPrevious,
    goToNext,
    isPending,
    isError,
  } = useTeacherReviewQueue(canLoad);
  const { approveTeacher, rejectTeacher, isApproving, isRejecting } =
    useReviewTeacher();

  if (!canLoad || isPending) {
    return <AdminSkeleton />;
  }

  if (isError || !me) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-xl font-semibold text-foreground">
          Could not load the admin queue
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Please try again in a moment.
        </p>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      <AdminFeatureList
        selectedFeature={selectedFeature}
        onSelectFeature={setSelectedFeature}
        pendingCount={queuedCount}
        adminName={me.name}
        onLogout={() => logoutMutation.mutate()}
      />

      <main className="min-w-0 flex-1">
        {selectedFeature === "teacher-review" && (
          <TeacherReviewPanel
            teacher={currentTeacher}
            currentIndex={currentIndex}
            totalCount={totalCount}
            hasPrevious={hasPrevious}
            hasNext={hasNext}
            onPrevious={goToPrevious}
            onNext={goToNext}
            onApprove={() => {
              if (currentTeacher) approveTeacher(currentTeacher.id);
            }}
            onReject={(rejectionReason) => {
              if (currentTeacher) {
                rejectTeacher({
                  id: currentTeacher.id,
                  rejectionReason,
                });
              }
            }}
            isApproving={isApproving}
            isRejecting={isRejecting}
          />
        )}
      </main>
    </div>
  );
}

function AdminSkeleton() {
  return (
    <div
      className="flex min-h-screen flex-col bg-background md:flex-row"
      aria-label="Loading admin"
    >
      <aside className="w-full border-b border-border md:w-64 md:border-r md:border-b-0">
        <div className="border-b border-border px-5 py-4">
          <div className="h-3 w-12 animate-pulse rounded bg-secondary" />
          <div className="mt-2 h-6 w-20 animate-pulse rounded bg-secondary" />
        </div>
        <div className="p-3">
          <div className="h-16 animate-pulse rounded-xl bg-secondary/50" />
        </div>
      </aside>
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-8">
        <div className="mx-auto w-full max-w-3xl">
          <div className="h-7 w-56 animate-pulse rounded bg-secondary" />
          <div className="mt-2 h-4 w-40 animate-pulse rounded bg-secondary" />
          <div className="mt-8 h-96 animate-pulse rounded-2xl border border-border bg-secondary/50" />
        </div>
      </main>
    </div>
  );
}
