"use client";

import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { memo, useMemo, useState } from "react";

import { useAvailabilityGrid } from "@/features/teachers/hooks/useAvailabilityGrid";
import {
  getAvailabilityStatus,
  getDayAvailabilities,
  hasOpenSlotsForDay,
  toISODate,
} from "@/utils/availabilities";
import { cn } from "@/utils/cn";
import { formatAvailabilityTime } from "@/utils/localDateTime";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const outlineButtonClass =
  "inline-flex h-10 items-center justify-center rounded-xl border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:bg-secondary";

const dayToggleButtonClass =
  "inline-flex h-7 w-full items-center justify-center rounded-lg border border-border bg-background px-2 text-[11px] font-semibold text-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:border-border disabled:bg-secondary disabled:text-muted-foreground disabled:hover:border-border disabled:hover:text-muted-foreground";

const weekNavButtonClass =
  "flex size-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:cursor-not-allowed disabled:text-muted-foreground/40 disabled:hover:bg-transparent disabled:hover:text-muted-foreground/40";

export function DashboardAvailabilityGrid() {
  const {
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
    isPending,
  } = useAvailabilityGrid();

  if (isPending) {
    return (
      <div
        className="h-96 animate-pulse rounded-2xl bg-secondary/50"
        aria-label="Loading schedule"
      />
    );
  }

  if (availabilities.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-secondary/40 px-5 py-8 text-center">
        <p className="text-base font-semibold text-foreground">
          No availability slots yet
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Slots are generated automatically. Check back soon to manage your
          schedule.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* ── Week navigation (prev / next / Today) ── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 rounded-2xl border border-border bg-background px-1 py-1">
          <button
            type="button"
            disabled={!canGoPrevWeek}
            onClick={() => {
              if (!canGoPrevWeek) return;
              goToPrevWeek();
            }}
            aria-label="Previous week"
            className={weekNavButtonClass}
          >
            <ChevronLeft className="size-4" />
          </button>
          <span
            className={cn(
              "min-w-[220px] text-center text-sm font-semibold tabular-nums",
              timeSlots.length > 0
                ? "text-foreground"
                : "text-muted-foreground",
            )}
          >
            {weekRangeLabel}
          </span>
          <button
            type="button"
            disabled={!canGoNextWeek}
            onClick={() => {
              if (!canGoNextWeek) return;
              goToNextWeek();
            }}
            aria-label="Next week"
            className={weekNavButtonClass}
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={goToToday}
          className={outlineButtonClass}
        >
          Today
        </button>

        <p className="text-sm text-muted-foreground">
          Click slots to edit your schedule, then save your changes.
        </p>
      </div>

      {/* ── Slot status legend (Available / Off / Reserved) ── */}
      <div className="flex flex-wrap items-center gap-4 text-xs">
        <span className="flex items-center gap-2">
          <span className="size-3 rounded-sm border border-primary bg-primary" />
          <span className="text-muted-foreground">Available</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="size-3 rounded-sm border border-border bg-background" />
          <span className="text-muted-foreground">Off</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="size-3 rounded-sm border border-border bg-secondary" />
          <span className="text-muted-foreground">Reserved</span>
        </span>
      </div>

      {/* ── Availability grid (desktop grid / mobile timeline) ── */}
      {timeSlots.length > 0 ? (
        <>
          <div className="hidden md:block">
            <DesktopGrid
              weekDates={weekDates}
              availabilityMap={availabilityMap}
              timeSlots={timeSlots}
              onToggle={handleToggle}
              onToggleDay={handleToggleDay}
            />
          </div>
          <div className="md:hidden">
            <MobileTimeline
              weekDates={weekDates}
              availabilityMap={availabilityMap}
              onToggle={handleToggle}
              onToggleDay={handleToggleDay}
            />
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-secondary/40 px-4 py-5 text-sm text-muted-foreground">
          No slots in this week. Try another week or jump back to today.
        </div>
      )}

      {/* ── Save bar (change summary + Reset / Save) ── */}
      <SaveBar
        isDirty={isDirty}
        changeCount={changes.length}
        isError={isSaveError}
        isPending={isSavePending}
        onReset={handleReset}
        onSave={handleSave}
      />
    </div>
  );
}

function SaveBar({
  isDirty,
  changeCount,
  isError,
  isPending,
  onReset,
  onSave,
}: {
  isDirty: boolean;
  changeCount: number;
  isError: boolean;
  isPending: boolean;
  onReset: () => void;
  onSave: () => void;
}) {
  return (
    <div className="sticky bottom-0 z-10 flex flex-col gap-3 rounded-2xl border border-border bg-background/95 px-4 py-4 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm text-muted-foreground">
          {isDirty
            ? `${changeCount} unsaved change${changeCount === 1 ? "" : "s"}.`
            : "All changes are saved."}
        </p>
        {isError && (
          <p className="mt-1 text-sm text-red-600">
            Failed to save changes. Please try again.
          </p>
        )}
      </div>

      <div className="flex gap-3">
        {isDirty && (
          <button
            type="button"
            onClick={onReset}
            disabled={isPending}
            className={outlineButtonClass}
          >
            Reset
          </button>
        )}
        <button
          type="button"
          onClick={onSave}
          disabled={!isDirty || isPending}
          className="inline-flex h-10 min-w-[120px] items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>
  );
}

const SlotButton = memo(
  function SlotButton({
    availability,
    onToggle,
  }: {
    availability: MyAvailability;
    onToggle: (id: string) => void;
  }) {
    const status = getAvailabilityStatus(availability);
    const isReserved = status === "reserved";
    const isOn = status === "on";
    const timeLabel = formatAvailabilityTime(availability.startAt);

    return (
      <button
        type="button"
        disabled={isReserved}
        onClick={() => {
          if (!isReserved) onToggle(availability.id);
        }}
        aria-label={`${timeLabel} — ${status}`}
        className={cn(
          "flex h-8 w-full items-center justify-center gap-1 rounded-xl border text-xs font-semibold transition-colors",
          isReserved &&
            "cursor-not-allowed border-border bg-secondary text-muted-foreground",
          isOn &&
            "cursor-pointer border-primary bg-primary text-primary-foreground hover:bg-primary-dark",
          !isOn &&
            !isReserved &&
            "cursor-pointer border-border bg-background text-foreground hover:border-primary hover:text-primary",
        )}
      >
        {isReserved && <Lock className="size-3 shrink-0" />}
        <span className="tabular-nums">{timeLabel}</span>
      </button>
    );
  },
  (prev, next) => {
    return (
      prev.availability.id === next.availability.id &&
      prev.availability.isOpen === next.availability.isOpen &&
      prev.onToggle === next.onToggle
    );
  },
);

const DayToggleButton = memo(function DayToggleButton({
  dateKey,
  availabilityMap,
  onToggleDay,
  className,
}: {
  dateKey: string;
  availabilityMap: Map<string, MyAvailability>;
  onToggleDay: (dateKey: string, isOpen: boolean) => void;
  className?: string;
}) {
  const daySlots = getDayAvailabilities(availabilityMap, dateKey);
  const hasSlots = daySlots.length > 0;
  const hasOpenSlots = hasOpenSlotsForDay(availabilityMap, dateKey);
  const label = hasOpenSlots ? "All Off" : "All On";

  return (
    <button
      type="button"
      disabled={!hasSlots}
      onClick={() => {
        if (!hasSlots) return;
        onToggleDay(dateKey, !hasOpenSlots);
      }}
      aria-label={label}
      className={cn(dayToggleButtonClass, className)}
    >
      {label}
    </button>
  );
});

function DesktopGrid({
  weekDates,
  availabilityMap,
  timeSlots,
  onToggle,
  onToggleDay,
}: {
  weekDates: Date[];
  availabilityMap: Map<string, MyAvailability>;
  timeSlots: string[];
  onToggle: (id: string) => void;
  onToggleDay: (dateKey: string, isOpen: boolean) => void;
}) {
  const todayKey = toISODate(new Date());

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[760px]">
        <div className="mb-2 grid grid-cols-[56px_repeat(7,1fr)] gap-2">
          <div />
          {weekDates.map((date, index) => {
            const dateKey = toISODate(date);
            const isToday = dateKey === todayKey;

            return (
              <div
                key={dateKey}
                className="flex flex-col items-center gap-1.5 pb-1"
              >
                <span
                  className={cn(
                    "text-xs font-semibold uppercase tracking-wide",
                    isToday ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {DAY_LABELS[index]}
                </span>
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full text-sm font-semibold",
                    isToday
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground",
                  )}
                >
                  {date.getDate()}
                </span>
                <DayToggleButton
                  dateKey={dateKey}
                  availabilityMap={availabilityMap}
                  onToggleDay={onToggleDay}
                />
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-2">
          {timeSlots.map((time) => (
            <div
              key={time}
              className="grid grid-cols-[56px_repeat(7,1fr)] items-center gap-2"
            >
              <span className="pr-2 text-right text-[11px] tabular-nums text-muted-foreground">
                {time}
              </span>
              {weekDates.map((date) => {
                const dateKey = toISODate(date);
                const availability = availabilityMap.get(`${dateKey}_${time}`);

                if (!availability) {
                  return (
                    <div
                      key={dateKey}
                      className="h-8 rounded-xl border border-dashed border-border bg-secondary/30"
                    />
                  );
                }

                return (
                  <SlotButton
                    key={availability.id}
                    availability={availability}
                    onToggle={onToggle}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileTimeline({
  weekDates,
  availabilityMap,
  onToggle,
  onToggleDay,
}: {
  weekDates: Date[];
  availabilityMap: Map<string, MyAvailability>;
  onToggle: (id: string) => void;
  onToggleDay: (dateKey: string, isOpen: boolean) => void;
}) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const selectedDate = weekDates[selectedIdx];
  const selectedDateKey = toISODate(selectedDate);
  const todayKey = toISODate(new Date());

  const dayAvailabilities = useMemo(
    () =>
      getDayAvailabilities(availabilityMap, selectedDateKey).sort(
        (a, b) =>
          new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
      ),
    [availabilityMap, selectedDateKey],
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {weekDates.map((date, index) => {
          const dateKey = toISODate(date);
          const isToday = dateKey === todayKey;
          const isSelected = index === selectedIdx;

          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => setSelectedIdx(index)}
              className={cn(
                "flex shrink-0 flex-col items-center rounded-2xl border px-3 py-2 text-xs font-semibold transition-colors",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : isToday
                    ? "border-primary/40 bg-secondary text-primary"
                    : "border-border bg-background text-foreground hover:bg-secondary",
              )}
            >
              <span className="uppercase tracking-wide">{DAY_LABELS[index]}</span>
              <span className="text-base font-semibold">{date.getDate()}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-foreground">
          {selectedDate.toLocaleDateString("en", {
            weekday: "long",
            month: "short",
            day: "numeric",
          })}
        </p>
        <DayToggleButton
          dateKey={selectedDateKey}
          availabilityMap={availabilityMap}
          onToggleDay={onToggleDay}
          className={cn(
            outlineButtonClass,
            "disabled:cursor-not-allowed disabled:bg-secondary disabled:text-muted-foreground disabled:hover:bg-secondary",
          )}
        />
      </div>

      {dayAvailabilities.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {dayAvailabilities.map((availability) => (
            <SlotButton
              key={availability.id}
              availability={availability}
              onToggle={onToggle}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-secondary/40 px-4 py-5 text-sm text-muted-foreground">
          No availability slots on this date.
        </div>
      )}
    </div>
  );
}
