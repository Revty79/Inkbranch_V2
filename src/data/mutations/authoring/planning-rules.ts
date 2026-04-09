import "server-only";

import { eq, type InferInsertModel } from "drizzle-orm";

import { db } from "@/data/db";
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
import {
  arcMilestones,
  endingRules,
  pacingRules,
  revealRules
} from "@/data/schema";

export type CreateArcMilestoneInput = Pick<
  InferInsertModel<typeof arcMilestones>,
  | "bookVersionId"
  | "arcKey"
  | "milestoneKey"
  | "title"
  | "description"
  | "priority"
  | "required"
  | "sequenceHint"
  | "eligibilityRulesJson"
  | "completionRulesJson"
>;

export type CreateRevealRuleInput = Pick<
  InferInsertModel<typeof revealRules>,
  | "bookVersionId"
  | "revealKey"
  | "subjectType"
  | "subjectId"
  | "gatingRulesJson"
  | "exposureEffectsJson"
>;

export type CreatePacingRuleInput = Pick<
  InferInsertModel<typeof pacingRules>,
  "bookVersionId" | "scope" | "ruleType" | "ruleConfigJson"
>;

export type CreateEndingRuleInput = Pick<
  InferInsertModel<typeof endingRules>,
  | "bookVersionId"
  | "endingKey"
  | "title"
  | "endingType"
  | "eligibilityRulesJson"
  | "priorityRulesJson"
  | "resolutionTemplateJson"
>;

export async function createArcMilestone(
  input: CreateArcMilestoneInput
): Promise<ArcMilestoneRecord> {
  const rows = await db.insert(arcMilestones).values(input).returning();
  return mapArcMilestoneRow(rows[0]);
}

export async function createRevealRule(
  input: CreateRevealRuleInput
): Promise<RevealRuleRecord> {
  const rows = await db.insert(revealRules).values(input).returning();
  return mapRevealRuleRow(rows[0]);
}

export async function createPacingRule(
  input: CreatePacingRuleInput
): Promise<PacingRuleRecord> {
  const rows = await db.insert(pacingRules).values(input).returning();
  return mapPacingRuleRow(rows[0]);
}

export async function createEndingRule(
  input: CreateEndingRuleInput
): Promise<EndingRuleRecord> {
  const rows = await db.insert(endingRules).values(input).returning();
  return mapEndingRuleRow(rows[0]);
}

export type UpdateArcMilestoneInput = Partial<CreateArcMilestoneInput>;
export type UpdateRevealRuleInput = Partial<CreateRevealRuleInput>;
export type UpdatePacingRuleInput = Partial<CreatePacingRuleInput>;
export type UpdateEndingRuleInput = Partial<CreateEndingRuleInput>;

export async function updateArcMilestone(
  milestoneId: string,
  input: UpdateArcMilestoneInput
): Promise<ArcMilestoneRecord | null> {
  const rows = await db
    .update(arcMilestones)
    .set({
      ...input,
      updatedAt: new Date()
    })
    .where(eq(arcMilestones.id, milestoneId))
    .returning();

  return rows[0] ? mapArcMilestoneRow(rows[0]) : null;
}

export async function updateRevealRule(
  revealRuleId: string,
  input: UpdateRevealRuleInput
): Promise<RevealRuleRecord | null> {
  const rows = await db
    .update(revealRules)
    .set({
      ...input,
      updatedAt: new Date()
    })
    .where(eq(revealRules.id, revealRuleId))
    .returning();

  return rows[0] ? mapRevealRuleRow(rows[0]) : null;
}

export async function updatePacingRule(
  pacingRuleId: string,
  input: UpdatePacingRuleInput
): Promise<PacingRuleRecord | null> {
  const rows = await db
    .update(pacingRules)
    .set({
      ...input,
      updatedAt: new Date()
    })
    .where(eq(pacingRules.id, pacingRuleId))
    .returning();

  return rows[0] ? mapPacingRuleRow(rows[0]) : null;
}

export async function updateEndingRule(
  endingRuleId: string,
  input: UpdateEndingRuleInput
): Promise<EndingRuleRecord | null> {
  const rows = await db
    .update(endingRules)
    .set({
      ...input,
      updatedAt: new Date()
    })
    .where(eq(endingRules.id, endingRuleId))
    .returning();

  return rows[0] ? mapEndingRuleRow(rows[0]) : null;
}
