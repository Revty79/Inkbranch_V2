import type { EntityId, MetadataRecord, OpaqueKey } from "@/core/domain/types";

export interface EndingCandidate {
  readonly endingRuleId: EntityId;
  readonly endingKey: OpaqueKey;
  readonly title: string;
  readonly endingType: string;
  readonly eligibilityRules: Record<string, unknown>;
  readonly priorityRules: Record<string, unknown>;
  readonly resolutionTemplate: Record<string, unknown>;
}

export interface EndingCandidateSet {
  readonly candidates: EndingCandidate[];
}

export type EndingBlockReasonCode =
  | "missing-required-milestone"
  | "missing-required-reveal"
  | "continuity-conflict"
  | "pacing-not-ready"
  | "perspective-ineligible"
  | "unknown";

export interface EndingBlockReason {
  readonly code: EndingBlockReasonCode;
  readonly message: string;
}

export interface EligibleEnding {
  readonly endingRuleId: EntityId;
  readonly endingKey: OpaqueKey;
  readonly title: string;
  readonly endingType: string;
}

export interface BlockedEnding {
  readonly endingRuleId: EntityId;
  readonly endingKey: OpaqueKey;
  readonly reason: EndingBlockReason;
}

export interface EndingEligibility {
  readonly status: "none-eligible" | "eligible";
  readonly eligibleEndings: EligibleEnding[];
  readonly blockedEndings: BlockedEnding[];
  readonly metadata?: MetadataRecord;
}
