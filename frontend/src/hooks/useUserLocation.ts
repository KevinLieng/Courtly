import { useState } from "react";

const STORAGE_KEY = "courtly-user-location";

export type UserLocation = { lat: number; lng: number };

function readStoredLocation(): UserLocation | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed.lat === "number" &&
      typeof parsed.lng === "number" &&
      !Number.isNaN(parsed.lat) &&
      !Number.isNaN(parsed.lng)
    ) {
      return { lat: parsed.lat, lng: parsed.lng };
    }
    return null;
  } catch {
    return null;
  }
}

export function useUserLocation() {
  const [userLocation, setUserLocationState] = useState<UserLocation | null>(readStoredLocation);

  function setUserLocation(location: UserLocation | null) {
    setUserLocationState(location);
    try {
      if (location) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // localStorage unavailable (e.g. private browsing) — state still works in-memory.
    }
  }

  return [userLocation, setUserLocation] as const;
}
