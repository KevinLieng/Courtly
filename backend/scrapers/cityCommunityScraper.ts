import axios from "axios";
import * as cheerio from "cheerio";

export type AvailabilitySlot = {
  court: number;
  time: string;
  available: boolean;
};

export type AvailabilityResponse = {
  status: "ok" | "invalid-date";
  slots: AvailabilitySlot[];
};

function formatDateForPage(date: string) {
  const [year, month, day] = date.split("-").map(Number);

  return new Date(year, month - 1, day).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function getAvailability(location: number, date: string): Promise<AvailabilityResponse> {
  let url = `https://jensenstennis.intrac.com.au/tennis/book.cfm?location=${location}&date=${date}`;

  // rosebery court has hotshot courts so just take the full size court
  if (location == 6) {
    url = `https://jensenstennis.intrac.com.au/tennis/book.cfm?location=${location}&date=${date}&court=283`;
  }

  const response = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
      "Accept":
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-AU,en;q=0.9",
      "Referer": "https://jensenstennis.intrac.com.au/",
    },
  });  
  
  const $ = cheerio.load(response.data);

  const expectedPageDate = formatDateForPage(date);
  const pageText = $("body").text().replace(/\s+/g, " ").trim();

  if (!pageText.includes(expectedPageDate)) {
    return {
      status: "invalid-date",
      slots: [],
    };
  }

  const slots: AvailabilitySlot[] = [];

  $("a[href*='reserve.cfm']").each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;

    const match = href.match(
      /date=([^&]+).*?start=([^&]+).*?court=(\d+)/
    );

    if (!match) return;
    if (match[1] !== date) return;

    slots.push({
      court: Number(match[3]),
      time: match[2],
      available: true,
    });
  });
  console.log(slots)
  return {
    status: "ok",
    slots,
  };
}