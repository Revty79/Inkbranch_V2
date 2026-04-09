import type {
  EntityId,
  IsoTimestamp,
  MetadataRecord,
  Slug
} from "./primitives";

export type LifecycleStatus = "draft" | "active" | "archived";
export type RuleStatus = "proposed" | "active" | "retired";

export interface AuditedEntity {
  readonly id: EntityId;
  readonly createdAt: IsoTimestamp;
  readonly updatedAt: IsoTimestamp;
}

export interface NamedEntity extends AuditedEntity {
  readonly slug: Slug;
  readonly title: string;
  readonly summary?: string;
  readonly metadata?: MetadataRecord;
}

export interface PrioritizedItem {
  readonly priority: number;
}
