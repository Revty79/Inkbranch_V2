import "server-only";

import { asc, eq } from "drizzle-orm";

import { mapEventLogRow, type EventLogRecord } from "@/data/mappers";
import { db } from "@/data/db";
import { eventLog } from "@/data/schema";

export async function getEventLogEntriesByChronicleId(
  chronicleId: string
): Promise<EventLogRecord[]> {
  const rows = await db
    .select()
    .from(eventLog)
    .where(eq(eventLog.chronicleId, chronicleId))
    .orderBy(asc(eventLog.eventTs));

  return rows.map(mapEventLogRow);
}
