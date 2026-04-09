import type {
  IsoTimestamp,
  MetadataRecord,
  OpaqueKey
} from "@/core/domain/types";

import type {
  PlannerFailureReason,
  PlannerFallbackReason,
  PlannerIssue
} from "./issues";
import type { ScenePackage } from "./scene-plan";

export interface PlannerDecisionSummary {
  readonly sceneKind: string;
  readonly sceneGoal: string;
  readonly enabledChoiceCount: number;
  readonly disabledChoiceCount: number;
  readonly allowedRevealCount: number;
  readonly blockedRevealCount: number;
  readonly eligibleEndingCount: number;
}

export interface PlannerDiagnostics {
  readonly requestId: OpaqueKey;
  readonly generatedAt: IsoTimestamp;
  readonly issues: PlannerIssue[];
  readonly notes?: string[];
  readonly metadata?: MetadataRecord;
}

export interface PlannerSuccessResult {
  readonly status: "success";
  readonly scenePackage: ScenePackage;
  readonly decisionSummary: PlannerDecisionSummary;
  readonly diagnostics: PlannerDiagnostics;
}

export interface PlannerFailureResult {
  readonly status: "failure";
  readonly reason: PlannerFailureReason;
  readonly diagnostics: PlannerDiagnostics;
}

export interface PlannerFallbackResult {
  readonly status: "fallback";
  readonly fallbackReason: PlannerFallbackReason;
  readonly fallbackScenePackage: ScenePackage;
  readonly diagnostics: PlannerDiagnostics;
}

export type PlannerResult =
  | PlannerSuccessResult
  | PlannerFailureResult
  | PlannerFallbackResult;
