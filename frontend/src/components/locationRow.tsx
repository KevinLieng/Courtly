import type { CSSProperties } from "react";
import type { Slot } from "../api/courtsApi";
import styles from "./locationRow.module.css";

type Props = {
  locationId: string;
  date: string;
  slots: Slot[];
  times: string[];
  rowHeight: string;
  rowGap: string;
  blockGap: string;
};

export default function LocationRow({
  locationId,
  date,
  slots,
  times,
  rowHeight,
  rowGap,
  blockGap,
}: Props) {
  const availabilityByTime = slots.reduce((acc, slot) => {
    if (!slot.available) return acc;

    if (!acc[slot.time]) {
      acc[slot.time] = {
        count: 0,
        bookingUrl: slot.bookingUrl,
      };
    }

    acc[slot.time].count += 1;

    return acc;
  }, {} as Record<string, { count: number; bookingUrl: string }>);

  const handleClick = (time: string) => {
    const availability = availabilityByTime[time];

    if (!availability) return;

    window.open(availability.bookingUrl, "_blank", "noopener,noreferrer");
  };

  const rowStyle = {
    gridTemplateColumns: `repeat(${times.length}, minmax(0, 1fr))`,
    "--row-height": rowHeight,
    "--row-gap": rowGap,
    "--block-gap": blockGap,
  } as CSSProperties;

  return (
    <div
      data-location-id={locationId}
      data-date={date}
      className={styles.row}
      style={rowStyle}
    >
      {times.map((time) => {
        const availability = availabilityByTime[time];
        const count = availability?.count || 0;
        const isAvailable = count > 0;
        const countClass =
          count === 1 ? styles.count1 : count === 2 ? styles.count2 : styles.count3;

        return (
          <div
            key={time}
            title={
              isAvailable
                ? `${time}: ${count} courts available, click to book`
                : `${time}: no courts available`
            }
            onClick={() => {
              if (isAvailable) handleClick(time);
            }}
            className={`${styles.slot} ${
              isAvailable ? `${styles.available} ${countClass}` : styles.unavailable
            }`}
          >
            {isAvailable ? count : ""}
          </div>
        );
      })}
    </div>
  );
}
