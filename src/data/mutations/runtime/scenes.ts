import "server-only";

import type { InferInsertModel } from "drizzle-orm";

import {
  mapChoiceResolutionRow,
  mapSceneChoiceRow,
  mapSceneInstanceRow,
  type ChoiceResolutionRecord,
  type SceneChoiceRecord,
  type SceneInstanceRecord
} from "@/data/mappers";
import { db } from "@/data/db";
import { choiceResolutions, sceneChoices, sceneInstances } from "@/data/schema";

export type CreateSceneInstanceInput = Pick<
  InferInsertModel<typeof sceneInstances>,
  | "chronicleId"
  | "perspectiveRunId"
  | "plannerCycle"
  | "sceneKind"
  | "sceneGoal"
  | "plannerPayloadJson"
  | "generatorPayloadJson"
  | "renderedProse"
  | "status"
>;

export type CreateSceneChoiceInput = Pick<
  InferInsertModel<typeof sceneChoices>,
  | "sceneInstanceId"
  | "choiceKey"
  | "label"
  | "intent"
  | "sortOrder"
  | "plannerEffectsJson"
  | "isEnabled"
>;

export type CreateChoiceResolutionInput = Pick<
  InferInsertModel<typeof choiceResolutions>,
  "sceneChoiceId" | "chronicleId" | "resolutionType" | "resolutionPayloadJson"
>;

export async function createSceneInstance(
  input: CreateSceneInstanceInput
): Promise<SceneInstanceRecord> {
  const rows = await db.insert(sceneInstances).values(input).returning();
  return mapSceneInstanceRow(rows[0]);
}

export async function createSceneChoices(
  inputs: CreateSceneChoiceInput[]
): Promise<SceneChoiceRecord[]> {
  if (inputs.length === 0) {
    return [];
  }

  const rows = await db.insert(sceneChoices).values(inputs).returning();
  return rows.map(mapSceneChoiceRow);
}

export async function createChoiceResolution(
  input: CreateChoiceResolutionInput
): Promise<ChoiceResolutionRecord> {
  const rows = await db.insert(choiceResolutions).values(input).returning();
  return mapChoiceResolutionRow(rows[0]);
}

export async function createSceneInstanceWithChoices(
  sceneInput: CreateSceneInstanceInput,
  choices: Omit<CreateSceneChoiceInput, "sceneInstanceId">[]
): Promise<{
  sceneInstance: SceneInstanceRecord;
  sceneChoices: SceneChoiceRecord[];
}> {
  return db.transaction(async (tx) => {
    const sceneRows = await tx
      .insert(sceneInstances)
      .values(sceneInput)
      .returning();
    const scene = sceneRows[0];

    const choiceRows =
      choices.length > 0
        ? await tx
            .insert(sceneChoices)
            .values(
              choices.map((choice) => ({
                sceneInstanceId: scene.id,
                ...choice
              }))
            )
            .returning()
        : [];

    return {
      sceneInstance: mapSceneInstanceRow(scene),
      sceneChoices: choiceRows.map(mapSceneChoiceRow)
    };
  });
}
