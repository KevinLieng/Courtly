import type { Slot } from "../api/courtsApi";
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
};

function formatTime(time: string): string {
  const [h] = time.split(":");
  const hour = parseInt(h, 10);
  if (hour === 0) return "12:00 am";
  if (hour < 12) return `${hour}:00 am`;
  if (hour === 12) return "12:00 pm";
  return `${hour - 12}:00 pm`;
}

export default function LocationRow({ location, times, currentTimeIndex }: Props) {
  const availabilityByTime = location.slots.reduce(
    (acc, slot) => {
      if (!slot.available) return acc;
      if (!acc[slot.time]) {
        acc[slot.time] = { count: 0, bookingUrl: slot.bookingUrl };
      }
      acc[slot.time].count += 1;
      return acc;
    },
    {} as Record<string, { count: number; bookingUrl: string }>
  );

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
                aria-label={`${location.name}, ${formatTime(time)}, ${count} court${count === 1 ? "" : "s"} available`}
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
