"use client";

import Image from "next/image";

import type { AdminTeacherProfile } from "../types/admin";
import { TeacherReviewActions } from "./TeacherReviewActions";
import { TeacherReviewFields } from "./TeacherReviewFields";

type TeacherReviewPanelProps = {
  teacher: AdminTeacherProfile | null;
  currentIndex: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onApprove: () => void;
  onReject: (rejectionReason: string) => void;
  isApproving: boolean;
  isRejecting: boolean;
};

export function TeacherReviewPanel({
  teacher,
  currentIndex,
  totalCount,
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
}: TeacherReviewPanelProps) {
  if (!teacher) {
    return (
      <section className="flex h-full items-center justify-center p-8">
        <p className="text-sm text-muted-foreground">
          No pending teacher profiles.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-8 sm:py-8">
      {/* Section: Queue navigation */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Teacher profile review
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Request {currentIndex + 1} of {totalCount} · oldest first
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onPrevious}
            disabled={!hasPrevious}
            className="h-10 rounded-xl border border-border px-3 text-sm font-medium text-foreground disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!hasNext}
            className="h-10 rounded-xl border border-border px-3 text-sm font-medium text-foreground disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      {/* Section: Identity */}
      <div className="mt-6 flex items-center gap-4">
        <Image
          src={
            teacher.profileImageUrl ??
            teacher.user.profileImage ??
            "/images/empty-profile.png"
          }
          alt={`${teacher.user.name ?? "Teacher"} profile`}
          width={72}
          height={72}
          className="size-[72px] rounded-xl object-cover"
          preload={true}
        />
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold text-foreground">
            {teacher.user.name ?? "Unnamed teacher"}
          </p>
          <p className="truncate text-sm text-muted-foreground">
            {teacher.user.email}
          </p>
        </div>
      </div>

      <TeacherReviewFields teacher={teacher} />

      <TeacherReviewActions
        key={teacher.id}
        onApprove={onApprove}
        onReject={onReject}
        isApproving={isApproving}
        isRejecting={isRejecting}
      />
    </section>
  );
}
