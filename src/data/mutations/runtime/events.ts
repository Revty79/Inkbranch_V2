import "server-only";

import type { InferInsertModel } from "drizzle-orm";

import { db } from "@/data/db";
import { mapEventLogRow, type EventLogRecord } from "@/data/mappers";
import { eventLog } from "@/data/schema";

export type AppendEventLogEntryInput = Pick<
  InferInsertModel<typeof eventLog>,
  | "chronicleId"
  | "eventType"
  | "eventTs"
  | "causedByType"
  | "causedById"
  | "payloadJson"
>;

export async function appendEventLogEntry(
  input: AppendEventLogEntryInput
): Promise<EventLogRecord> {
  const rows = await db.insert(eventLog).values(input).returning();
  return mapEventLogRow(rows[0]);
}
