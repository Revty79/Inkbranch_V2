import type {
  EntityId,
  IsoTimestamp,
  MetadataRecord,
  OpaqueKey
} from "@/core/domain/types";

import type { DecisionPackage } from "./decisions";
import type { EndingEligibility } from "./endings";
import type { PacingDecisionHint, PacingSnapshot } from "./pacing";
import type { AllowedReveal, BlockedReveal } from "./reveals";

export type SceneKind =
  | "setup"
  | "development"
  | "revelation"
  | "consequence"
  | "transition"
  | "ending";

export type SceneGoal =
  | "advance-arc"
  | "surface-reveal"
  | "resolve-choice-consequence"
  | "stabilize-continuity"
  | "position-ending"
  | "deliver-ending";

export interface SceneIntent {
  readonly intentKey: OpaqueKey;
  readonly summary: string;
  readonly targetOutcome: string;
}

export interface SceneConstraint {
  readonly constraintKey: OpaqueKey;
  readonly description: string;
  readonly source: "authoring" | "runtime" | "continuity" | "pacing" | "ending";
  readonly required: boolean;
}

export interface SceneContinuityFact {
  readonly factKey: OpaqueKey;
  readonly statement: string;
  readonly source: "canon" | "runtime" | "milestone" | "reveal";
  readonly required: boolean;
}

export interface ActiveMilestoneRef {
  readonly milestoneId: EntityId;
  readonly arcKey: OpaqueKey;
  readonly milestoneKey: OpaqueKey;
  readonly required: boolean;
}

export interface ScenePlan {
  readonly scenePlanId: OpaqueKey;
  readonly chronicleId: EntityId;
  readonly bookVersionId: EntityId;
  readonly perspectiveId: EntityId;
  readonly sceneKind: SceneKind;
  readonly sceneGoal: SceneGoal;
  readonly intent: SceneIntent;
  readonly constraints: SceneConstraint[];
  readonly continuityFacts: SceneContinuityFact[];
  readonly activeMilestones: ActiveMilestoneRef[];
  readonly allowedReveals: AllowedReveal[];
  readonly blockedReveals: BlockedReveal[];
  readonly pacingSnapshot: PacingSnapshot;
  readonly pacingHints: PacingDecisionHint[];
  readonly decisionPackage: DecisionPackage;
  readonly endingEligibility: EndingEligibility;
  readonly plannedAt: IsoTimestamp;
  readonly metadata?: MetadataRecord;
}

export interface ScenePackage {
  readonly packageId: OpaqueKey;
  readonly scene: ScenePlan;
  readonly notes?: string[];
}
