import type { CSSProperties } from "react";
import LocationRow from "./locationRow";
import type { Slot } from "../api/courtsApi";
import styles from "./courtGrid.module.css";
import {
  times,
  LABEL_WIDTH,
  ROW_HEIGHT,
  ROW_GAP,
  BLOCK_GAP,
  TIME_GRID_MIN_WIDTH,
} from "./gridConstants";

type LocationAvailability = {
  id: string;
  name: string;
  distance?: number;
  slots: Slot[];
};

type AvailabilityGridProps = {
  date: string;
  locations: LocationAvailability[];
};

export default function AvailabilityGrid({
  date,
  locations,
}: AvailabilityGridProps) {
  const gridStyle = {
    "--label-width": LABEL_WIDTH,
    "--row-height": ROW_HEIGHT,
    "--row-gap": ROW_GAP,
  } as CSSProperties;

  const timeGridStyle = {
    "--time-grid-min-width": TIME_GRID_MIN_WIDTH,
    "--time-count": times.length,
    "--block-gap": BLOCK_GAP,
  } as CSSProperties;

  return (
    <div className={styles.grid} style={gridStyle}>
      {/* Fixed left location names */}
      <div className={styles.labelColumn}>
        <div className={styles.labelSpacer} />

        {locations.map((location) => (
          <div key={location.id} className={styles.locationLabel}>
            <span>{location.name}</span>

            {location.distance !== undefined && (
              <div className={styles.distance}>
                ~ {location.distance.toFixed(1)} km
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Only this side scrolls */}
      <div className={styles.scrollArea}>
        <div className={styles.timeGrid} style={timeGridStyle}>
          {/* Time header */}
          <div className={styles.timeHeader}>
            {times.map((time) => (
              <div key={time}>{time}</div>
            ))}
          </div>

          {locations.map((location) => (
            <LocationRow
              key={location.id}
              locationId={location.id}
              date={date}
              slots={location.slots}
              times={times}
              rowHeight={ROW_HEIGHT}
              rowGap={ROW_GAP}
              blockGap={BLOCK_GAP}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
