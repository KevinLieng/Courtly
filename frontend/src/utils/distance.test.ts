import { describe, it, expect } from "vitest";
import { formatDistanceKm } from "./distance";

describe("formatDistanceKm", () => {
  it("shows one decimal place under 10km", () => {
    expect(formatDistanceKm(3.42)).toBe("3.4 km");
  });

  it("shows a rounded whole number at exactly 10km", () => {
    expect(formatDistanceKm(10)).toBe("10 km");
  });

  it("shows a rounded whole number above 10km", () => {
    expect(formatDistanceKm(14.6)).toBe("15 km");
  });

  it("handles very small distances", () => {
    expect(formatDistanceKm(0.04)).toBe("0.0 km");
  });
});
