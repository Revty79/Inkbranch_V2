export type GuardSeverity = "info" | "warning" | "error" | "critical";

export type GuardDomain =
  | "planner-scene"
  | "reveal"
  | "runtime-instantiation"
  | "choice-resolution"
  | "knowledge"
  | "canon-commit"
  | "chronicle-state"
  | "ending"
  | "generator-safety";

export type GuardIssueCode =
  | "invalid-scene-kind"
  | "missing-decision-choices"
  | "duplicate-choice-key"
  | "contradictory-reveal-sets"
  | "invalid-ending-eligibility"
  | "missing-continuity-fact"
  | "reveal-not-allowed"
  | "reveal-blocked"
  | "reveal-missing-reference"
  | "invalid-version-context"
  | "invalid-perspective-run"
  | "choice-not-resolvable"
  | "choice-disabled"
  | "choice-already-resolved"
  | "scene-status-not-resolvable"
  | "invalid-knowledge-key"
  | "knowledge-status-regression"
  | "invalid-canon-commit-key"
  | "canon-commit-contradiction"
  | "chronicle-projection-mismatch"
  | "ending-not-eligible"
  | "ending-transition-invalid"
  | "generator-output-invalid"
  | "generator-choice-mismatch"
  | "unknown";

export interface GuardIssue {
  readonly code: GuardIssueCode;
  readonly severity: GuardSeverity;
  readonly message: string;
  readonly blocking: boolean;
  readonly fallbackAllowed: boolean;
  readonly entityId?: string;
  readonly context?: Record<string, unknown>;
}
