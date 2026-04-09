import "server-only";

import { asc, eq } from "drizzle-orm";

import {
  mapSceneChoiceRow,
  mapSceneInstanceRow,
  type SceneChoiceRecord,
  type SceneInstanceRecord
} from "@/data/mappers";
import { db } from "@/data/db";
import { sceneChoices, sceneInstances } from "@/data/schema";

export async function getSceneInstancesByChronicleId(
  chronicleId: string
): Promise<SceneInstanceRecord[]> {
  const rows = await db
    .select()
    .from(sceneInstances)
    .where(eq(sceneInstances.chronicleId, chronicleId))
    .orderBy(asc(sceneInstances.plannerCycle), asc(sceneInstances.createdAt));

  return rows.map(mapSceneInstanceRow);
}

export async function getSceneChoicesBySceneInstanceId(
  sceneInstanceId: string
): Promise<SceneChoiceRecord[]> {
  const rows = await db
    .select()
    .from(sceneChoices)
    .where(eq(sceneChoices.sceneInstanceId, sceneInstanceId))
    .orderBy(asc(sceneChoices.sortOrder), asc(sceneChoices.createdAt));

  return rows.map(mapSceneChoiceRow);
}
