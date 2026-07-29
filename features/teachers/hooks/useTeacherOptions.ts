import { useQuery } from "@tanstack/react-query";

import {
  getAvailableLanguages,
  getAvailableSpecialties,
} from "@/features/teachers/api/teachers.api";

const FALLBACK_DATA = { languages: [], specialties: [] };

export function useTeacherOptions() {
  const queryInfo = useQuery({
    queryKey: ["teacher-options"],
    queryFn: async () => {
      const [languages, specialties] = await Promise.all([
        getAvailableLanguages(),
        getAvailableSpecialties(),
      ]);

      return { languages, specialties };
    },
  });

  return {
    ...queryInfo,
    data: queryInfo.data ?? FALLBACK_DATA,
  };
}
