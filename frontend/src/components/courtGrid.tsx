import type { CSSProperties } from "react";
import LocationRow from "./locationRow";
import type { Slot } from "../api/courtsApi";
import styles from "./courtGrid.module.css";
import { VENUE_COL_WIDTH } from "./gridConstants";

type LocationAvailability = {
  id: string;
  name: string;
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
  duration: 1 | 2;
};

function normalizeHour(h: number): { num: string; period: "am" | "pm" } {
  const n = h % 24;
  if (n === 0) return { num: "12", period: "am" };
  if (n < 12)  return { num: String(n), period: "am" };
  if (n === 12) return { num: "12", period: "pm" };
  return { num: String(n - 12), period: "pm" };
}

function formatTimeLabel(time: string): string {
  const h = parseInt(time.split(":")[0], 10);
  const { num, period } = normalizeHour(h);
  return `${num} ${period}`;
}

function formatTimePairLabel(time: string): string {
  const h1 = parseInt(time.split(":")[0], 10);
  const n1 = normalizeHour(h1);
  const n2 = normalizeHour(h1 + 2);
  return n1.period === n2.period
    ? `${n1.num}–${n2.num} ${n1.period}`
    : `${n1.num} ${n1.period}–${n2.num} ${n2.period}`;
}

export default function AvailabilityGrid({ date, times, locations, duration }: Props) {
  const todayStr = new Date().toLocaleDateString("en-CA");
  const isToday = date === todayStr;
  const currentHour = new Date().getHours();
  const currentHourStr = `${String(currentHour).padStart(2, "0")}:00`;
  const currentTimeIndex = isToday ? times.indexOf(currentHourStr) : -1;

  const cssVars = {
    "--venue-col-width": VENUE_COL_WIDTH,
  } as CSSProperties;

  return (
    <div className={styles.tableWrapper} style={cssVars}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.thVenue} scope="col">Venue</th>
            {times.map((time, i) => (
              <th
                key={time}
                scope="col"
                className={`${styles.thTime} ${i === currentTimeIndex ? styles.thTimeCurrent : ""}`}
              >
                {duration === 1 ? formatTimeLabel(time) : formatTimePairLabel(time)}
                {i === currentTimeIndex && (
                  <span className={styles.currentDot} aria-hidden="true" />
                )}
              </th>
            ))}
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
