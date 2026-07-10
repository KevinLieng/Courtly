import type { Slot } from "../api/courtsApi";
import { computeAvailability } from "../utils/availabilityWindows";
import styles from "./locationRow.module.css";

type LocationData = {
  id: string;
  name: string;
  distance?: number;
  mapsUrl: string;
  slots: Slot[];
};

type Props = {
  location: LocationData;
  times: string[];
  currentTimeIndex: number;
  duration: 1 | 2;
};

function formatTime(time: string): string {
  const [h] = time.split(":");
  const hour = parseInt(h, 10);
  if (hour === 0) return "12:00 am";
  if (hour < 12) return `${hour}:00 am`;
  if (hour === 12) return "12:00 pm";
  return `${hour - 12}:00 pm`;
}

export default function LocationRow({ location, times, currentTimeIndex, duration }: Props) {
  const availabilityByTime = computeAvailability(location.slots, times, duration);

  return (
    <tr className={styles.row}>
      <td className={styles.tdVenue}>
        <a
          href={location.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.venueLink}
        >
          {location.name}
        </a>
        {location.distance !== undefined && (
          <span className={styles.distance}>{location.distance.toFixed(1)} km</span>
        )}
      </td>

      {times.map((time, i) => {
        const availability = availabilityByTime[time];
        const count = availability?.count ?? 0;
        const isAvailable = count > 0;
        const isCurrent = i === currentTimeIndex;
        const slotLabel = duration === 2
          ? `2-hour window starting ${formatTime(time)}`
          : formatTime(time);

        return (
          <td
            key={time}
            className={`${styles.tdSlot} ${isCurrent ? styles.tdSlotCurrent : ""}`}
          >
            {isAvailable ? (
              <a
                href={availability.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.slotAvail} ${count >= 6 ? styles.slotHigh : count >= 3 ? styles.slotMid : styles.slotLow}`}
                aria-label={`${location.name}, ${slotLabel}, ${count} court${count === 1 ? "" : "s"} available`}
              >
                {count}
              </a>
            ) : (
              <span className={styles.slotEmpty} aria-hidden="true" />
            )}
          </td>
        );
      })}
    </tr>
  );
}
