import type {
  EntityId,
  IsoTimestamp,
  MetadataRecord,
  OpaqueKey
} from "@/core/domain/types";

import type { EndingCandidateSet, EndingEligibility } from "./endings";
import type { PacingSnapshot, PacingTarget } from "./pacing";
import type { RevealEligibility } from "./reveals";

export interface PlanningBookContext {
  readonly worldId: EntityId;
  readonly bookId: EntityId;
  readonly bookVersionId: EntityId;
  readonly versionLabel: string;
}

export interface PlanningChronicleContext {
  readonly chronicleId: EntityId;
  readonly chronicleStatus: "active" | "paused" | "completed" | "abandoned";
  readonly sceneCount: number;
  readonly progressIndex: number;
  readonly endingLocked: boolean;
  readonly latestSceneInstanceId?: EntityId;
  readonly lastResolvedChoiceKey?: OpaqueKey;
}

export interface PlanningPerspectiveContext {
  readonly perspectiveId: EntityId;
  readonly characterId: EntityId;
  readonly perspectiveSlug: string;
  readonly perspectiveName: string;
  readonly voiceGuide?: string;
  readonly knowledgeBaseline: Record<string, unknown>;
  readonly eligibilityRules: Record<string, unknown>;
}

export type KnowledgeConfidence = "suspected" | "confirmed" | "disproven";

export interface PlanningKnowledgeEntry {
  readonly canonEntryId: EntityId;
  readonly knowledgeKey?: string;
  readonly confidence: KnowledgeConfidence;
}

export interface PlanningKnowledgeContext {
  readonly entries: PlanningKnowledgeEntry[];
}

export interface PlanningMilestoneEntry {
  readonly milestoneId: EntityId;
  readonly arcKey: OpaqueKey;
  readonly milestoneKey: OpaqueKey;
  readonly required: boolean;
  readonly priority: number;
  readonly sequenceHint?: number;
  readonly status: "unseen" | "available" | "completed" | "blocked";
}

export interface PlanningMilestoneContext {
  readonly milestones: PlanningMilestoneEntry[];
}

export interface PlanningRevealContext {
  readonly revealEligibility: RevealEligibility;
}

export interface PlanningPacingContext {
  readonly snapshot: PacingSnapshot;
  readonly activeTarget?: PacingTarget;
}

export interface PlanningEndingContext {
  readonly candidates: EndingCandidateSet;
  readonly currentEligibility: EndingEligibility;
}

export interface PreviousSceneContext {
  readonly sceneInstanceId: EntityId;
  readonly sceneKind: string;
  readonly sceneGoal: string;
  readonly selectedChoiceKey?: OpaqueKey;
  readonly resolvedAt?: IsoTimestamp;
}

export interface PlanningContext {
  readonly requestId: OpaqueKey;
  readonly requestedAt: IsoTimestamp;
  readonly book: PlanningBookContext;
  readonly chronicle: PlanningChronicleContext;
  readonly perspective: PlanningPerspectiveContext;
  readonly knowledge: PlanningKnowledgeContext;
  readonly milestones: PlanningMilestoneContext;
  readonly reveals: PlanningRevealContext;
  readonly pacing: PlanningPacingContext;
  readonly endings: PlanningEndingContext;
  readonly previousScene?: PreviousSceneContext;
  readonly continuityFacts: string[];
  readonly metadata?: MetadataRecord;
}
