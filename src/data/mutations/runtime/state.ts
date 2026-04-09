import "server-only";

import { eq, type InferInsertModel } from "drizzle-orm";

import { db } from "@/data/db";
import {
  mapCanonCommitRow,
  mapChronicleStateRow,
  mapKnowledgeStateRow,
  type CanonCommitRecord,
  type ChronicleStateRecord,
  type KnowledgeStateRecord
} from "@/data/mappers";
import { canonCommits, chronicleStates, knowledgeState } from "@/data/schema";

export type CreateKnowledgeStateInput = Pick<
  InferInsertModel<typeof knowledgeState>,
  | "chronicleId"
  | "perspectiveId"
  | "knowledgeKey"
  | "knowledgeStatus"
  | "sourceSceneInstanceId"
  | "metadataJson"
>;

export type CreateCanonCommitInput = Pick<
  InferInsertModel<typeof canonCommits>,
  | "chronicleId"
  | "canonEntryId"
  | "commitType"
  | "commitKey"
  | "commitValueJson"
  | "sourceEventId"
>;

export type UpdateChronicleStateInput = Partial<
  Pick<
    InferInsertModel<typeof chronicleStates>,
    | "currentPerspectiveId"
    | "currentSceneInstanceId"
    | "progressIndex"
    | "endingLocked"
    | "summaryJson"
  >
>;

export async function createKnowledgeStateEntry(
  input: CreateKnowledgeStateInput
): Promise<KnowledgeStateRecord> {
  const rows = await db.insert(knowledgeState).values(input).returning();
  return mapKnowledgeStateRow(rows[0]);
}

export async function createCanonCommit(
  input: CreateCanonCommitInput
): Promise<CanonCommitRecord> {
  const rows = await db.insert(canonCommits).values(input).returning();
  return mapCanonCommitRow(rows[0]);
}

export async function updateChronicleStateByChronicleId(
  chronicleId: string,
  input: UpdateChronicleStateInput
): Promise<ChronicleStateRecord | null> {
  const rows = await db
    .update(chronicleStates)
    .set({
      ...input,
      updatedAt: new Date()
    })
    .where(eq(chronicleStates.chronicleId, chronicleId))
    .returning();

  return rows[0] ? mapChronicleStateRow(rows[0]) : null;
}
