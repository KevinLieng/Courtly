import type { Provider, Slot } from "../api/courtsApi";

export type SlotWindow = { count: number; bookingUrl: string };

export type ProviderCapabilities = {
  baseSlotMinutes: 30 | 60;
  allowedStartIntervalMinutes: 30 | 60;
};

export const PROVIDER_CAPABILITIES: Record<Provider, ProviderCapabilities> = {
  "city-community": { baseSlotMinutes: 60, allowedStartIntervalMinutes: 60 },
  "parklands": { baseSlotMinutes: 30, allowedStartIntervalMinutes: 30 },
  "tennis-venues": { baseSlotMinutes: 30, allowedStartIntervalMinutes: 30 },
};

export function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const hh = Math.floor(total / 60);
  const mm = total % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

// Rounds down to the current half-hour grid line, e.g. 2:10pm -> "14:00",
// 2:35pm -> "14:30". Used to hide past start times for today's date.
export function floorToHalfHour(date: Date): string {
  const minuteBucket = date.getMinutes() < 30 ? "00" : "30";
  return `${String(date.getHours()).padStart(2, "0")}:${minuteBucket}`;
}

export function getAvailableCourtsForWindow(
  courtsByTime: Map<string, Map<number, string>>,
  startTime: string,
  durationMinutes: number,
  baseSlotMinutes: 30 | 60
): Map<number, string> {
  if (durationMinutes % baseSlotMinutes !== 0) return new Map();

  const checkpoints = durationMinutes / baseSlotMinutes;
  let result: Map<number, string> | undefined;

  for (let i = 0; i < checkpoints; i++) {
    const courts = courtsByTime.get(addMinutes(startTime, i * baseSlotMinutes));
    if (!courts?.size) return new Map();

    if (!result) {
      result = new Map(courts);
    } else {
      for (const court of result.keys()) {
        if (!courts.has(court)) result.delete(court);
      }
      if (result.size === 0) return new Map();
    }
  }

  return result ?? new Map();
}

export function computeAvailability(
  slots: Slot[],
  times: string[],
  durationMinutes: number,
  capabilities: ProviderCapabilities
): Record<string, SlotWindow> {
  const courtsByTime = new Map<string, Map<number, string>>();
  for (const slot of slots) {
    if (!slot.available) continue;
    if (!courtsByTime.has(slot.time)) courtsByTime.set(slot.time, new Map());
    courtsByTime.get(slot.time)!.set(slot.court, slot.bookingUrl);
  }

  const result: Record<string, SlotWindow> = {};

  for (const time of times) {
    const minuteOfHour = parseInt(time.split(":")[1], 10);
    if (minuteOfHour % capabilities.allowedStartIntervalMinutes !== 0) continue;

    const courts = getAvailableCourtsForWindow(
      courtsByTime,
      time,
      durationMinutes,
      capabilities.baseSlotMinutes
    );
    if (!courts.size) continue;

    let url = "";
    for (const u of courts.values()) { url = u; break; }
    result[time] = { count: courts.size, bookingUrl: url };
  }

  return result;
}
