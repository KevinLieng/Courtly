import { useState } from "react";

const STORAGE_KEY = "courtly-distance-filter";
const DEFAULT_VALUE: DistanceFilterValue = 10;

export type DistanceFilterValue = 5 | 10 | 20 | "any";

function isValidDistanceFilter(value: unknown): value is DistanceFilterValue {
  return value === 5 || value === 10 || value === 20 || value === "any";
}

function readStoredDistanceFilter(): DistanceFilterValue {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return DEFAULT_VALUE;
    const parsed = JSON.parse(raw);
    return isValidDistanceFilter(parsed) ? parsed : DEFAULT_VALUE;
  } catch {
    return DEFAULT_VALUE;
  }
}

export function useDistanceFilter() {
  const [distanceFilter, setDistanceFilterState] = useState<DistanceFilterValue>(readStoredDistanceFilter);

  function setDistanceFilter(value: DistanceFilterValue) {
    setDistanceFilterState(value);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {
      // localStorage unavailable (e.g. private browsing) — state still works in-memory.
    }
  }

  return [distanceFilter, setDistanceFilter] as const;
}
