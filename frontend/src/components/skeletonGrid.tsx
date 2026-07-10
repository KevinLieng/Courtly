import type { CSSProperties } from "react";
import {
  LABEL_WIDTH,
  ROW_HEIGHT,
  ROW_GAP,
  BLOCK_GAP,
  TIME_GRID_MIN_WIDTH,
  times,
} from "./gridConstants";
import styles from "./skeletonGrid.module.css";

const SKELETON_ROWS = 5;

export default function SkeletonGrid() {
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
    <div className={styles.grid} style={gridStyle} aria-hidden="true">
      <div className={styles.labelColumn}>
        <div className={styles.labelSpacer} />
        {Array.from({ length: SKELETON_ROWS }, (_, i) => (
          <div key={i} className={`${styles.block} ${styles.labelBlock}`} />
        ))}
      </div>

      <div className={styles.scrollArea}>
        <div className={styles.timeGrid} style={timeGridStyle}>
          <div className={`${styles.block} ${styles.timeHeaderBlock}`} />

          {Array.from({ length: SKELETON_ROWS }, (_, rowIndex) => (
            <div key={rowIndex} className={styles.row}>
              {times.map((time) => (
                <div
                  key={time}
                  className={`${styles.block} ${styles.cell}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
