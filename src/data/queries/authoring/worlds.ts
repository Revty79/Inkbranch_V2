import "server-only";

import { asc, eq } from "drizzle-orm";

import { db } from "@/data/db";
import { mapWorldRow, type WorldRecord } from "@/data/mappers";
import { worlds } from "@/data/schema";

export async function getWorldById(
  worldId: string
): Promise<WorldRecord | null> {
  const row = await db
    .select()
    .from(worlds)
    .where(eq(worlds.id, worldId))
    .limit(1);
  return row[0] ? mapWorldRow(row[0]) : null;
}

export async function getWorldBySlug(
  slug: string
): Promise<WorldRecord | null> {
  const row = await db
    .select()
    .from(worlds)
    .where(eq(worlds.slug, slug))
    .limit(1);
  return row[0] ? mapWorldRow(row[0]) : null;
}

export async function listWorlds(): Promise<WorldRecord[]> {
  const rows = await db.select().from(worlds).orderBy(asc(worlds.title));
  return rows.map(mapWorldRow);
}
