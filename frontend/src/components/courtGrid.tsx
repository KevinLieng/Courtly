import type { CSSProperties } from "react";
import LocationRow from "./locationRow";
import type { Provider, Slot } from "../api/courtsApi";
import { addMinutes, floorToHalfHour } from "../utils/availabilityWindows";
import styles from "./courtGrid.module.css";
import { VENUE_COL_WIDTH, TIME_COL_MIN_WIDTH } from "./gridConstants";

type LocationAvailability = {
  id: string;
  name: string;
  provider: Provider;
  distance?: number;
  lat: number;
  lng: number;
  mapsUrl: string;
  slots: Slot[];
};

type Props = {
  date: string;
  times: string[];
  locations: LocationAvailability[];
  duration: number;
  // "All day" shows plain start-time labels (6 am, 6:30, 7, ...); the
  // morning/afternoon/evening filters show the full booking-window range.
  showRangeLabels: boolean;
};

type Period = "am" | "pm";

function normalizeHour(h: number): { num: string; period: Period } {
  const n = h % 24;
  if (n === 0) return { num: "12", period: "am" };
  if (n < 12) return { num: String(n), period: "am" };
  if (n === 12) return { num: "12", period: "pm" };
  return { num: String(n - 12), period: "pm" };
}

function formatClock(time: string): { label: string; period: Period } {
  const [h, m] = time.split(":");
  const { num, period } = normalizeHour(parseInt(h, 10));
  return { label: m === "00" ? num : `${num}:${m}`, period };
}

export type WindowLabelParts = {
  startLabel: string;
  endLabel: string;
  startPeriod: Period;
  endPeriod: Period;
};

export function getWindowLabelParts(startTime: string, durationMinutes: number): WindowLabelParts {
  const start = formatClock(startTime);
  const end = formatClock(addMinutes(startTime, durationMinutes));
  return { startLabel: start.label, endLabel: end.label, startPeriod: start.period, endPeriod: end.period };
}

// Always fully-qualified with am/pm — used for aria-labels where the
// column's neighboring context isn't available/relevant.
export function formatFullWindowLabel(startTime: string, durationMinutes: number): string {
  const { startLabel, endLabel, startPeriod, endPeriod } = getWindowLabelParts(startTime, durationMinutes);
  return startPeriod === endPeriod
    ? `${startLabel}–${endLabel} ${startPeriod}`
    : `${startLabel} ${startPeriod}–${endLabel} ${endPeriod}`;
}

export default function AvailabilityGrid({ date, times, locations, duration, showRangeLabels }: Props) {
  const todayStr = new Date().toLocaleDateString("en-CA");
  const isToday = date === todayStr;
  const currentTimeIndex = isToday ? times.indexOf(floorToHalfHour(new Date())) : -1;

  const cssVars = {
    "--venue-col-width": VENUE_COL_WIDTH,
    "--time-col-min": TIME_COL_MIN_WIDTH,
    "--time-count": times.length,
  } as CSSProperties;

  const durationMinutes = duration * 60;
  let lastPeriod: Period | null = null;

  return (
    <div className={styles.tableWrapper} style={cssVars}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.thVenue} scope="col">Venue</th>
            {times.map((time, i) => {
              let label: string;

              if (showRangeLabels) {
                const parts = getWindowLabelParts(time, durationMinutes);
                const crossesNoon = parts.startPeriod !== parts.endPeriod;
                const showPeriod = i === 0 || crossesNoon || parts.startPeriod !== lastPeriod;
                lastPeriod = parts.endPeriod;

                label = !showPeriod
                  ? `${parts.startLabel}–${parts.endLabel}`
                  : crossesNoon
                    ? `${parts.startLabel} ${parts.startPeriod}–${parts.endLabel} ${parts.endPeriod}`
                    : `${parts.startLabel}–${parts.endLabel} ${parts.startPeriod}`;
              } else {
                const clock = formatClock(time);
                const showPeriod = i === 0 || clock.period !== lastPeriod;
                lastPeriod = clock.period;
                label = showPeriod ? `${clock.label} ${clock.period}` : clock.label;
              }

              const isOnHour = time.endsWith(":00");

              return (
                <th
                  key={time}
                  scope="col"
                  className={[
                    styles.thTime,
                    isOnHour ? styles.thTimeOnHour : "",
                    i === currentTimeIndex ? styles.thTimeCurrent : "",
                  ].join(" ")}
                >
                  {label}
                  {i === currentTimeIndex && (
                    <span className={styles.currentDot} aria-hidden="true" />
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {locations.map((location) => (
            <LocationRow
              key={location.id}
              location={location}
              times={times}
              currentTimeIndex={currentTimeIndex}
              duration={duration}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
