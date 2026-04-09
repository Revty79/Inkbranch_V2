import type {
  EntityId,
  MetadataRecord,
  OpaqueKey,
  SortOrder
} from "@/core/domain/types";

export type PlannedChoiceIntent =
  | "advance-milestone"
  | "protect-continuity"
  | "surface-reveal"
  | "escalate-tension"
  | "de-escalate-tension"
  | "position-ending"
  | "gather-information";

export type ChoiceAvailability = "enabled" | "disabled";

export type DisabledChoiceReasonCode =
  | "reveal-gated"
  | "continuity-blocked"
  | "pacing-limited"
  | "ending-ineligible"
  | "milestone-prerequisite-missing"
  | "knowledge-missing"
  | "unknown";

export interface DisabledChoiceReason {
  readonly code: DisabledChoiceReasonCode;
  readonly message: string;
}

export interface ChoiceConstraint {
  readonly constraintKey: OpaqueKey;
  readonly description: string;
  readonly source: "authoring" | "runtime" | "continuity" | "pacing";
}

export interface ChoiceEffectHint {
  readonly effectKey: OpaqueKey;
  readonly effectType:
    | "milestone"
    | "reveal"
    | "knowledge"
    | "relationship"
    | "ending";
  readonly relatedMilestoneId?: EntityId;
  readonly relatedRevealRuleId?: EntityId;
  readonly relatedEndingRuleId?: EntityId;
  readonly summary: string;
}

export interface PlannedChoice {
  readonly choiceKey: OpaqueKey;
  readonly intent: PlannedChoiceIntent;
  readonly availability: ChoiceAvailability;
  readonly sortOrder: SortOrder;
  readonly optionLabelHint: string;
  readonly optionSummaryHint?: string;
  readonly constraints: ChoiceConstraint[];
  readonly effectHints: ChoiceEffectHint[];
  readonly disabledReason?: DisabledChoiceReason;
  readonly metadata?: MetadataRecord;
}

export interface DecisionPackage {
  readonly packageId: OpaqueKey;
  readonly rationale: string;
  readonly choices: PlannedChoice[];
  readonly defaultChoiceKey?: OpaqueKey;
  readonly metadata?: MetadataRecord;
}
