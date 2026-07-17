import { pool } from "./pool";
import {
  scrapeAllLocations,
  withUserLocation,
  type GetAvailabilityResponse,
  type LocationAvailability,
} from "../scrapers/getAvailability";

const STALE_MS = 15 * 60 * 1000;
const LOCK_TIMEOUT_MS = 60 * 1000;
const POLL_INTERVAL_MS = 500;
const MAX_POLL_MS = 15000;

type CacheRow = {
  date: string;
  data: LocationAvailability[] | null;
  scraped_at: Date | null;
  locked_at: Date | null;
};

function isFresh(scrapedAt: Date | null): boolean {
  return !!scrapedAt && Date.now() - scrapedAt.getTime() < STALE_MS;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function selectRow(date: string): Promise<CacheRow | null> {
  const { rows } = await pool.query<CacheRow>(
    `SELECT date, data, scraped_at, locked_at FROM availability_cache WHERE date = $1`,
    [date]
  );
  return rows[0] ?? null;
}

// Atomically claims the right to (re)scrape a date. The caller has already
// established that current data (if any) is stale/missing — this only
// needs to check that no one else currently holds a live lock. Note:
// scraped_at must NOT be part of this condition — a row that's currently
// being scraped for the first time has scraped_at = NULL too, and treating
// that as "free to claim" would let multiple requests scrape concurrently.
// Losing this race means another request is already scraping this date.
async function tryClaim(date: string): Promise<boolean> {
  const { rowCount } = await pool.query(
    `INSERT INTO availability_cache (date, locked_at)
     VALUES ($1, now())
     ON CONFLICT (date) DO UPDATE
       SET locked_at = now()
       WHERE availability_cache.locked_at IS NULL
          OR availability_cache.locked_at < now() - interval '${LOCK_TIMEOUT_MS / 1000} seconds'
     RETURNING date`,
    [date]
  );
  return (rowCount ?? 0) > 0;
}

async function saveResult(date: string, data: LocationAvailability[]) {
  await pool.query(
    `UPDATE availability_cache SET data = $2, scraped_at = now(), locked_at = NULL WHERE date = $1`,
    [date, JSON.stringify(data)]
  );
}

async function releaseLock(date: string) {
  await pool.query(
    `UPDATE availability_cache SET locked_at = NULL WHERE date = $1`,
    [date]
  );
}

// Returns the raw (no user-location) scraped results for a date, serving
// from cache when fresh (<15 min old), scraping when stale/missing, and
// deduping concurrent requests for the same date via a DB-level lock so
// only one request actually scrapes at a time.
async function getRawAvailability(date: string): Promise<LocationAvailability[]> {
  const existing = await selectRow(date);
  if (existing && isFresh(existing.scraped_at) && existing.data) {
    return existing.data;
  }

  const claimed = await tryClaim(date);
  if (claimed) {
    try {
      const scraped = await scrapeAllLocations(date);
      await saveResult(date, scraped);
      return scraped;
    } catch (err) {
      await releaseLock(date);
      throw err;
    }
  }

  const deadline = Date.now() + MAX_POLL_MS;
  while (Date.now() < deadline) {
    await sleep(POLL_INTERVAL_MS);
    const row = await selectRow(date);
    if (row && isFresh(row.scraped_at) && row.data) {
      return row.data;
    }
  }

  const fallback = await selectRow(date);
  if (fallback?.data) {
    return fallback.data;
  }
  throw new Error(`Timed out waiting for availability scrape for ${date}`);
}

export async function getAvailabilityCached(
  date: string,
  userLocation?: { lat: number; lng: number }
): Promise<GetAvailabilityResponse> {
  const raw = await getRawAvailability(date);
  return {
    date,
    locations: withUserLocation(raw, userLocation),
  };
}
