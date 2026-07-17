import "dotenv/config";
import { readFileSync } from "fs";
import { join } from "path";
import { pool } from "./pool";

async function main() {
  const schema = readFileSync(join(__dirname, "schema.sql"), "utf-8");
  await pool.query(schema);
  console.log("availability_cache table ready");
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
