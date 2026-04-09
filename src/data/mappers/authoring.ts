import type { InferSelectModel } from "drizzle-orm";

import {
  arcMilestones,
  books,
  bookVersions,
  canonEntries,
  characters,
  endingRules,
  factions,
  locations,
  pacingRules,
  perspectives,
  revealRules,
  worlds
} from "@/data/schema";

type WorldRow = InferSelectModel<typeof worlds>;
type BookRow = InferSelectModel<typeof books>;
type BookVersionRow = InferSelectModel<typeof bookVersions>;
type CanonEntryRow = InferSelectModel<typeof canonEntries>;
type PerspectiveRow = InferSelectModel<typeof perspectives>;
type ArcMilestoneRow = InferSelectModel<typeof arcMilestones>;
type RevealRuleRow = InferSelectModel<typeof revealRules>;
type PacingRuleRow = InferSelectModel<typeof pacingRules>;
type EndingRuleRow = InferSelectModel<typeof endingRules>;
type CharacterRow = InferSelectModel<typeof characters>;
type LocationRow = InferSelectModel<typeof locations>;
type FactionRow = InferSelectModel<typeof factions>;

export type WorldRecord = {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly description: string | null;
  readonly status: WorldRow["status"];
  readonly metadata: WorldRow["metadataJson"];
  readonly createdAt: string;
  readonly updatedAt: string;
};

export type BookRecord = {
  readonly id: string;
  readonly worldId: string;
  readonly slug: string;
  readonly title: string;
  readonly premise: string | null;
  readonly defaultTone: string | null;
  readonly status: BookRow["status"];
  readonly metadata: BookRow["metadataJson"];
  readonly createdAt: string;
  readonly updatedAt: string;
};

export type BookVersionRecord = {
  readonly id: string;
  readonly bookId: string;
  readonly versionLabel: string;
  readonly status: BookVersionRow["status"];
  readonly isActive: boolean;
  readonly notes: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
};

export type CanonEntryRecord = {
  readonly id: string;
  readonly bookVersionId: string;
  readonly entryType: string;
  readonly subjectType: string;
  readonly subjectId: string | null;
  readonly canonicalText: string;
  readonly importance: number;
  readonly visibility: CanonEntryRow["visibility"];
  readonly tags: CanonEntryRow["tagsJson"];
  readonly metadata: CanonEntryRow["metadataJson"];
  readonly createdAt: string;
  readonly updatedAt: string;
};

export type PerspectiveRecord = {
  readonly id: string;
  readonly bookVersionId: string;
  readonly characterId: string;
  readonly slug: string;
  readonly name: string;
  readonly summary: string | null;
  readonly voiceGuide: string | null;
  readonly status: PerspectiveRow["status"];
  readonly knowledgeBaseline: PerspectiveRow["knowledgeBaselineJson"];
  readonly eligibilityRules: PerspectiveRow["eligibilityRulesJson"];
  readonly createdAt: string;
  readonly updatedAt: string;
};

export type AuthoringEntityRecord = {
  readonly id: string;
  readonly bookVersionId: string;
  readonly slug: string;
  readonly name: string;
  readonly summary: string | null;
  readonly status: CharacterRow["status"];
  readonly metadata: CharacterRow["metadataJson"];
  readonly createdAt: string;
  readonly updatedAt: string;
};

export type ArcMilestoneRecord = {
  readonly id: string;
  readonly bookVersionId: string;
  readonly arcKey: string;
  readonly milestoneKey: string;
  readonly title: string;
  readonly description: string | null;
  readonly priority: number;
  readonly required: boolean;
  readonly sequenceHint: number | null;
  readonly eligibilityRules: ArcMilestoneRow["eligibilityRulesJson"];
  readonly completionRules: ArcMilestoneRow["completionRulesJson"];
  readonly createdAt: string;
  readonly updatedAt: string;
};

export type RevealRuleRecord = {
  readonly id: string;
  readonly bookVersionId: string;
  readonly revealKey: string;
  readonly subjectType: string;
  readonly subjectId: string | null;
  readonly gatingRules: RevealRuleRow["gatingRulesJson"];
  readonly exposureEffects: RevealRuleRow["exposureEffectsJson"];
  readonly createdAt: string;
  readonly updatedAt: string;
};

export type PacingRuleRecord = {
  readonly id: string;
  readonly bookVersionId: string;
  readonly scope: string;
  readonly ruleType: string;
  readonly ruleConfig: PacingRuleRow["ruleConfigJson"];
  readonly createdAt: string;
  readonly updatedAt: string;
};

export type EndingRuleRecord = {
  readonly id: string;
  readonly bookVersionId: string;
  readonly endingKey: string;
  readonly title: string;
  readonly endingType: string;
  readonly eligibilityRules: EndingRuleRow["eligibilityRulesJson"];
  readonly priorityRules: EndingRuleRow["priorityRulesJson"];
  readonly resolutionTemplate: EndingRuleRow["resolutionTemplateJson"];
  readonly createdAt: string;
  readonly updatedAt: string;
};

function toIsoTimestamp(value: Date): string {
  return value.toISOString();
}

export function mapWorldRow(row: WorldRow): WorldRecord {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    status: row.status,
    metadata: row.metadataJson,
    createdAt: toIsoTimestamp(row.createdAt),
    updatedAt: toIsoTimestamp(row.updatedAt)
  };
}

export function mapBookRow(row: BookRow): BookRecord {
  return {
    id: row.id,
    worldId: row.worldId,
    slug: row.slug,
    title: row.title,
    premise: row.premise,
    defaultTone: row.defaultTone,
    status: row.status,
    metadata: row.metadataJson,
    createdAt: toIsoTimestamp(row.createdAt),
    updatedAt: toIsoTimestamp(row.updatedAt)
  };
}

export function mapBookVersionRow(row: BookVersionRow): BookVersionRecord {
  return {
    id: row.id,
    bookId: row.bookId,
    versionLabel: row.versionLabel,
    status: row.status,
    isActive: row.isActive,
    notes: row.notes,
    createdAt: toIsoTimestamp(row.createdAt),
    updatedAt: toIsoTimestamp(row.updatedAt)
  };
}

export function mapCanonEntryRow(row: CanonEntryRow): CanonEntryRecord {
  return {
    id: row.id,
    bookVersionId: row.bookVersionId,
    entryType: row.entryType,
    subjectType: row.subjectType,
    subjectId: row.subjectId,
    canonicalText: row.canonicalText,
    importance: row.importance,
    visibility: row.visibility,
    tags: row.tagsJson,
    metadata: row.metadataJson,
    createdAt: toIsoTimestamp(row.createdAt),
    updatedAt: toIsoTimestamp(row.updatedAt)
  };
}

export function mapPerspectiveRow(row: PerspectiveRow): PerspectiveRecord {
  return {
    id: row.id,
    bookVersionId: row.bookVersionId,
    characterId: row.characterId,
    slug: row.slug,
    name: row.name,
    summary: row.summary,
    voiceGuide: row.voiceGuide,
    status: row.status,
    knowledgeBaseline: row.knowledgeBaselineJson,
    eligibilityRules: row.eligibilityRulesJson,
    createdAt: toIsoTimestamp(row.createdAt),
    updatedAt: toIsoTimestamp(row.updatedAt)
  };
}

export function mapCharacterRow(row: CharacterRow): AuthoringEntityRecord {
  return {
    id: row.id,
    bookVersionId: row.bookVersionId,
    slug: row.slug,
    name: row.name,
    summary: row.summary,
    status: row.status,
    metadata: row.metadataJson,
    createdAt: toIsoTimestamp(row.createdAt),
    updatedAt: toIsoTimestamp(row.updatedAt)
  };
}

export function mapLocationRow(row: LocationRow): AuthoringEntityRecord {
  return {
    id: row.id,
    bookVersionId: row.bookVersionId,
    slug: row.slug,
    name: row.name,
    summary: row.summary,
    status: row.status,
    metadata: row.metadataJson,
    createdAt: toIsoTimestamp(row.createdAt),
    updatedAt: toIsoTimestamp(row.updatedAt)
  };
}

export function mapFactionRow(row: FactionRow): AuthoringEntityRecord {
  return {
    id: row.id,
    bookVersionId: row.bookVersionId,
    slug: row.slug,
    name: row.name,
    summary: row.summary,
    status: row.status,
    metadata: row.metadataJson,
    createdAt: toIsoTimestamp(row.createdAt),
    updatedAt: toIsoTimestamp(row.updatedAt)
  };
}

export function mapArcMilestoneRow(row: ArcMilestoneRow): ArcMilestoneRecord {
  return {
    id: row.id,
    bookVersionId: row.bookVersionId,
    arcKey: row.arcKey,
    milestoneKey: row.milestoneKey,
    title: row.title,
    description: row.description,
    priority: row.priority,
    required: row.required,
    sequenceHint: row.sequenceHint,
    eligibilityRules: row.eligibilityRulesJson,
    completionRules: row.completionRulesJson,
    createdAt: toIsoTimestamp(row.createdAt),
    updatedAt: toIsoTimestamp(row.updatedAt)
  };
}

export function mapRevealRuleRow(row: RevealRuleRow): RevealRuleRecord {
  return {
    id: row.id,
    bookVersionId: row.bookVersionId,
    revealKey: row.revealKey,
    subjectType: row.subjectType,
    subjectId: row.subjectId,
    gatingRules: row.gatingRulesJson,
    exposureEffects: row.exposureEffectsJson,
    createdAt: toIsoTimestamp(row.createdAt),
    updatedAt: toIsoTimestamp(row.updatedAt)
  };
}

export function mapPacingRuleRow(row: PacingRuleRow): PacingRuleRecord {
  return {
    id: row.id,
    bookVersionId: row.bookVersionId,
    scope: row.scope,
    ruleType: row.ruleType,
    ruleConfig: row.ruleConfigJson,
    createdAt: toIsoTimestamp(row.createdAt),
    updatedAt: toIsoTimestamp(row.updatedAt)
  };
}

export function mapEndingRuleRow(row: EndingRuleRow): EndingRuleRecord {
  return {
    id: row.id,
    bookVersionId: row.bookVersionId,
    endingKey: row.endingKey,
    title: row.title,
    endingType: row.endingType,
    eligibilityRules: row.eligibilityRulesJson,
    priorityRules: row.priorityRulesJson,
    resolutionTemplate: row.resolutionTemplateJson,
    createdAt: toIsoTimestamp(row.createdAt),
    updatedAt: toIsoTimestamp(row.updatedAt)
  };
}
