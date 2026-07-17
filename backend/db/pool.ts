import { Pool } from "pg";

// POSTGRES_URL is what Vercel's Supabase integration auto-provisions in
// production; DATABASE_URL is used for local dev (backend/.env) so it isn't
// tied to that integration's naming.
const rawConnectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!rawConnectionString) {
  throw new Error("DATABASE_URL (or POSTGRES_URL) is not set");
}

// Supabase/Vercel-provisioned connection strings often carry
// sslmode=require. Recent pg versions treat require/prefer/verify-ca as
// aliases for verify-full, which fails against Supabase's cert chain with
// SELF_SIGNED_CERT_IN_CHAIN — and a separate `ssl` Pool option doesn't
// reliably override a sslmode already present in the connection string.
// Force sslmode=no-verify (still encrypted, just skips CA verification)
// directly in the string instead, so there's a single source of truth.
function withNoVerifySsl(url: string): string {
  const parsed = new URL(url);
  parsed.searchParams.set("sslmode", "no-verify");
  return parsed.toString();
}

export const pool = new Pool({
  connectionString:
    process.env.DATABASE_SSL === "false" ? rawConnectionString : withNoVerifySsl(rawConnectionString),
});
