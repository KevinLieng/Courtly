import { describe, it, expect } from "vitest";
import {
  computeAvailability,
  getAvailableCourtsForWindow,
  addMinutes,
  floorToHalfHour,
  toMinutes,
  PROVIDER_CAPABILITIES,
} from "./availabilityWindows";
import type { Slot } from "../api/courtsApi";

function slot(court: number, time: string, available = true, bookingUrl = `url-${court}-${time}`): Slot {
  return { court, time, available, bookingUrl };
}

function toCourtsByTime(slots: Slot[]): Map<string, Map<number, string>> {
  const map = new Map<string, Map<number, string>>();
  for (const s of slots) {
    if (!s.available) continue;
    if (!map.has(s.time)) map.set(s.time, new Map());
    map.get(s.time)!.set(s.court, s.bookingUrl);
  }
  return map;
}

describe("toMinutes", () => {
  it("converts a time string to minutes since midnight", () => {
    expect(toMinutes("00:00")).toBe(0);
    expect(toMinutes("09:30")).toBe(570);
    expect(toMinutes("22:30")).toBe(1350);
  });
});

describe("addMinutes", () => {
  it("adds minutes within the hour", () => {
    expect(addMinutes("07:00", 30)).toBe("07:30");
  });

  it("rolls over into the next hour", () => {
    expect(addMinutes("07:30", 30)).toBe("08:00");
  });
});

describe("floorToHalfHour", () => {
  it("rounds down to the top of the hour just after it passes", () => {
    expect(floorToHalfHour(new Date(2026, 0, 1, 14, 0))).toBe("14:00");
  });

  it("rounds down to :00 for minutes before the half hour", () => {
    expect(floorToHalfHour(new Date(2026, 0, 1, 14, 10))).toBe("14:00");
  });

  it("rounds down to :30 for minutes at or after the half hour", () => {
    expect(floorToHalfHour(new Date(2026, 0, 1, 14, 35))).toBe("14:30");
  });
});

describe("getAvailableCourtsForWindow — half-hour provider (baseSlotMinutes=30)", () => {
  const caps = PROVIDER_CAPABILITIES["parklands"];

  it("1 hour requires 2 consecutive 30-min checkpoints", () => {
    const courtsByTime = toCourtsByTime([slot(1, "07:00"), slot(1, "07:30")]);
    const result = getAvailableCourtsForWindow(courtsByTime, "07:00", 60, caps.baseSlotMinutes);
    expect([...result.keys()]).toEqual([1]);
  });

  it("1 hour fails if the second checkpoint is missing", () => {
    const courtsByTime = toCourtsByTime([slot(1, "07:00")]);
    const result = getAvailableCourtsForWindow(courtsByTime, "07:00", 60, caps.baseSlotMinutes);
    expect(result.size).toBe(0);
  });

  it("1.5 hours requires 3 consecutive 30-min checkpoints", () => {
    const courtsByTime = toCourtsByTime([slot(1, "07:00"), slot(1, "07:30"), slot(1, "08:00")]);
    const result = getAvailableCourtsForWindow(courtsByTime, "07:00", 90, caps.baseSlotMinutes);
    expect([...result.keys()]).toEqual([1]);
  });

  it("1.5 hours fails if the middle checkpoint is missing", () => {
    const courtsByTime = toCourtsByTime([slot(1, "07:00"), slot(1, "08:00")]);
    const result = getAvailableCourtsForWindow(courtsByTime, "07:00", 90, caps.baseSlotMinutes);
    expect(result.size).toBe(0);
  });

  it("2 hours requires 4 consecutive 30-min checkpoints", () => {
    const courtsByTime = toCourtsByTime([
      slot(1, "07:00"), slot(1, "07:30"), slot(1, "08:00"), slot(1, "08:30"),
    ]);
    const result = getAvailableCourtsForWindow(courtsByTime, "07:00", 120, caps.baseSlotMinutes);
    expect([...result.keys()]).toEqual([1]);
  });

  it("2 hours fails if only start and start+60 are present (old looser check)", () => {
    const courtsByTime = toCourtsByTime([slot(1, "07:00"), slot(1, "08:00")]);
    const result = getAvailableCourtsForWindow(courtsByTime, "07:00", 120, caps.baseSlotMinutes);
    expect(result.size).toBe(0);
  });

  it("never combines different courts across checkpoints", () => {
    const courtsByTime = toCourtsByTime([slot(1, "07:00"), slot(2, "07:30")]);
    const result = getAvailableCourtsForWindow(courtsByTime, "07:00", 60, caps.baseSlotMinutes);
    expect(result.size).toBe(0);
  });

  it("intersects by exact court id across multiple courts", () => {
    const courtsByTime = toCourtsByTime([
      slot(1, "07:00"), slot(2, "07:00"), slot(3, "07:00"),
      slot(1, "07:30"), slot(3, "07:30"),
      // court 2 missing at 07:30
    ]);
    const result = getAvailableCourtsForWindow(courtsByTime, "07:00", 60, caps.baseSlotMinutes);
    expect(new Set(result.keys())).toEqual(new Set([1, 3]));
  });
});

describe("getAvailableCourtsForWindow — hourly provider (baseSlotMinutes=60)", () => {
  const caps = PROVIDER_CAPABILITIES["city-community"];

  it("1 hour resolves from a single 60-min checkpoint", () => {
    const courtsByTime = toCourtsByTime([slot(1, "07:00")]);
    const result = getAvailableCourtsForWindow(courtsByTime, "07:00", 60, caps.baseSlotMinutes);
    expect([...result.keys()]).toEqual([1]);
  });

  it("2 hours resolves from two 60-min checkpoints", () => {
    const courtsByTime = toCourtsByTime([slot(1, "07:00"), slot(1, "08:00")]);
    const result = getAvailableCourtsForWindow(courtsByTime, "07:00", 120, caps.baseSlotMinutes);
    expect([...result.keys()]).toEqual([1]);
  });

  it("2 hours fails if the second hour is missing", () => {
    const courtsByTime = toCourtsByTime([slot(1, "07:00")]);
    const result = getAvailableCourtsForWindow(courtsByTime, "07:00", 120, caps.baseSlotMinutes);
    expect(result.size).toBe(0);
  });

  it("1.5 hours is always empty — 90 is not a multiple of 60", () => {
    const courtsByTime = toCourtsByTime([slot(1, "07:00"), slot(1, "08:00")]);
    const result = getAvailableCourtsForWindow(courtsByTime, "07:00", 90, caps.baseSlotMinutes);
    expect(result.size).toBe(0);
  });
});

describe("computeAvailability — half-hour provider", () => {
  const caps = PROVIDER_CAPABILITIES["parklands"];

  it("populates a 30-min start column only when its own 2 checkpoints exist", () => {
    // 08:30 is deliberately missing: the 07:00 window (needs 07:00+07:30)
    // is fine, but the 07:30 window (needs 07:30+08:00) and 08:00 window
    // (needs 08:00+08:30) are not — each column has its own requirement.
    const slots = [slot(1, "07:00"), slot(1, "07:30"), slot(1, "08:00")];
    const result = computeAvailability(slots, ["07:00", "07:30", "08:00"], 60, caps);
    expect(result["07:00"].count).toBe(1);
    expect(result["07:30"].count).toBe(1);
    expect(result["08:00"]).toBeUndefined(); // needs 08:00 AND 08:30
  });

  it("1.5-hour windows populate real Parklands data", () => {
    const slots = [slot(1, "07:00"), slot(1, "07:30"), slot(1, "08:00"), slot(2, "08:30")];
    const result = computeAvailability(slots, ["07:00"], 90, caps);
    expect(result["07:00"].count).toBe(1);
  });

  it("does not combine different courts into a false positive", () => {
    const slots = [slot(1, "07:00"), slot(2, "07:30")];
    const result = computeAvailability(slots, ["07:00"], 60, caps);
    expect(result["07:00"]).toBeUndefined();
  });
});

describe("computeAvailability — hourly-only provider (City Community)", () => {
  const caps = PROVIDER_CAPABILITIES["city-community"];

  it("populates on-the-hour columns for 1-hour duration", () => {
    const slots = [slot(1, "07:00"), slot(2, "07:00")];
    const result = computeAvailability(slots, ["07:00", "07:30", "08:00"], 60, caps);
    expect(result["07:00"].count).toBe(2);
    expect(result["07:30"]).toBeUndefined();
    expect(result["08:00"]).toBeUndefined();
  });

  it("populates on-the-hour columns for 2-hour duration", () => {
    const slots = [slot(1, "07:00"), slot(1, "08:00")];
    const result = computeAvailability(slots, ["07:00", "07:30", "08:00"], 120, caps);
    expect(result["07:00"].count).toBe(1);
    expect(result["07:30"]).toBeUndefined();
  });

  it("produces no entries at all for 1.5-hour duration", () => {
    const slots = [slot(1, "07:00"), slot(1, "08:00"), slot(1, "09:00")];
    const result = computeAvailability(slots, ["07:00", "07:30", "08:00", "08:30", "09:00"], 90, caps);
    expect(Object.keys(result)).toHaveLength(0);
  });

  it("leaves half-hour-start columns blank even when raw data exists there (defensive)", () => {
    const slots = [slot(1, "07:00"), slot(1, "07:30")];
    const result = computeAvailability(slots, ["07:00", "07:30"], 60, caps);
    expect(result["07:00"].count).toBe(1);
    expect(result["07:30"]).toBeUndefined();
  });
});

describe("computeAvailability — window fit is independent of column selectability", () => {
  it("computes a window whose end is past the last selectable start column", () => {
    // "21:00" is the last column offered as a start time, but a 2-hour
    // window from "21:00" needs checkpoints out to "22:30", which is not
    // itself a start column — the underlying slots must still resolve.
    const caps = PROVIDER_CAPABILITIES["parklands"];
    const slots = [
      slot(1, "21:00"), slot(1, "21:30"), slot(1, "22:00"), slot(1, "22:30"),
    ];
    const result = computeAvailability(slots, ["21:00"], 120, caps);
    expect(result["21:00"].count).toBe(1);
  });
});
