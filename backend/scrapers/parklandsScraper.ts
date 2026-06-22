import axios from "axios";
import * as cheerio from "cheerio";

import type { AvailabilityResponse, AvailabilitySlot } from "./slotTypes";

export async function parklandsScraper(
  location: number,
  date: string
): Promise<AvailabilityResponse> {
  const baseUrl = "https://parklands.intrac.com.au/sports";
  const url = `${baseUrl}/schedule.cfm?location=${location}&date=${date}`;

  console.log("Parklands scraper called");
  console.log("Parklands URL:", url);

  const response = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-AU,en;q=0.9",
      Referer: "https://parklands.intrac.com.au/",
    },
  });

  console.log("Parklands response status:", response.status);
  console.log("HTML length:", response.data.length);

  const $ = cheerio.load(response.data);
  const slots: AvailabilitySlot[] = [];

  const links = $("a[href*='book.cfm']");

  console.log("Book links found:", links.length);

  links.each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;

    console.log("Found href:", href);

    const match = href.match(
      /date=([^&]+).*?start=([^&]+).*?court=(\d+)/
    );

    if (!match) return;
    if (match[1] !== date) return;

    slots.push({
      court: Number(match[3]),
      time: match[2],
      available: true,
      bookingUrl: url,
    });
  });

  console.log("Parklands slots:", slots);

  return {
    status: "ok",
    slots,
  };
}