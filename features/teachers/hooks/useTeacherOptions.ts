import { useQuery } from "@tanstack/react-query";

import {
  getAvailableLanguages,
  getAvailableSpecialties,
} from "@/features/teachers/api/teachers.api";

export function useTeacherOptions() {
  return useQuery({
    queryKey: ["teacher-options"],
    queryFn: async () => {
      const [languages, specialties] = await Promise.all([
        getAvailableLanguages(),
        getAvailableSpecialties(),
      ]);

      return { languages, specialties };
    },
  });
}
