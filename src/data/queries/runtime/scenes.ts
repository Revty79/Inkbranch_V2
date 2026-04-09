import "server-only";

import { asc, eq } from "drizzle-orm";

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

export async function getChoiceResolutionsByChronicleId(
  chronicleId: string
): Promise<ChoiceResolutionRecord[]> {
  const rows = await db
    .select()
    .from(choiceResolutions)
    .where(eq(choiceResolutions.chronicleId, chronicleId))
    .orderBy(
      asc(choiceResolutions.resolvedAt),
      asc(choiceResolutions.createdAt)
    );

  return rows.map(mapChoiceResolutionRow);
}

export async function getChoiceResolutionsBySceneInstanceId(
  sceneInstanceId: string
): Promise<ChoiceResolutionRecord[]> {
  const rows = await db
    .select({
      resolution: choiceResolutions
    })
    .from(choiceResolutions)
    .innerJoin(
      sceneChoices,
      eq(choiceResolutions.sceneChoiceId, sceneChoices.id)
    )
    .where(eq(sceneChoices.sceneInstanceId, sceneInstanceId))
    .orderBy(
      asc(choiceResolutions.resolvedAt),
      asc(choiceResolutions.createdAt)
    );

  return rows.map((row) => mapChoiceResolutionRow(row.resolution));
}

export async function getSceneInstanceById(
  sceneInstanceId: string
): Promise<SceneInstanceRecord | null> {
  const rows = await db
    .select()
    .from(sceneInstances)
    .where(eq(sceneInstances.id, sceneInstanceId))
    .limit(1);

  return rows[0] ? mapSceneInstanceRow(rows[0]) : null;
}

export async function getMostRecentSceneInstanceByChronicleId(
  chronicleId: string
): Promise<SceneInstanceRecord | null> {
  const rows = await db
    .select()
    .from(sceneInstances)
    .where(eq(sceneInstances.chronicleId, chronicleId))
    .orderBy(asc(sceneInstances.plannerCycle), asc(sceneInstances.createdAt));

  const latest = rows.at(-1);

  return latest ? mapSceneInstanceRow(latest) : null;
}
