import type { EntityId, OpaqueKey, Slug } from "../types";

export interface EntityReference {
  readonly id: EntityId;
}

export interface SlugReference {
  readonly slug: Slug;
}

export interface RuleReference {
  readonly ruleKey: OpaqueKey;
}
