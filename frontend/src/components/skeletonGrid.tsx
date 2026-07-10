import type { CSSProperties } from "react";
import { times } from "./gridConstants";
import { VENUE_COL_WIDTH, TIME_COL_MIN_WIDTH } from "./gridConstants";
import styles from "./skeletonGrid.module.css";

const SKELETON_ROWS = 5;

export default function SkeletonGrid() {
  const cssVars = {
    "--venue-col-width": VENUE_COL_WIDTH,
    "--time-col-min": TIME_COL_MIN_WIDTH,
    "--time-count": times.length,
  } as CSSProperties;

  return (
    <div className={styles.tableWrapper} style={cssVars} aria-hidden="true">
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.thVenue} />
            {times.map((t) => (
              <th key={t} className={styles.thTime} />
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: SKELETON_ROWS }, (_, i) => (
            <tr key={i} className={styles.row}>
              <td className={styles.tdVenue}>
                <span className={`${styles.shimmer} ${styles.shimmerLabel}`} />
              </td>
              {times.map((t) => (
                <td key={t} className={styles.tdSlot}>
                  <span className={`${styles.shimmer} ${styles.shimmerCell}`} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
