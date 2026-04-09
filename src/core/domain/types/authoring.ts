import type { LifecycleStatus, NamedEntity, RuleStatus } from "./common";
import type { EntityId, MetadataRecord, OpaqueKey } from "./primitives";

export type BookVersionStatus = "draft" | "playtest" | "published" | "retired";
export type CanonEntryStatus = "proposed" | "canon" | "deprecated";
export type PerspectiveRole = "lead" | "supporting" | "observer";

export interface World extends NamedEntity {
  readonly status: LifecycleStatus;
}

export interface Book extends NamedEntity {
  readonly worldId: EntityId;
  readonly status: LifecycleStatus;
}

export interface BookVersion extends NamedEntity {
  readonly bookId: EntityId;
  readonly status: BookVersionStatus;
}

export interface CanonEntry extends NamedEntity {
  readonly versionId: EntityId;
  readonly status: CanonEntryStatus;
  readonly truthStatement: string;
}

export interface Character extends NamedEntity {
  readonly worldId: EntityId;
  readonly motivation?: string;
}

export interface Location extends NamedEntity {
  readonly worldId: EntityId;
  readonly atmosphere?: string;
}

export interface Faction extends NamedEntity {
  readonly worldId: EntityId;
  readonly doctrineSummary?: string;
}

export interface Perspective extends NamedEntity {
  readonly versionId: EntityId;
  readonly characterId: EntityId;
  readonly role: PerspectiveRole;
}

export interface ArcMilestone extends NamedEntity {
  readonly versionId: EntityId;
  readonly perspectiveId: EntityId;
  readonly milestoneKey: OpaqueKey;
  readonly completionSignal: string;
}

export interface RevealRule extends NamedEntity {
  readonly versionId: EntityId;
  readonly ruleKey: OpaqueKey;
  readonly status: RuleStatus;
  readonly prerequisiteMilestoneIds: EntityId[];
  readonly gatedCanonEntryIds: EntityId[];
}

export interface PacingRule extends NamedEntity {
  readonly versionId: EntityId;
  readonly ruleKey: OpaqueKey;
  readonly status: RuleStatus;
  readonly pressureBand: "slow" | "steady" | "fast";
  readonly targetMilestoneIds: EntityId[];
}

export interface EndingRule extends NamedEntity {
  readonly versionId: EntityId;
  readonly ruleKey: OpaqueKey;
  readonly status: RuleStatus;
  readonly requiredMilestoneIds: EntityId[];
  readonly requiredRevealRuleIds: EntityId[];
}

export interface AuthoringSnapshot {
  readonly world: World;
  readonly book: Book;
  readonly version: BookVersion;
  readonly canonEntries: CanonEntry[];
  readonly characters: Character[];
  readonly locations: Location[];
  readonly factions: Faction[];
  readonly perspectives: Perspective[];
  readonly arcMilestones: ArcMilestone[];
  readonly revealRules: RevealRule[];
  readonly pacingRules: PacingRule[];
  readonly endingRules: EndingRule[];
  readonly metadata?: MetadataRecord;
}
