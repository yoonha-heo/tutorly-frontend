"use client";

import { useCallback, useMemo, useRef, useState } from "react";

import { useMyAvailabilities } from "@/features/teachers/hooks/useMyAvailabilities";
import { useSaveAvailabilities } from "@/features/teachers/hooks/useSaveAvailabilities";
import type { MyAvailability } from "@/features/teachers/types/teachers";
import {
  addDays,
  buildAvailabilityMap,
  formatWeekRange,
  getAvailabilityChanges,
  getUniqueTimeSlots,
  getWeekDates,
  getWeekStart,
  isReservedAvailability,
  toISODate,
  weekHasSlots,
} from "@/utils/availabilities";
import { createLocalDateKey } from "@/utils/localDateTime";

export function useAvailabilityGrid(
  initialAvailabilities?: MyAvailability[],
) {
  const { data } = useMyAvailabilities({
    initialData: initialAvailabilities,
  });
  const {
    mutate: saveAvailabilities,
    isPending: isSavePending,
    isError: isSaveError,
  } = useSaveAvailabilities();

  const serverAvailabilities = data ?? [];
  const serverAvailabilitiesRef = useRef(serverAvailabilities);
  serverAvailabilitiesRef.current = serverAvailabilities;

  const [draftAvailabilities, setDraftAvailabilities] = useState<
    MyAvailability[] | null
  >(null);
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));

  const availabilities = draftAvailabilities ?? serverAvailabilities;

  const changes = useMemo(
    () => getAvailabilityChanges(availabilities, serverAvailabilities),
    [availabilities, serverAvailabilities],
  );

  const isDirty = changes.length > 0;

  const weekDates = useMemo(() => getWeekDates(weekStart), [weekStart]);
  const weekEnd = addDays(weekStart, 6);
  const weekRangeLabel = formatWeekRange(weekStart, weekEnd);

  const visibleDates = useMemo(
    () => new Set(weekDates.map(toISODate)),
    [weekDates],
  );

  const availabilityMap = useMemo(
    () => buildAvailabilityMap(availabilities),
    [availabilities],
  );

  const timeSlots = useMemo(
    () => getUniqueTimeSlots(serverAvailabilities, visibleDates),
    [serverAvailabilities, visibleDates],
  );

  const allExistingDateKeys = useMemo(() => {
    const set = new Set<string>();
    for (const a of serverAvailabilities) {
      set.add(createLocalDateKey(a.startAt));
    }
    return set;
  }, [serverAvailabilities]);

  const canGoPrevWeek = useMemo(
    () => weekHasSlots(allExistingDateKeys, addDays(weekStart, -7)),
    [allExistingDateKeys, weekStart],
  );

  const canGoNextWeek = useMemo(
    () => weekHasSlots(allExistingDateKeys, addDays(weekStart, 7)),
    [allExistingDateKeys, weekStart],
  );

  const handleToggle = useCallback((availabilityId: string) => {
    setDraftAvailabilities((prev) => {
      const target = prev ?? serverAvailabilitiesRef.current;
      if (!target) return prev;

      return target.map((availability) => {
        if (availability.id !== availabilityId) return availability;
        if (isReservedAvailability(availability)) return availability;
        return { ...availability, isOpen: !availability.isOpen };
      });
    });
  }, []);

  const handleToggleDay = useCallback((dateKey: string, isOpen: boolean) => {
    setDraftAvailabilities((prev) => {
      const target = prev ?? serverAvailabilitiesRef.current;
      if (!target) return prev;

      return target.map((availability) => {
        if (createLocalDateKey(availability.startAt) !== dateKey) {
          return availability;
        }
        if (isReservedAvailability(availability)) return availability;
        return { ...availability, isOpen };
      });
    });
  }, []);

  const goToPrevWeek = useCallback(() => {
    setWeekStart((prev) => addDays(prev, -7));
  }, []);

  const goToNextWeek = useCallback(() => {
    setWeekStart((prev) => addDays(prev, 7));
  }, []);

  const goToToday = useCallback(() => {
    setWeekStart(getWeekStart(new Date()));
  }, []);

  const handleSave = useCallback(() => {
    if (!isDirty || isSavePending) return;

    saveAvailabilities(changes, {
      onSuccess: () => {
        setDraftAvailabilities(null);
      },
    });
  }, [changes, isDirty, isSavePending, saveAvailabilities]);

  const handleReset = useCallback(() => {
    setDraftAvailabilities(null);
  }, []);

  return {
    availabilities,
    changes,
    isDirty,
    weekDates,
    weekRangeLabel,
    availabilityMap,
    timeSlots,
    canGoPrevWeek,
    canGoNextWeek,
    goToPrevWeek,
    goToNextWeek,
    goToToday,
    handleToggle,
    handleToggleDay,
    handleSave,
    handleReset,
    isSaveError,
    isSavePending,
  };
}
