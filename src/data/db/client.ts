import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "@/data/schema";

import { getDatabaseUrl } from "./config";

const pool = new Pool({
  connectionString: getDatabaseUrl()
});

export const db = drizzle(pool, { schema });

export async function closeDbPool(): Promise<void> {
  await pool.end();
}
