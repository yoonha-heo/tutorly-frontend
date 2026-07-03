import { useMutation } from "@tanstack/react-query";
import { submitTeacherProfile } from "../api/teachers.api";

export function useSubmitTeacherProfile() {
  return useMutation({
    mutationFn: submitTeacherProfile,
  });
}
