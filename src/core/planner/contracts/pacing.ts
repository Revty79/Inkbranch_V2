import type { EntityId, MetadataRecord, OpaqueKey } from "@/core/domain/types";

export type PacingPressureLevel = "low" | "moderate" | "high" | "critical";

export interface PacingTarget {
  readonly targetKey: OpaqueKey;
  readonly label: string;
  readonly description?: string;
  readonly desiredCadence: "slow" | "steady" | "fast";
  readonly targetWindowScenes?: number;
}

export interface PacingPressure {
  readonly pressureKey: OpaqueKey;
  readonly level: PacingPressureLevel;
  readonly source:
    | "milestone"
    | "reveal"
    | "ending"
    | "continuity"
    | "authoring";
  readonly reason: string;
  readonly relatedMilestoneId?: EntityId;
  readonly relatedRevealRuleId?: EntityId;
  readonly relatedEndingRuleId?: EntityId;
}

export interface SceneCadenceState {
  readonly scenesSinceLastMajorReveal: number;
  readonly scenesSinceLastMilestoneAdvance: number;
  readonly consecutiveHighIntensityScenes: number;
  readonly recentSceneKinds: string[];
}

export interface PacingSnapshot {
  readonly currentPhase:
    | "setup"
    | "build"
    | "climax"
    | "resolution"
    | "unknown";
  readonly momentum: "slow" | "steady" | "accelerating" | "decelerating";
  readonly pressureLevels: PacingPressure[];
  readonly cadence: SceneCadenceState;
  readonly metadata?: MetadataRecord;
}

export interface PacingDecisionHint {
  readonly hintKey: OpaqueKey;
  readonly recommendation:
    | "increase-intensity"
    | "maintain-intensity"
    | "decrease-intensity"
    | "resolve-thread"
    | "hold";
  readonly reason: string;
}
