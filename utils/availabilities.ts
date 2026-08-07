import type { MyAvailability } from "@/features/teachers/types/teachers";
import {
  createLocalDateKey,
  formatAvailabilityTime,
} from "@/utils/localDateTime";

export type SlotStatus = "on" | "off" | "reserved";

export function isReservedAvailability(availability: MyAvailability): boolean {
  return availability.blocks.length > 0;
}

export function getAvailabilityStatus(
  availability: MyAvailability,
): SlotStatus {
  if (isReservedAvailability(availability)) {
    return "reserved";
  }

  return availability.isOpen ? "on" : "off";
}

export function getAvailabilitySlotKey(availability: MyAvailability): string {
  return `${createLocalDateKey(availability.startAt)}_${formatAvailabilityTime(availability.startAt)}`;
}

/** Returns the Monday of the ISO week that contains `date`. */
export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getWeekDates(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
}

export function buildAvailabilityMap(
  availabilities: MyAvailability[],
): Map<string, MyAvailability> {
  const map = new Map<string, MyAvailability>();
  for (let i = 0; i < availabilities.length; i++) {
    const item = availabilities[i];
    map.set(getAvailabilitySlotKey(item), item);
  }
  return map;
}

export function getUniqueTimeSlots(
  availabilities: MyAvailability[],
  visibleDates: Set<string>,
): string[] {
  const times = new Set<string>();

  for (let i = 0; i < availabilities.length; i++) {
    const availability = availabilities[i];

    const dateKey = createLocalDateKey(availability.startAt);

    if (visibleDates.has(dateKey)) {
      times.add(formatAvailabilityTime(availability.startAt));
    }
  }

  return Array.from(times).sort();
}

export function filterAvailabilitiesByDate(
  availabilities: MyAvailability[],
  dateKey: string,
): MyAvailability[] {
  return availabilities.filter(
    (availability) => createLocalDateKey(availability.startAt) === dateKey,
  );
}

export function getDayAvailabilities(
  availabilityMap: Map<string, MyAvailability>,
  dateKey: string,
) {
  return Array.from(availabilityMap.values()).filter(
    (availability) => createLocalDateKey(availability.startAt) === dateKey,
  );
}

export function hasOpenSlotsForDay(
  availabilityMap: Map<string, MyAvailability>,
  dateKey: string,
) {
  return getDayAvailabilities(availabilityMap, dateKey).some(
    (availability) =>
      !isReservedAvailability(availability) && availability.isOpen,
  );
}

export function weekHasSlots(
  existingDateKeysSet: Set<string>,
  weekStart: Date,
): boolean {
  const weekDates = getWeekDates(weekStart);
  for (let i = 0; i < weekDates.length; i++) {
    if (existingDateKeysSet.has(toISODate(weekDates[i]))) {
      return true;
    }
  }
  return false;
}

export function getAvailabilityChanges(
  draft: MyAvailability[],
  serverAvailabilities: MyAvailability[],
) {
  const serverMap = new Map<string, MyAvailability>();
  for (let i = 0; i < serverAvailabilities.length; i++) {
    const item = serverAvailabilities[i];
    serverMap.set(item.id, item);
  }

  const result: { id: string; isOpen: boolean }[] = [];
  for (let i = 0; i < draft.length; i++) {
    const availability = draft[i];
    const original = serverMap.get(availability.id);
    if (original && original.isOpen !== availability.isOpen) {
      result.push({
        id: availability.id,
        isOpen: availability.isOpen,
      });
    }
  }

  return result;
}

export function formatWeekRange(start: Date, end: Date) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return `${formatter.format(start)} - ${formatter.format(end)}`;
}
