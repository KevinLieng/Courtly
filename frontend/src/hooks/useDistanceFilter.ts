import { useState } from "react";

const DEFAULT_VALUE: DistanceFilterValue = 10;

export type DistanceFilterValue = 5 | 10 | 20 | "any";

// Always starts at 10km on a fresh page load/refresh — not persisted
// across sessions, unlike the user's location.
export function useDistanceFilter() {
  return useState<DistanceFilterValue>(DEFAULT_VALUE);
}
