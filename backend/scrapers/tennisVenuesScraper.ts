import axios from "axios";
import * as cheerio from "cheerio";

import { AvailabilityResponse, AvailabilitySlot } from "./slotTypes";

const BASE_URL = "https://www.tennisvenues.com.au";

// Matches "Court 1 Syn grass", "COURT 9 - HARDCOURT", etc. Venues on this
// platform sometimes mix in non-tennis courts (e.g. "Soccer 7") that this
// default correctly excludes; override per-venue if a court is named
// differently.
const defaultIsTennisCourt = (courtName: string) => /^court/i.test(courtName.trim());

export type TennisVenuesConfig = {
  slug: string;
  venueId?: string;
  isTennisCourt?: (courtName: string) => boolean;
  // Some venues on this platform show a calendar further out than they'll
  // actually let you book — the days beyond this render on their site but
  // 404/reject on request. Default 14, confirmed for Eastside and Panania;
  // override per-venue if a future one turns out different.
  maxAdvanceDays?: number;
};

function toCompactDate(date: string): string {
  return date.replace(/-/g, "");
}

function toColonTime(rawTime: string): string {
  const padded = rawTime.padStart(4, "0");
  return `${padded.slice(0, 2)}:${padded.slice(2, 4)}`;
}

function daysFromToday(date: string): number {
  const [y, m, d] = date.split("-").map(Number);
  const target = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
}

export async function tennisVenuesScraper(
  config: TennisVenuesConfig,
  date: string
): Promise<AvailabilityResponse> {
  const { slug, venueId = "1", isTennisCourt = defaultIsTennisCourt, maxAdvanceDays = 14 } = config;

  if (daysFromToday(date) > maxAdvanceDays) {
    return { status: "ok", slots: [] };
  }

  const compactDate = toCompactDate(date);

  const response = await axios.get(`${BASE_URL}/booking/${slug}/fetch-booking-data`, {
    params: {
      client_id: slug,
      venue_id: venueId,
      resource_id: "",
      date: compactDate,
      view: "v4",
    },
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
      "Accept": "text/html, */*; q=0.01",
      "X-Requested-With": "XMLHttpRequest",
      "Referer": `${BASE_URL}/booking/${slug}/calendar?date=${compactDate}`,
    },
  });

  const $ = cheerio.load(response.data);

  // Every slot links to the venue's own booking calendar for this date,
  // not the per-slot deep link — matches the other scrapers' pattern of
  // sending the user to the venue's page rather than a pre-filled request.
  const bookingUrl = `${BASE_URL}/booking/${slug}/calendar?date=${compactDate}`;

  const tennisCourtIndexes = new Set<number>();
  $("th.v4-court-col").each((_, el) => {
    const index = Number($(el).attr("data-court-index"));
    const name = $(el).text().trim();
    if (isTennisCourt(name)) tennisCourtIndexes.add(index);
  });

  const slots: AvailabilitySlot[] = [];

  $("td.v4-slot-available a").each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;

    const courtIndex = Number($(el).closest("td").attr("data-court-index"));
    if (!tennisCourtIndexes.has(courtIndex)) return;

    const match = href.match(/[?&]t=(\d{3,4})/);
    if (!match) return;

    slots.push({
      court: courtIndex,
      time: toColonTime(match[1]),
      available: true,
      bookingUrl,
    });
  });

  return {
    status: "ok",
    slots,
  };
}
