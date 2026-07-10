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
  lat: number;
  lng: number;
  mapsUrl: string;
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
  const todayStr = new Date().toLocaleDateString("en-CA");
  const isToday = date === todayStr;
  const currentHour = new Date().getHours();
  const currentTimeIndex =
    isToday && currentHour >= 7 && currentHour <= 22 ? currentHour - 7 : -1;

  const gridStyle = {
    "--label-width": LABEL_WIDTH,
    "--row-height": ROW_HEIGHT,
    "--row-gap": ROW_GAP,
  } as CSSProperties;

  const timeGridStyle = {
    "--time-grid-min-width": TIME_GRID_MIN_WIDTH,
    "--time-count": times.length,
    "--block-gap": BLOCK_GAP,
    "--current-time-index": currentTimeIndex,
  } as CSSProperties;

  return (
    <>
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={`${styles.legendSwatch} ${styles.swatchCount1}`}>1</span>
          <span>1 court</span>
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendSwatch} ${styles.swatchCount2}`}>2</span>
          <span>2 courts</span>
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendSwatch} ${styles.swatchCount3}`}>3+</span>
          <span>3+ courts</span>
        </div>
        <span className={styles.legendDivider} />
        <span className={styles.legendNote}>click a slot to book</span>
      </div>

      <div className={styles.grid} style={gridStyle}>
        {/* Fixed left location names */}
        <div className={styles.labelColumn}>
          <div className={styles.labelSpacer} />

          {locations.map((location) => (
            <div key={location.id} className={styles.locationLabel}>
              <a
                href={location.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.locationLink}
              >
                {location.name}
              </a>

              {location.distance !== undefined && (
                <div className={styles.distance}>
                  {location.distance.toFixed(1)} km away
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Only this side scrolls */}
        <div className={styles.scrollArea}>
          <div className={styles.timeGrid} style={timeGridStyle}>
            {/* Single overlay rectangle for the current-time column */}
            {currentTimeIndex >= 0 && (
              <div className={styles.currentTimeOverlay} aria-hidden="true" />
            )}

            {/* Time header */}
            <div className={styles.timeHeader}>
              {times.map((time, i) => (
                <div
                  key={time}
                  className={i === currentTimeIndex ? styles.currentTimeHeader : undefined}
                >
                  {time}
                </div>
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
    </>
  );
}
