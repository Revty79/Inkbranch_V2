import "server-only";

import { asc, eq } from "drizzle-orm";

import {
  mapCanonCommitRow,
  mapChronicleStateRow,
  mapKnowledgeStateRow,
  type CanonCommitRecord,
  type ChronicleStateRecord,
  type KnowledgeStateRecord
} from "@/data/mappers";
import { db } from "@/data/db";
import { canonCommits, chronicleStates, knowledgeState } from "@/data/schema";

export async function getChronicleStateByChronicleId(
  chronicleId: string
): Promise<ChronicleStateRecord | null> {
  const rows = await db
    .select()
    .from(chronicleStates)
    .where(eq(chronicleStates.chronicleId, chronicleId))
    .limit(1);

  return rows[0] ? mapChronicleStateRow(rows[0]) : null;
}

export async function getKnowledgeStateByChronicleId(
  chronicleId: string
): Promise<KnowledgeStateRecord[]> {
  const rows = await db
    .select()
    .from(knowledgeState)
    .where(eq(knowledgeState.chronicleId, chronicleId))
    .orderBy(asc(knowledgeState.createdAt));

  return rows.map(mapKnowledgeStateRow);
}

export async function getCanonCommitsByChronicleId(
  chronicleId: string
): Promise<CanonCommitRecord[]> {
  const rows = await db
    .select()
    .from(canonCommits)
    .where(eq(canonCommits.chronicleId, chronicleId))
    .orderBy(asc(canonCommits.createdAt));

  return rows.map(mapCanonCommitRow);
}
