"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { approveTeacher, rejectTeacher } from "../api/admin.api";

export function useReviewTeacher() {
  const queryClient = useQueryClient();

  const approveMutation = useMutation({
    mutationFn: (id: string) => approveTeacher(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin", "pending-teachers"],
      });
      toast.success("Teacher profile approved.");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({
      id,
      rejectionReason,
    }: {
      id: string;
      rejectionReason: string;
    }) => rejectTeacher(id, rejectionReason),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin", "pending-teachers"],
      });
      toast.success("Teacher profile rejected.");
    },
  });

  return {
    approveTeacher: approveMutation.mutate,
    rejectTeacher: rejectMutation.mutate,
    isApproving: approveMutation.isPending,
    isRejecting: rejectMutation.isPending,
  };
}
