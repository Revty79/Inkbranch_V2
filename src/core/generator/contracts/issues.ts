import type { IsoTimestamp } from "@/core/domain/types";

export type GeneratorIssueCode =
  | "invalid-input"
  | "generation-disabled"
  | "provider-unavailable"
  | "adapter-failure"
  | "timeout"
  | "invalid-output-shape"
  | "missing-prose"
  | "missing-choice"
  | "unexpected-choice"
  | "empty-choice-label"
  | "fallback-applied";

export type GeneratorIssueSeverity = "info" | "warning" | "error";

export interface GeneratorIssue {
  readonly code: GeneratorIssueCode;
  readonly severity: GeneratorIssueSeverity;
  readonly message: string;
  readonly context?: Record<string, unknown>;
}

export type GeneratorFailureReason =
  | "invalid-input"
  | "generation-disabled"
  | "provider-unavailable"
  | "adapter-failure"
  | "timeout"
  | "validation-failed"
  | "unknown";

export type GeneratorFallbackReason =
  | "generation-disabled"
  | "provider-unavailable"
  | "adapter-failure"
  | "timeout"
  | "validation-failed"
  | "unknown";

export interface GeneratorDiagnostics {
  readonly requestId: string;
  readonly generatedAt: IsoTimestamp;
  readonly issues: GeneratorIssue[];
  readonly notes: string[];
  readonly metadata?: Record<string, unknown>;
}
