import "server-only";

import { asc, desc, eq } from "drizzle-orm";

import {
  mapChronicleRow,
  mapPerspectiveRunRow,
  type ChronicleRecord,
  type PerspectiveRunRecord
} from "@/data/mappers";
import { db } from "@/data/db";
import { chronicles, perspectiveRuns } from "@/data/schema";

export async function getChronicleById(
  chronicleId: string
): Promise<ChronicleRecord | null> {
  const rows = await db
    .select()
    .from(chronicles)
    .where(eq(chronicles.id, chronicleId))
    .limit(1);
  return rows[0] ? mapChronicleRow(rows[0]) : null;
}

export async function listChronicles(limit = 50): Promise<ChronicleRecord[]> {
  const rows = await db
    .select()
    .from(chronicles)
    .orderBy(desc(chronicles.startedAt), desc(chronicles.createdAt))
    .limit(limit);

  return rows.map(mapChronicleRow);
}

export async function getPerspectiveRunsByChronicleId(
  chronicleId: string
): Promise<PerspectiveRunRecord[]> {
  const rows = await db
    .select()
    .from(perspectiveRuns)
    .where(eq(perspectiveRuns.chronicleId, chronicleId))
    .orderBy(asc(perspectiveRuns.createdAt));

  return rows.map(mapPerspectiveRunRow);
}
