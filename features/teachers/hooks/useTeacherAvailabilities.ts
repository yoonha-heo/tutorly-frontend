import { useQuery } from "@tanstack/react-query";

import { getTeacherAvailabilities } from "../api/teachers.api";

export function useTeacherAvailabilities(
  teacherId: string,
  isModalOpen: boolean,
) {
  return useQuery({
    queryKey: ["teacher-availabilities", teacherId],
    queryFn: () => getTeacherAvailabilities(teacherId),
    enabled: isModalOpen && Boolean(teacherId),
    staleTime: 30_000,
  });
}
