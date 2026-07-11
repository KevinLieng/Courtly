// 06:00 → 22:00 in 30-minute steps (33 slots)
export const times = Array.from({ length: 33 }, (_, i) => {
  const total = 6 * 60 + i * 30;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
});

export const VENUE_COL_WIDTH = "160px";
export const TIME_COL_MIN_WIDTH = "60px";
export const ROW_HEIGHT = "56px";
