import "server-only";

import { eq, type InferInsertModel } from "drizzle-orm";

import { db } from "@/data/db";
import { mapCanonEntryRow, type CanonEntryRecord } from "@/data/mappers";
import { canonEntries } from "@/data/schema";

export type CreateCanonEntryInput = Pick<
  InferInsertModel<typeof canonEntries>,
  | "bookVersionId"
  | "entryType"
  | "subjectType"
  | "subjectId"
  | "canonicalText"
  | "importance"
  | "visibility"
  | "tagsJson"
  | "metadataJson"
>;

export type UpdateCanonEntryInput = Partial<CreateCanonEntryInput>;

export async function createCanonEntry(
  input: CreateCanonEntryInput
): Promise<CanonEntryRecord> {
  const rows = await db.insert(canonEntries).values(input).returning();
  return mapCanonEntryRow(rows[0]);
}

export async function updateCanonEntry(
  canonEntryId: string,
  input: UpdateCanonEntryInput
): Promise<CanonEntryRecord | null> {
  const rows = await db
    .update(canonEntries)
    .set({
      ...input,
      updatedAt: new Date()
    })
    .where(eq(canonEntries.id, canonEntryId))
    .returning();

  return rows[0] ? mapCanonEntryRow(rows[0]) : null;
}
