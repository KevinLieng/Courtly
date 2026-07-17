import type { Provider, Slot } from "../api/courtsApi";
import { computeAvailability, PROVIDER_CAPABILITIES } from "../utils/availabilityWindows";
import { formatDistanceKm } from "../utils/distance";
import { formatFullWindowLabel } from "./courtGrid";
import AvailableSlotLink from "./availableSlotLink";
import type { CourtModalData } from "./courtSelectionModal";
import styles from "./locationRow.module.css";

type LocationData = {
  id: string;
  name: string;
  provider: Provider;
  distance?: number;
  mapsUrl: string;
  timetableUrl?: string;
  slots: Slot[];
};

type Props = {
  location: LocationData;
  times: string[];
  currentTimeIndex: number;
  duration: number;
  onOpenCourtModal: (data: CourtModalData) => void;
};

export default function LocationRow({ location, times, currentTimeIndex, duration, onOpenCourtModal }: Props) {
  const durationMinutes = duration * 60;
  const capabilities = PROVIDER_CAPABILITIES[location.provider];
  const availabilityByTime = computeAvailability(location.slots, times, durationMinutes, capabilities);

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
          <span className={styles.distance}>{formatDistanceKm(location.distance)}</span>
        )}
      </td>

      {times.map((time, i) => {
        const availability = availabilityByTime[time];
        const count = availability?.count ?? 0;
        const isAvailable = count > 0;
        const isCurrent = i === currentTimeIndex;
        const windowLabel = formatFullWindowLabel(time, durationMinutes);

        return (
          <td
            key={time}
            className={`${styles.tdSlot} ${isCurrent ? styles.tdSlotCurrent : ""}`}
          >
            {isAvailable ? (
              <AvailableSlotLink
                href={location.provider === "tennis-venues" ? undefined : availability.bookingUrl}
                onClick={
                  location.provider === "tennis-venues"
                    ? () =>
                        onOpenCourtModal({
                          venueName: location.name,
                          mapsUrl: location.mapsUrl,
                          windowLabel,
                          courts: availability.courts,
                          timetableUrl: location.timetableUrl,
                        })
                    : undefined
                }
                className={`${styles.slotAvail} ${count >= 6 ? styles.slotHigh : count >= 3 ? styles.slotMid : styles.slotLow}`}
                ariaLabel={`${location.name}, ${windowLabel}, ${count} court${count === 1 ? "" : "s"} available`}
                count={count}
                windowLabel={windowLabel}
              />
            ) : (
              <span className={styles.slotEmpty} aria-hidden="true" />
            )}
          </td>
        );
      })}
    </tr>
  );
}
