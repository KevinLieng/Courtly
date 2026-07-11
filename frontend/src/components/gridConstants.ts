// 06:00 → 22:00 in 30-minute steps (33 slots)
export const times = Array.from({ length: 33 }, (_, i) => {
  const total = 6 * 60 + i * 30;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
});

export const VENUE_COL_WIDTH = "160px";
export const TIME_COL_MIN_WIDTH = "60px";
export const ROW_HEIGHT = "56px";

// Latest real available slot time observed across all venues (checked
// live, 2026-07). Long-duration start columns whose required window
// extends past this can never show a result for any venue. Bump this if
// a venue with later real hours is added.
export const LATEST_POSSIBLE_SLOT_TIME = "22:30";
