import type { IsoTimestamp, MetadataRecord, OpaqueKey } from "./primitives";

export type ValidationSeverity = "info" | "warning" | "error" | "critical";
export type ValidationSource = "general" | "continuity" | "reveal" | "ending";
export type ValidationIssueCode =
  | "continuity_gap"
  | "illegal_reveal"
  | "ending_not_eligible"
  | "missing_required_milestone"
  | "invalid_runtime_constraint"
  | "unknown";

export interface ValidationIssue {
  readonly code: ValidationIssueCode;
  readonly severity: ValidationSeverity;
  readonly message: string;
  readonly relatedKey?: OpaqueKey;
  readonly context?: MetadataRecord;
}

export interface ValidationResult {
  readonly ok: boolean;
  readonly source: ValidationSource;
  readonly checkedAt: IsoTimestamp;
  readonly issues: ValidationIssue[];
}

export interface ContinuityValidationResult extends ValidationResult {
  readonly source: "continuity";
}

export interface RevealValidationResult extends ValidationResult {
  readonly source: "reveal";
}

export interface EndingValidationResult extends ValidationResult {
  readonly source: "ending";
}
