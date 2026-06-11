import axios from "axios";
import * as cheerio from "cheerio";

export type AvailabilitySlot = {
  court: number;
  time: string;
  available: boolean;
};

export async function getAvailability(location: number, date: string) {
  const url = `https://jensenstennis.intrac.com.au/tennis/book.cfm?location=${location}&date=${date}`;

  // rosebery court has hotshot courts so just take the full size court
  if (location == 6) {
    const url = `https://jensenstennis.intrac.com.au/tennis/book.cfm?location=${location}&date=${date}&court=283`;
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

  const slots: AvailabilitySlot[] = [];

  $("a[href*='reserve.cfm']").each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;

    const match = href.match(
      /date=([^&]+).*?start=([^&]+).*?court=(\d+)/
    );

    if (!match) return;


    const court = Number(match[3]);

    slots.push({
      court: court === 227 ? 5 : court,
      time: match[2],
      available: true,
    });
  });
  console.log(slots)
  return slots;
}