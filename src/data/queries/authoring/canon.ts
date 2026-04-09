import "server-only";

import { asc, eq } from "drizzle-orm";

import { mapCanonEntryRow, type CanonEntryRecord } from "@/data/mappers";
import { db } from "@/data/db";
import { canonEntries } from "@/data/schema";

export async function listCanonEntriesByBookVersionId(
  bookVersionId: string
): Promise<CanonEntryRecord[]> {
  const rows = await db
    .select()
    .from(canonEntries)
    .where(eq(canonEntries.bookVersionId, bookVersionId))
    .orderBy(asc(canonEntries.importance), asc(canonEntries.createdAt));

  return rows.map(mapCanonEntryRow);
}

export async function getCanonEntryById(
  canonEntryId: string
): Promise<CanonEntryRecord | null> {
  const rows = await db
    .select()
    .from(canonEntries)
    .where(eq(canonEntries.id, canonEntryId))
    .limit(1);

  return rows[0] ? mapCanonEntryRow(rows[0]) : null;
}
