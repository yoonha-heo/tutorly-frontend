"use client";

import { useState } from "react";

import { useLogout } from "@/features/auth/hooks/useLogout";
import type { Me } from "@/features/auth/types/auth.types";

import { useReviewTeacher } from "../hooks/useReviewTeacher";
import { useTeacherReviewQueue } from "../hooks/useTeacherReviewQueue";
import type { AdminTeacherListResponse } from "../types/admin";
import {
  AdminFeatureList,
  type AdminFeature,
} from "./AdminFeatureList";
import { TeacherReviewPanel } from "./TeacherReviewPanel";

type AdminClientProps = {
  me: Me;
  initialTeachers: AdminTeacherListResponse;
};

export function AdminClient({ me, initialTeachers }: AdminClientProps) {
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
  } = useTeacherReviewQueue(initialTeachers);
  const { approveTeacher, rejectTeacher, isApproving, isRejecting } =
    useReviewTeacher();

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
