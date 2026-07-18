/**
 * 1. UTC 날짜 문자열을 로컬 기준의 요약형 날짜로 변환합니다.
 * @example "2026-07-16T08:00:00Z" -> "Thu, Jul 16, 2026"
 */
export function formatLocalLessonDate(
  dateString: string | null | undefined,
): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return isNaN(date.getTime())
    ? "-"
    : new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);
}

/**
 * 2. 두 UTC 시간 문자열을 받아 로컬 기준의 시간 범위를 구합니다.
 * @example ("2026-07-16T08:00:00Z", "2026-07-16T09:00:00Z") -> "05:00 PM–06:00 PM"
 */
export function formatLocalLessonTimeRange(
  startAtString: string,
  endAtString: string,
): string {
  const start = new Date(startAtString);
  const end = new Date(endAtString);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return "-";

  return `${new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit" }).format(start)}–${new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit" }).format(end)}`;
}

/**
 * 3. 수업 시작 시간과 종료 시간 사이의 소요 시간(분)을 계산합니다.
 */
export function getLessonDurationMinutes(
  startAt: string,
  endAt: string,
): number {
  const start = new Date(startAt).getTime();
  const end = new Date(endAt).getTime();
  return isNaN(start) || isNaN(end) ? 0 : Math.round((end - start) / 60_000);
}

/**
 * 4. 예약 생성일을 로컬 기준으로 포맷팅합니다.
 * @example "2026-07-16T08:00:00Z" -> "Jul 16, 2026"
 */
export function formatLocalBookedDate(dateString: string): string {
  const date = new Date(dateString);
  return isNaN(date.getTime())
    ? "-"
    : new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);
}

/**
 * 5. 모달 캘린더용 로컬 Date Key를 생성합니다. (YYYY-MM-DD)
 * @example "2026-07-16T08:00:00Z" -> "2026-07-16"
 */
export function createLocalDateKey(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * 6. 모달 캘린더용 로컬 요일을 축약형으로 추출합니다.
 * @example "2026-07-16T08:00:00Z" -> "Thu"
 */
export function formatAvailabilityWeekday(dateString: string): string {
  const date = new Date(dateString);
  return isNaN(date.getTime())
    ? "-"
    : new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);
}

/**
 * 7. 모달 캘린더용 로컬 날짜(일)를 숫자 형태로 추출합니다.
 * @example "2026-07-16T08:00:00Z" -> "16"
 */
export function formatAvailabilityDay(dateString: string): string {
  const date = new Date(dateString);
  return isNaN(date.getTime())
    ? "-"
    : new Intl.DateTimeFormat("en-US", { day: "numeric" }).format(date);
}

/**
 * 8. 모달용 로컬 24시간 표기법 시간 헬퍼
 * @example "2026-07-16T08:00:00Z" -> "17:00"
 */
export function formatAvailabilityTime(dateString: string): string {
  const date = new Date(dateString);
  return isNaN(date.getTime())
    ? "-"
    : new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(date);
}

/**
 * 9. 브라우저의 현재 타임존 및 GMT 오프셋 문자열을 계산합니다.
 * @example "Asia/Seoul (GMT +9:00)"
 */
export function formatBrowserTimeZone(dateValue: string | Date): string {
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return "Local time";
  const timeZone =
    Intl.DateTimeFormat().resolvedOptions().timeZone || "Local time";
  const offsetMinutes = -date.getTimezoneOffset();
  const offsetSign = offsetMinutes >= 0 ? "+" : "-";
  const absoluteOffsetMinutes = Math.abs(offsetMinutes);
  const offsetHours = Math.floor(absoluteOffsetMinutes / 60);
  const offsetRemainingMinutes = String(absoluteOffsetMinutes % 60).padStart(
    2,
    "0",
  );

  return `${timeZone} (GMT ${offsetSign}${offsetHours}:${offsetRemainingMinutes})`;
}

/**
 * 10. 주간 범위 문자열을 구합니다.
 * @example "Jul 13 - Jul 19, 2026"
 */
export function formatWeekRange(
  week: { dateKey: string; startAt: string }[],
): string {
  if (week.length === 0) return "";
  const firstDate = new Date(week[0].startAt);
  const lastDate = new Date(week[week.length - 1].startAt);
  if (isNaN(firstDate.getTime()) || isNaN(lastDate.getTime())) return "";

  const start = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(firstDate);
  const end = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(lastDate);

  return `${start} - ${end}`;
}

/**
 * 시작 시각의 로컬 날짜를 기준으로 availability를 그룹화합니다.
 */
export function groupAvailabilitiesByDate<T extends { startAt: string }>(
  availabilities: T[],
): Map<string, T[]> {
  const groupedAvailabilities = new Map<string, T[]>();

  for (const availability of availabilities) {
    const dateKey = createLocalDateKey(availability.startAt);
    const dateAvailabilities = groupedAvailabilities.get(dateKey) ?? [];

    dateAvailabilities.push(availability);
    groupedAvailabilities.set(dateKey, dateAvailabilities);
  }

  return groupedAvailabilities;
}

/**
 * 시작 시각의 로컬 시간을 기준으로 availability를 필터링합니다.
 */
export function filterAvailabilitiesByHour<T extends { startAt: string }>(
  availabilities: T[],
  startHour: number,
  endHour: number,
): T[] {
  return availabilities.filter(({ startAt }) => {
    const hour = new Date(startAt).getHours();

    return hour >= startHour && hour < endHour;
  });
}

/**
 * 배열을 지정한 크기의 묶음으로 나눕니다.
 */
export function chunkArray<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

export function processTeacherAvailabilities(availabilities: any[]) {
  const availabilitiesByDate = groupAvailabilitiesByDate(availabilities);
  const availableDates = Array.from(availabilitiesByDate.entries()).map(
    ([dateKey, dateAvailabilities]) => ({
      dateKey,
      startAt: dateAvailabilities[0].startAt,
    }),
  );
  const availableWeeks = chunkArray(availableDates, 7);

  return { availabilitiesByDate, availableWeeks };
}
