import type { IsoTimestamp } from "@/core/domain/types";

export type RuntimeCommitIssueCode =
  | "chronicle-not-found"
  | "chronicle-state-not-found"
  | "perspective-run-not-found"
  | "scene-instance-not-found"
  | "scene-choice-not-found"
  | "scene-choice-disabled"
  | "scene-choice-already-resolved"
  | "scene-status-not-resolvable"
  | "choice-scene-mismatch"
  | "choice-chronicle-mismatch"
  | "invalid-planner-package"
  | "knowledge-state-contradiction"
  | "canon-commit-contradiction"
  | "reveal-not-allowed"
  | "chronicle-projection-mismatch"
  | "ending-transition-invalid"
  | "validation-guard-failed";

export type RuntimeCommitIssueSeverity = "info" | "warning" | "error";

export interface RuntimeCommitIssue {
  readonly code: RuntimeCommitIssueCode;
  readonly severity: RuntimeCommitIssueSeverity;
  readonly message: string;
  readonly context?: Record<string, unknown>;
}

export interface RuntimeCommitDiagnostics {
  readonly requestId: string;
  readonly generatedAt: IsoTimestamp;
  readonly issues: RuntimeCommitIssue[];
  readonly notes: string[];
}
