import { Clock3, Moon, Sun, Sunrise, Sunset } from "lucide-react";
import {
  filterAvailabilitiesByHour,
  formatAvailabilityTime,
  formatBrowserTimeZone,
} from "@/utils/localDateTime";

interface TimeSelectorProps {
  availableTimes: any[];
  selectedAvailabilityId: string;
  onSelectTime: (id: string) => void;
}

export function TimeSelector({
  availableTimes,
  selectedAvailabilityId,
  onSelectTime,
}: TimeSelectorProps) {
  const browserTimeZone = formatBrowserTimeZone(
    availableTimes[0]?.startAt ?? new Date(),
  );

  const timeSections = [
    {
      label: "Night",
      Icon: Moon,
      availabilities: filterAvailabilitiesByHour(availableTimes, 0, 6),
    },
    {
      label: "Morning",
      Icon: Sunrise,
      availabilities: filterAvailabilitiesByHour(availableTimes, 6, 12),
    },
    {
      label: "Afternoon",
      Icon: Sun,
      availabilities: filterAvailabilitiesByHour(availableTimes, 12, 18),
    },
    {
      label: "Evening",
      Icon: Sunset,
      availabilities: filterAvailabilitiesByHour(availableTimes, 18, 24),
    },
  ];

  return (
    <section className="mt-7">
      <div className="mb-1 flex items-center gap-2">
        <Clock3 className="size-5 text-primary" />
        <h3 className="text-base font-semibold text-foreground">Time</h3>
      </div>
      <p className="mb-3 text-sm text-muted-foreground">
        In your time zone, {browserTimeZone}
      </p>

      {availableTimes.length > 0 ? (
        <div className="space-y-7">
          {timeSections.map(({ label, Icon, availabilities }) =>
            availabilities.length > 0 ? (
              <section key={label}>
                <div className="mb-3 flex items-center gap-2">
                  <Icon className="size-5 text-foreground" />
                  <h4 className="font-semibold text-foreground">{label}</h4>
                </div>

                <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
                  {availabilities.map((availability) => {
                    const isSelected =
                      selectedAvailabilityId === availability.id;
                    return (
                      <button
                        key={availability.id}
                        type="button"
                        onClick={() => onSelectTime(availability.id)}
                        aria-pressed={isSelected}
                        className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-foreground hover:border-primary hover:text-primary"
                        }`}
                      >
                        {formatAvailabilityTime(availability.startAt)}
                      </button>
                    );
                  })}
                </div>
              </section>
            ) : null,
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-secondary/40 px-4 py-5 text-sm text-muted-foreground">
          No available lesson times on this date.
        </div>
      )}
    </section>
  );
}
