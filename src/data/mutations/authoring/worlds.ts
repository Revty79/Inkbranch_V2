import "server-only";

import { eq, type InferInsertModel } from "drizzle-orm";

import { db } from "@/data/db";
import { mapWorldRow, type WorldRecord } from "@/data/mappers";
import { worlds } from "@/data/schema";

export type CreateWorldInput = Pick<
  InferInsertModel<typeof worlds>,
  "slug" | "title" | "description" | "status" | "metadataJson"
>;

export async function createWorld(
  input: CreateWorldInput
): Promise<WorldRecord> {
  const rows = await db.insert(worlds).values(input).returning();
  return mapWorldRow(rows[0]);
}

export type UpdateWorldInput = Partial<CreateWorldInput>;

export async function updateWorld(
  worldId: string,
  input: UpdateWorldInput
): Promise<WorldRecord | null> {
  const rows = await db
    .update(worlds)
    .set({
      ...input,
      updatedAt: new Date()
    })
    .where(eq(worlds.id, worldId))
    .returning();

  return rows[0] ? mapWorldRow(rows[0]) : null;
}
