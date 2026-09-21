"use client";

import { useState } from "react";

type TeacherReviewActionsProps = {
  onApprove: () => void;
  onReject: (rejectionReason: string) => void;
  isApproving: boolean;
  isRejecting: boolean;
};

export function TeacherReviewActions({
  onApprove,
  onReject,
  isApproving,
  isRejecting,
}: TeacherReviewActionsProps) {
  const [rejectionReason, setRejectionReason] = useState("");
  const trimmedReason = rejectionReason.trim();
  const isBusy = isApproving || isRejecting;

  return (
    <section className="border-t border-border pt-6">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onApprove}
          disabled={isBusy}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isApproving ? "Approving..." : "Approve"}
        </button>
      </div>

      <label className="mt-5 block">
        <span className="text-sm font-medium text-foreground">
          Rejection reason
        </span>
        <textarea
          value={rejectionReason}
          onChange={(event) => setRejectionReason(event.target.value)}
          rows={3}
          maxLength={1000}
          placeholder="Explain what the teacher should fix."
          className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
        />
      </label>

      <button
        type="button"
        onClick={() => onReject(trimmedReason)}
        disabled={isBusy || !trimmedReason}
        className="mt-3 inline-flex h-11 items-center justify-center rounded-xl border border-border px-5 text-sm font-semibold text-foreground hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isRejecting ? "Rejecting..." : "Reject"}
      </button>
    </section>
  );
}
