import { sql } from "drizzle-orm";

import { closeDbPool, db } from "./client";
import { getDatabaseUrl } from "./config";

export type DatabaseHealthResult = {
  readonly ok: boolean;
  readonly message: string;
};

export async function checkDatabaseHealth(): Promise<DatabaseHealthResult> {
  try {
    getDatabaseUrl();
    await db.execute(sql`select 1`);

    return {
      ok: true,
      message: "Database connection is healthy."
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Unknown database error."
    };
  }
}

export async function closeDatabaseHealthResources(): Promise<void> {
  await closeDbPool();
}
