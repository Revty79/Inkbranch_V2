import "server-only";

import type { InferInsertModel } from "drizzle-orm";

import { db } from "@/data/db";
import {
  mapChronicleRow,
  mapChronicleStateRow,
  mapPerspectiveRunRow,
  type ChronicleRecord,
  type ChronicleStateRecord,
  type PerspectiveRunRecord
} from "@/data/mappers";
import { chronicles, chronicleStates, perspectiveRuns } from "@/data/schema";

export type CreateChronicleInput = Pick<
  InferInsertModel<typeof chronicles>,
  "bookVersionId" | "readerId" | "status" | "metadataJson"
>;

export type CreateChronicleStateInput = Pick<
  InferInsertModel<typeof chronicleStates>,
  | "chronicleId"
  | "currentPerspectiveId"
  | "currentSceneInstanceId"
  | "progressIndex"
  | "endingLocked"
  | "summaryJson"
>;

export type CreatePerspectiveRunInput = Pick<
  InferInsertModel<typeof perspectiveRuns>,
  | "chronicleId"
  | "perspectiveId"
  | "status"
  | "entryCount"
  | "knowledgeScore"
  | "lastSceneInstanceId"
  | "metadataJson"
>;

export async function createChronicle(
  input: CreateChronicleInput
): Promise<ChronicleRecord> {
  const rows = await db.insert(chronicles).values(input).returning();
  return mapChronicleRow(rows[0]);
}

export async function createChronicleState(
  input: CreateChronicleStateInput
): Promise<ChronicleStateRecord> {
  const rows = await db.insert(chronicleStates).values(input).returning();
  return mapChronicleStateRow(rows[0]);
}

export async function createPerspectiveRun(
  input: CreatePerspectiveRunInput
): Promise<PerspectiveRunRecord> {
  const rows = await db.insert(perspectiveRuns).values(input).returning();
  return mapPerspectiveRunRow(rows[0]);
}

export async function createChronicleWithInitialState(
  chronicleInput: CreateChronicleInput,
  stateInput: Omit<CreateChronicleStateInput, "chronicleId">
): Promise<{
  chronicle: ChronicleRecord;
  chronicleState: ChronicleStateRecord;
}> {
  return db.transaction(async (tx) => {
    const chronicleRows = await tx
      .insert(chronicles)
      .values(chronicleInput)
      .returning();
    const chronicle = chronicleRows[0];

    const stateRows = await tx
      .insert(chronicleStates)
      .values({
        chronicleId: chronicle.id,
        ...stateInput
      })
      .returning();

    return {
      chronicle: mapChronicleRow(chronicle),
      chronicleState: mapChronicleStateRow(stateRows[0])
    };
  });
}
