export const times = Array.from(
  { length: 16 },
  (_, i) => `${String(i + 7).padStart(2, "0")}:00`
);

export const LABEL_WIDTH = "190px";
export const ROW_HEIGHT = "54px";
export const ROW_GAP = "10px";
export const BLOCK_GAP = "4px";
export const TIME_GRID_MIN_WIDTH = "1040px";
