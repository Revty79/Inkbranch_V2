import type { EntityId, MetadataRecord, OpaqueKey } from "@/core/domain/types";

export interface RevealImpactHint {
  readonly impactKey: OpaqueKey;
  readonly impactType:
    | "knowledge"
    | "milestone"
    | "relationship"
    | "stakes"
    | "tone";
  readonly summary: string;
}

export interface RevealCandidate {
  readonly revealRuleId: EntityId;
  readonly revealKey: OpaqueKey;
  readonly subjectType: string;
  readonly subjectId?: EntityId;
  readonly priority?: number;
  readonly gatingRules: Record<string, unknown>;
  readonly exposureEffects: Record<string, unknown>;
}

export type RevealBlockReasonCode =
  | "missing-prerequisite"
  | "continuity-risk"
  | "pacing-constraint"
  | "perspective-knowledge-limit"
  | "ending-gate-conflict"
  | "already-revealed"
  | "unknown";

export interface RevealBlockReason {
  readonly code: RevealBlockReasonCode;
  readonly message: string;
}

export interface AllowedReveal {
  readonly revealRuleId: EntityId;
  readonly revealKey: OpaqueKey;
  readonly subjectType: string;
  readonly subjectId?: EntityId;
  readonly impactHints: RevealImpactHint[];
}

export interface BlockedReveal {
  readonly revealRuleId: EntityId;
  readonly revealKey: OpaqueKey;
  readonly reason: RevealBlockReason;
}

export interface RevealEligibility {
  readonly candidates: RevealCandidate[];
  readonly allowed: AllowedReveal[];
  readonly blocked: BlockedReveal[];
  readonly metadata?: MetadataRecord;
}
