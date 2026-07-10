import type { Slot } from "../api/courtsApi";

export type SlotWindow = { count: number; bookingUrl: string };

export function nextHour(time: string): string {
  const h = parseInt(time.split(":")[0], 10);
  return `${String(h + 1).padStart(2, "0")}:00`;
}

export function computeAvailability(
  slots: Slot[],
  times: string[],
  duration: 1 | 2
): Record<string, SlotWindow> {
  const courtsByTime = new Map<string, Map<number, string>>();
  for (const slot of slots) {
    if (!slot.available) continue;
    if (!courtsByTime.has(slot.time)) courtsByTime.set(slot.time, new Map());
    courtsByTime.get(slot.time)!.set(slot.court, slot.bookingUrl);
  }

  const result: Record<string, SlotWindow> = {};

  if (duration === 1) {
    for (const time of times) {
      const courts = courtsByTime.get(time);
      if (!courts?.size) continue;
      let count = 0, url = "";
      for (const [, u] of courts) { count++; if (!url) url = u; }
      result[time] = { count, bookingUrl: url };
    }
    return result;
  }

  // 2-hour: intersect courts available at t AND t+1h
  for (const time of times) {
    const c1 = courtsByTime.get(time);
    const c2 = courtsByTime.get(nextHour(time));
    if (!c1 || !c2) continue;
    let count = 0, url = "";
    for (const [court, u] of c1) {
      if (c2.has(court)) { count++; if (!url) url = u; }
    }
    if (count > 0) result[time] = { count, bookingUrl: url };
  }
  return result;
}
