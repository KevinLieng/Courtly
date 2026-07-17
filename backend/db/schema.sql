CREATE TABLE IF NOT EXISTS availability_cache (
  date DATE PRIMARY KEY,
  data JSONB,
  scraped_at TIMESTAMPTZ,
  locked_at TIMESTAMPTZ
);
