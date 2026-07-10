export const times = Array.from(
  { length: 16 },
  (_, i) => `${String(i + 7).padStart(2, "0")}:00`
);

export const VENUE_COL_WIDTH = "200px";
export const TIME_COL_MIN_WIDTH = "72px";
export const ROW_HEIGHT = "56px";
