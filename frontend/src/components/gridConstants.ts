// 06:00 → 22:00 (17 hourly slots)
export const times = Array.from(
  { length: 17 },
  (_, i) => `${String(i + 6).padStart(2, "0")}:00`
);

export const VENUE_COL_WIDTH = "200px";
export const TIME_COL_MIN_WIDTH = "72px";
export const ROW_HEIGHT = "56px";
