import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import {
  formatAvailabilityDay,
  formatAvailabilityWeekday,
  formatWeekRange,
} from "@/utils/localDateTime";

interface DateSelectorProps {
  currentWeek: any[];
  currentWeekIndex: number;
  totalWeeks: number;
  activeDateKey: string;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onSelectDate: (dateKey: string) => void;
}

export function DateSelector({
  currentWeek,
  currentWeekIndex,
  totalWeeks,
  activeDateKey,
  onPrevWeek,
  onNextWeek,
  onSelectDate,
}: DateSelectorProps) {
  if (totalWeeks === 0) {
    return (
      <div className="mt-7 rounded-2xl border border-dashed border-border bg-secondary/40 px-4 py-5 text-sm text-muted-foreground">
        This tutor currently has no available lesson times.
      </div>
    );
  }

  return (
    <section className="mt-7">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="size-5 text-primary" />
          <h3 className="text-base font-semibold text-foreground">Date</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrevWeek}
            disabled={currentWeekIndex === 0}
            className="inline-flex size-9 items-center justify-center rounded-xl border border-border bg-background text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={onNextWeek}
            disabled={currentWeekIndex >= totalWeeks - 1}
            className="inline-flex size-9 items-center justify-center rounded-xl border border-border bg-background text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>

      <p className="mb-3 text-sm text-muted-foreground">
        {formatWeekRange(currentWeek)}
      </p>

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
        {currentWeek.map((date) => {
          const isSelected = activeDateKey === date.dateKey;
          return (
            <button
              key={date.dateKey}
              type="button"
              onClick={() => onSelectDate(date.dateKey)}
              aria-pressed={isSelected}
              className={`flex min-w-0 flex-col items-center rounded-xl border px-2 py-3 text-center transition-colors ${
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:border-primary hover:text-primary"
              }`}
            >
              <span
                className={`text-xs font-medium ${isSelected ? "text-primary-foreground" : "text-muted-foreground"}`}
              >
                {formatAvailabilityWeekday(date.startAt)}
              </span>
              <span className="mt-1 text-base font-semibold">
                {formatAvailabilityDay(date.startAt)}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
