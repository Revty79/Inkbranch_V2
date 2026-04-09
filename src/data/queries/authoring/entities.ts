import "server-only";

import { asc, eq } from "drizzle-orm";

import {
  mapCharacterRow,
  mapFactionRow,
  mapLocationRow,
  mapPerspectiveRow,
  type AuthoringEntityRecord,
  type PerspectiveRecord
} from "@/data/mappers";
import { db } from "@/data/db";
import { characters, factions, locations, perspectives } from "@/data/schema";

export async function getPerspectivesByBookVersionId(
  bookVersionId: string
): Promise<PerspectiveRecord[]> {
  const rows = await db
    .select()
    .from(perspectives)
    .where(eq(perspectives.bookVersionId, bookVersionId))
    .orderBy(asc(perspectives.createdAt));

  return rows.map(mapPerspectiveRow);
}

export async function listCharactersByBookVersionId(
  bookVersionId: string
): Promise<AuthoringEntityRecord[]> {
  const rows = await db
    .select()
    .from(characters)
    .where(eq(characters.bookVersionId, bookVersionId))
    .orderBy(asc(characters.name));

  return rows.map(mapCharacterRow);
}

export async function listLocationsByBookVersionId(
  bookVersionId: string
): Promise<AuthoringEntityRecord[]> {
  const rows = await db
    .select()
    .from(locations)
    .where(eq(locations.bookVersionId, bookVersionId))
    .orderBy(asc(locations.name));

  return rows.map(mapLocationRow);
}

export async function listFactionsByBookVersionId(
  bookVersionId: string
): Promise<AuthoringEntityRecord[]> {
  const rows = await db
    .select()
    .from(factions)
    .where(eq(factions.bookVersionId, bookVersionId))
    .orderBy(asc(factions.name));

  return rows.map(mapFactionRow);
}

export async function getCharacterById(
  characterId: string
): Promise<AuthoringEntityRecord | null> {
  const rows = await db
    .select()
    .from(characters)
    .where(eq(characters.id, characterId))
    .limit(1);

  return rows[0] ? mapCharacterRow(rows[0]) : null;
}

export async function getLocationById(
  locationId: string
): Promise<AuthoringEntityRecord | null> {
  const rows = await db
    .select()
    .from(locations)
    .where(eq(locations.id, locationId))
    .limit(1);

  return rows[0] ? mapLocationRow(rows[0]) : null;
}

export async function getFactionById(
  factionId: string
): Promise<AuthoringEntityRecord | null> {
  const rows = await db
    .select()
    .from(factions)
    .where(eq(factions.id, factionId))
    .limit(1);

  return rows[0] ? mapFactionRow(rows[0]) : null;
}

export async function getPerspectiveById(
  perspectiveId: string
): Promise<PerspectiveRecord | null> {
  const rows = await db
    .select()
    .from(perspectives)
    .where(eq(perspectives.id, perspectiveId))
    .limit(1);

  return rows[0] ? mapPerspectiveRow(rows[0]) : null;
}
