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

    setLocations([]);
    setStatus("loading");

    const timer = setTimeout(async () => {
      try {
        const data = await getAvailability(date, userLocation);

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

        if (!cancelled) {
          setLocations([]);
          setStatus("error");
        }
      }
    }, 1000);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [date, userLocation, retryCount]);

  return {
    locations,
    loading: status === "loading",
    invalidDate: status === "invalid-date",
    error: status === "error",
    status,
    retry: () => setRetryCount((count) => count + 1),
  };
}