import "server-only";

import { asc, eq } from "drizzle-orm";

import {
  mapArcMilestoneRow,
  mapEndingRuleRow,
  mapPacingRuleRow,
  mapRevealRuleRow,
  type ArcMilestoneRecord,
  type EndingRuleRecord,
  type PacingRuleRecord,
  type RevealRuleRecord
} from "@/data/mappers";
import { db } from "@/data/db";
import {
  arcMilestones,
  endingRules,
  pacingRules,
  revealRules
} from "@/data/schema";

export async function getArcMilestonesByBookVersionId(
  bookVersionId: string
): Promise<ArcMilestoneRecord[]> {
  const rows = await db
    .select()
    .from(arcMilestones)
    .where(eq(arcMilestones.bookVersionId, bookVersionId))
    .orderBy(
      asc(arcMilestones.arcKey),
      asc(arcMilestones.sequenceHint),
      asc(arcMilestones.priority)
    );

  return rows.map(mapArcMilestoneRow);
}

export async function getRevealRulesByBookVersionId(
  bookVersionId: string
): Promise<RevealRuleRecord[]> {
  const rows = await db
    .select()
    .from(revealRules)
    .where(eq(revealRules.bookVersionId, bookVersionId))
    .orderBy(asc(revealRules.revealKey));

  return rows.map(mapRevealRuleRow);
}

export async function getPacingRulesByBookVersionId(
  bookVersionId: string
): Promise<PacingRuleRecord[]> {
  const rows = await db
    .select()
    .from(pacingRules)
    .where(eq(pacingRules.bookVersionId, bookVersionId))
    .orderBy(asc(pacingRules.scope), asc(pacingRules.ruleType));

  return rows.map(mapPacingRuleRow);
}

export async function getEndingRulesByBookVersionId(
  bookVersionId: string
): Promise<EndingRuleRecord[]> {
  const rows = await db
    .select()
    .from(endingRules)
    .where(eq(endingRules.bookVersionId, bookVersionId))
    .orderBy(asc(endingRules.endingKey));

  return rows.map(mapEndingRuleRow);
}

export async function getArcMilestoneById(
  milestoneId: string
): Promise<ArcMilestoneRecord | null> {
  const rows = await db
    .select()
    .from(arcMilestones)
    .where(eq(arcMilestones.id, milestoneId))
    .limit(1);

  return rows[0] ? mapArcMilestoneRow(rows[0]) : null;
}

export async function getRevealRuleById(
  revealRuleId: string
): Promise<RevealRuleRecord | null> {
  const rows = await db
    .select()
    .from(revealRules)
    .where(eq(revealRules.id, revealRuleId))
    .limit(1);

  return rows[0] ? mapRevealRuleRow(rows[0]) : null;
}

export async function getPacingRuleById(
  pacingRuleId: string
): Promise<PacingRuleRecord | null> {
  const rows = await db
    .select()
    .from(pacingRules)
    .where(eq(pacingRules.id, pacingRuleId))
    .limit(1);

  return rows[0] ? mapPacingRuleRow(rows[0]) : null;
}

export async function getEndingRuleById(
  endingRuleId: string
): Promise<EndingRuleRecord | null> {
  const rows = await db
    .select()
    .from(endingRules)
    .where(eq(endingRules.id, endingRuleId))
    .limit(1);

  return rows[0] ? mapEndingRuleRow(rows[0]) : null;
}
