import { useEffect, useState } from "react";
import {
  getAvailability,
  type LocationAvailability,
} from "../api/courtsApi";

export type UserLocation = {
  lat: number;
  lng: number;
};

export type AvailabilityStatus =
  | "idle"
  | "loading"
  | "ok"
  | "invalid-date"
  | "error";

// A cache hit resolves near-instantly, which reads as a jarring flash
// rather than a "load." A live scrape already takes well over this, so
// it never gets slowed down — this only tops up genuinely fast responses.
const MIN_LOADING_MS = 500;

export function useAvailability(
  date: string,
  userLocation: UserLocation | null = null
) {
  const [locations, setLocations] = useState<LocationAvailability[]>([]);
  const [status, setStatus] = useState<AvailabilityStatus>("idle");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!date) return;

    let cancelled = false;
    const startedAt = performance.now();

    async function padToMinimum() {
      const elapsed = performance.now() - startedAt;
      if (elapsed < MIN_LOADING_MS) {
        await new Promise((resolve) => setTimeout(resolve, MIN_LOADING_MS - elapsed));
      }
    }

    setLocations([]);
    setStatus("loading");

    (async () => {
      try {
        const data = await getAvailability(date, userLocation);
        await padToMinimum();

        if (cancelled) return;

        setLocations(data.locations);

        const hasError = data.locations.some(
          (location) => location.status === "error"
        );

        const hasInvalidDate = data.locations.some(
          (location) => location.status === "invalid-date"
        );

        if (hasInvalidDate) {
          setStatus("invalid-date");
        } else if (hasError) {
          setStatus("error");
        } else {
          setStatus("ok");
        }
      } catch (err) {
        console.error("Failed to get availability:", err);
        await padToMinimum();

        if (!cancelled) {
          setLocations([]);
          setStatus("error");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [date, userLocation, retryCount]);

  return {
    locations,
    loading: status === "loading",
    invalidDate: status === "invalid-date",
    error: status === "error",
    status,
    retry: () => setRetryCount((count) => count + 1),
    // Same underlying re-fetch as retry — the backend decides whether this
    // actually re-scrapes (data >15min old) or just re-serves the cache.
    refresh: () => setRetryCount((count) => count + 1),
  };
}