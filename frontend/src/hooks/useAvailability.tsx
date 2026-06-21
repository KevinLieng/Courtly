import { useEffect, useState } from "react";
import { getAvailability, type Slot } from "../api/courts";

export type AvailabilityStatus = "idle" | "loading" | "ok" | "invalid-date" | "error";

export function useAvailability(location: number, date: string) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [status, setStatus] = useState<AvailabilityStatus>("idle");

  useEffect(() => {
    if (!location || !date) return;

    let cancelled = false;

    setSlots([]);
    setStatus("loading");

    const timer = setTimeout(async () => {
      try {
        const data = await getAvailability(location, date);

        if (cancelled) return;

        setSlots(data.slots);
        setStatus(data.status);
      } catch (err) {
        console.error("Failed to get availability:", err);

        if (!cancelled) {
          setSlots([]);
          setStatus("error");
        }
      }
    }, 1000);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [location, date]);

  return {
    slots,
    loading: status === "loading",
    invalidDate: status === "invalid-date",
    error: status === "error",
    status,
  };
}