import { Pool } from "pg";

// POSTGRES_URL is what Vercel's Supabase integration auto-provisions in
// production; DATABASE_URL is used for local dev (backend/.env) so it isn't
// tied to that integration's naming.
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL (or POSTGRES_URL) is not set");
}

export const pool = new Pool({
  connectionString,
  ssl: process.env.DATABASE_SSL === "false" ? false : { rejectUnauthorized: false },
});
