import type { CSSProperties } from "react";

function formatTimeLabel(time: string): string {
  const [h] = time.split(":");
  const hour = parseInt(h, 10);
  if (hour < 12) return `${hour} am`;
  if (hour === 12) return "12 pm";
  return `${hour - 12} pm`;
}
import LocationRow from "./locationRow";
import type { Slot } from "../api/courtsApi";
import styles from "./courtGrid.module.css";
import { VENUE_COL_WIDTH, TIME_COL_MIN_WIDTH } from "./gridConstants";

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
};

export default function AvailabilityGrid({ date, times, locations }: Props) {
  const todayStr = new Date().toLocaleDateString("en-CA");
  const isToday = date === todayStr;
  const currentHour = new Date().getHours();
  const currentHourStr = `${String(currentHour).padStart(2, "0")}:00`;
  const currentTimeIndex = isToday ? times.indexOf(currentHourStr) : -1;

  const cssVars = {
    "--venue-col-width": VENUE_COL_WIDTH,
    "--time-col-min": TIME_COL_MIN_WIDTH,
    "--time-count": times.length,
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
                {formatTimeLabel(time)}
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
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
