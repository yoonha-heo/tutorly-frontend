"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useMyAvailabilities } from "@/features/teachers/hooks/useMyAvailabilities";
import { useSaveAvailabilities } from "@/features/teachers/hooks/useSaveAvailabilities";
import type { MyAvailability } from "@/features/teachers/types/teachers";
import {
  BOOKABLE_PAGE_SIZE,
  buildAvailabilityMap,
  formatWeekRange,
  getAvailabilityChanges,
  getBookableDates,
  getBookablePage,
  getUniqueTimeSlots,
  isReservedAvailability,
  toISODate,
} from "@/utils/availabilities";
import { createLocalDateKey } from "@/utils/localDateTime";

export function useAvailabilityGrid() {
  const { data, isPending } = useMyAvailabilities();
  const {
    mutate: saveAvailabilities,
    isPending: isSavePending,
    isError: isSaveError,
  } = useSaveAvailabilities();

  const serverAvailabilities = useMemo(() => data ?? [], [data]);
  const serverAvailabilitiesRef = useRef(serverAvailabilities);

  useEffect(() => {
    serverAvailabilitiesRef.current = serverAvailabilities;
  }, [serverAvailabilities]);

  const [draftAvailabilities, setDraftAvailabilities] = useState<
    MyAvailability[] | null
  >(null);
  const [bookableDates] = useState(() => getBookableDates());
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedDateKey, setSelectedDateKey] = useState(() =>
    toISODate(bookableDates[0]),
  );

  const availabilities = draftAvailabilities ?? serverAvailabilities;

  const changes = useMemo(
    () => getAvailabilityChanges(availabilities, serverAvailabilities),
    [availabilities, serverAvailabilities],
  );

  const isDirty = changes.length > 0;

  const pageCount = Math.ceil(bookableDates.length / BOOKABLE_PAGE_SIZE);
  const weekDates = useMemo(
    () => getBookablePage(bookableDates, pageIndex),
    [bookableDates, pageIndex],
  );
  const weekRangeLabel = formatWeekRange(
    weekDates[0],
    weekDates[weekDates.length - 1],
  );

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

  const canGoPrevWeek = pageIndex > 0;
  const canGoNextWeek = pageIndex < pageCount - 1;

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

  const goToPage = useCallback(
    (nextIndex: number) => {
      const clamped = Math.min(Math.max(nextIndex, 0), pageCount - 1);
      const page = getBookablePage(bookableDates, clamped);
      setPageIndex(clamped);
      setSelectedDateKey(toISODate(page[0]));
    },
    [bookableDates, pageCount],
  );

  const goToPrevWeek = useCallback(() => {
    goToPage(pageIndex - 1);
  }, [goToPage, pageIndex]);

  const goToNextWeek = useCallback(() => {
    goToPage(pageIndex + 1);
  }, [goToPage, pageIndex]);

  const goToToday = useCallback(() => {
    setPageIndex(0);
    setSelectedDateKey(toISODate(bookableDates[0]));
  }, [bookableDates]);

  const selectDate = useCallback((dateKey: string) => {
    setSelectedDateKey(dateKey);
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
    selectedDateKey,
    selectDate,
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
    isPending,
  };
}
