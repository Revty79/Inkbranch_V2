import type { EntityId, MetadataRecord } from "@/core/domain/types";

export type PlannerIssueCode =
  | "insufficient-context"
  | "invalid-authoring-input"
  | "runtime-contradiction"
  | "no-valid-scene-package"
  | "reveal-gating-conflict"
  | "ending-gating-conflict"
  | "pacing-conflict"
  | "continuity-conflict"
  | "fallback-applied"
  | "unknown";

export type PlannerIssueSeverity = "info" | "warning" | "error" | "critical";

export interface PlannerIssue {
  readonly code: PlannerIssueCode;
  readonly severity: PlannerIssueSeverity;
  readonly message: string;
  readonly relatedEntityIds?: EntityId[];
  readonly details?: MetadataRecord;
}

export type PlannerFailureReason =
  | "insufficient-context"
  | "invalid-authoring-input"
  | "runtime-contradiction"
  | "no-valid-scene-package";

export type PlannerFallbackReason =
  | "fallback-scene-kind"
  | "safety-constraint-triggered"
  | "partial-context-fallback"
  | "pacing-safety-fallback";
