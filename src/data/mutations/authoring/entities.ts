import "server-only";

import { eq, type InferInsertModel } from "drizzle-orm";

import { db } from "@/data/db";
import {
  mapCharacterRow,
  mapFactionRow,
  mapLocationRow,
  mapPerspectiveRow,
  type AuthoringEntityRecord,
  type PerspectiveRecord
} from "@/data/mappers";
import { characters, factions, locations, perspectives } from "@/data/schema";

export type CreateCharacterInput = Pick<
  InferInsertModel<typeof characters>,
  "bookVersionId" | "slug" | "name" | "summary" | "status" | "metadataJson"
>;

export type CreateLocationInput = Pick<
  InferInsertModel<typeof locations>,
  "bookVersionId" | "slug" | "name" | "summary" | "status" | "metadataJson"
>;

export type CreateFactionInput = Pick<
  InferInsertModel<typeof factions>,
  "bookVersionId" | "slug" | "name" | "summary" | "status" | "metadataJson"
>;

export type CreatePerspectiveInput = Pick<
  InferInsertModel<typeof perspectives>,
  | "bookVersionId"
  | "characterId"
  | "slug"
  | "name"
  | "summary"
  | "voiceGuide"
  | "knowledgeBaselineJson"
  | "eligibilityRulesJson"
  | "status"
>;

export async function createCharacter(
  input: CreateCharacterInput
): Promise<AuthoringEntityRecord> {
  const rows = await db.insert(characters).values(input).returning();
  return mapCharacterRow(rows[0]);
}

export async function createLocation(
  input: CreateLocationInput
): Promise<AuthoringEntityRecord> {
  const rows = await db.insert(locations).values(input).returning();
  return mapLocationRow(rows[0]);
}

export async function createFaction(
  input: CreateFactionInput
): Promise<AuthoringEntityRecord> {
  const rows = await db.insert(factions).values(input).returning();
  return mapFactionRow(rows[0]);
}

export async function createPerspective(
  input: CreatePerspectiveInput
): Promise<PerspectiveRecord> {
  const rows = await db.insert(perspectives).values(input).returning();
  return mapPerspectiveRow(rows[0]);
}

export type UpdateCharacterInput = Partial<CreateCharacterInput>;
export type UpdateLocationInput = Partial<CreateLocationInput>;
export type UpdateFactionInput = Partial<CreateFactionInput>;
export type UpdatePerspectiveInput = Partial<CreatePerspectiveInput>;

export async function updateCharacter(
  characterId: string,
  input: UpdateCharacterInput
): Promise<AuthoringEntityRecord | null> {
  const rows = await db
    .update(characters)
    .set({
      ...input,
      updatedAt: new Date()
    })
    .where(eq(characters.id, characterId))
    .returning();

  return rows[0] ? mapCharacterRow(rows[0]) : null;
}

export async function updateLocation(
  locationId: string,
  input: UpdateLocationInput
): Promise<AuthoringEntityRecord | null> {
  const rows = await db
    .update(locations)
    .set({
      ...input,
      updatedAt: new Date()
    })
    .where(eq(locations.id, locationId))
    .returning();

  return rows[0] ? mapLocationRow(rows[0]) : null;
}

export async function updateFaction(
  factionId: string,
  input: UpdateFactionInput
): Promise<AuthoringEntityRecord | null> {
  const rows = await db
    .update(factions)
    .set({
      ...input,
      updatedAt: new Date()
    })
    .where(eq(factions.id, factionId))
    .returning();

  return rows[0] ? mapFactionRow(rows[0]) : null;
}

export async function updatePerspective(
  perspectiveId: string,
  input: UpdatePerspectiveInput
): Promise<PerspectiveRecord | null> {
  const rows = await db
    .update(perspectives)
    .set({
      ...input,
      updatedAt: new Date()
    })
    .where(eq(perspectives.id, perspectiveId))
    .returning();

  return rows[0] ? mapPerspectiveRow(rows[0]) : null;
}
