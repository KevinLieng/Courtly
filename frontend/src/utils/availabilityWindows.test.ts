import { describe, it, expect } from "vitest";
import { computeAvailability } from "./availabilityWindows";
import type { Slot } from "../api/courtsApi";

function slot(court: number, time: string, available = true, bookingUrl = `url-${court}-${time}`): Slot {
  return { court, time, available, bookingUrl };
}

describe("computeAvailability — 1-hour mode", () => {
  it("counts available courts per hour", () => {
    const slots = [
      slot(1, "07:00"),
      slot(2, "07:00"),
      slot(3, "08:00"),
    ];
    const result = computeAvailability(slots, ["07:00", "08:00", "09:00"], 1);
    expect(result["07:00"].count).toBe(2);
    expect(result["08:00"].count).toBe(1);
    expect(result["09:00"]).toBeUndefined();
  });

  it("ignores unavailable slots", () => {
    const slots = [
      slot(1, "07:00", false),
      slot(2, "07:00", true),
    ];
    const result = computeAvailability(slots, ["07:00"], 1);
    expect(result["07:00"].count).toBe(1);
  });

  it("returns first court's bookingUrl", () => {
    const slots = [
      { court: 1, time: "07:00", available: true, bookingUrl: "first-url" },
      { court: 2, time: "07:00", available: true, bookingUrl: "second-url" },
    ];
    const result = computeAvailability(slots, ["07:00"], 1);
    expect(result["07:00"].bookingUrl).toBe("first-url");
  });
});

describe("computeAvailability — 2-hour mode", () => {
  it("counts only courts available at both t and t+1h", () => {
    const slots = [
      slot(1, "07:00"),
      slot(2, "07:00"),
      slot(1, "08:00"),
      // court 2 NOT available at 08:00
    ];
    const result = computeAvailability(slots, ["07:00", "08:00"], 2);
    expect(result["07:00"].count).toBe(1);
    expect(result["07:00"].bookingUrl).toBe("url-1-07:00");
  });

  it("produces no entry for the last time slot when next-hour data is absent", () => {
    const slots = [
      slot(1, "07:00"),
      slot(1, "08:00"),
    ];
    const result = computeAvailability(slots, ["07:00", "08:00"], 2);
    expect(result["07:00"].count).toBe(1);
    expect(result["08:00"]).toBeUndefined();
  });

  it("returns empty object when no courts overlap", () => {
    const slots = [
      slot(1, "07:00"),
      slot(2, "08:00"),
    ];
    const result = computeAvailability(slots, ["07:00", "08:00"], 2);
    expect(Object.keys(result)).toHaveLength(0);
  });

  it("crosses morning/afternoon boundary — 11 am–1 pm window", () => {
    // effectiveTimes for morning + 2hr includes "11:00" because "12:00" is in allTimes
    const slots = [
      slot(1, "11:00"),
      slot(1, "12:00"),
    ];
    const result = computeAvailability(slots, ["11:00"], 2);
    expect(result["11:00"].count).toBe(1);
  });

  it("uses bookingUrl from the first (start) hour", () => {
    const slots = [
      { court: 1, time: "09:00", available: true, bookingUrl: "start-url" },
      { court: 1, time: "10:00", available: true, bookingUrl: "end-url" },
    ];
    const result = computeAvailability(slots, ["09:00", "10:00"], 2);
    expect(result["09:00"].bookingUrl).toBe("start-url");
  });

  it("handles multiple overlapping courts correctly", () => {
    const slots = [
      slot(1, "07:00"), slot(2, "07:00"), slot(3, "07:00"),
      slot(1, "08:00"), slot(3, "08:00"),
      // court 2 missing at 08:00
    ];
    const result = computeAvailability(slots, ["07:00", "08:00"], 2);
    expect(result["07:00"].count).toBe(2); // courts 1 and 3
  });
});
