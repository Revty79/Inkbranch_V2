import type {
  EntityId,
  IsoTimestamp,
  MetadataRecord,
  OpaqueKey,
  SortOrder
} from "./primitives";

export type ChronicleStatus = "active" | "paused" | "completed" | "abandoned";
export type SceneInstanceStatus =
  | "planned"
  | "rendered"
  | "resolved"
  | "superseded";
export type ChoiceResolutionOutcome = "selected" | "auto-selected" | "rejected";
export type KnowledgeConfidence = "suspected" | "confirmed" | "disproven";
export type RuntimeEventKind =
  | "scene-planned"
  | "scene-rendered"
  | "choice-recorded"
  | "choice-resolved"
  | "state-projected"
  | "canon-committed";
export type CanonCommitStatus = "pending" | "committed" | "superseded";

export interface RuntimeConstraint {
  readonly constraintKey: OpaqueKey;
  readonly description: string;
}

export interface Chronicle {
  readonly id: EntityId;
  readonly versionId: EntityId;
  readonly label: string;
  readonly status: ChronicleStatus;
  readonly createdAt: IsoTimestamp;
  readonly updatedAt: IsoTimestamp;
}

export interface PerspectiveRun {
  readonly id: EntityId;
  readonly chronicleId: EntityId;
  readonly perspectiveId: EntityId;
  readonly startedAt: IsoTimestamp;
  readonly completedAt?: IsoTimestamp;
}

export interface SceneInstance {
  readonly id: EntityId;
  readonly chronicleId: EntityId;
  readonly perspectiveRunId: EntityId;
  readonly sceneKind: string;
  readonly sceneGoal: string;
  readonly status: SceneInstanceStatus;
  readonly plannedAt: IsoTimestamp;
  readonly resolvedAt?: IsoTimestamp;
  readonly metadata?: MetadataRecord;
}

export interface SceneChoice {
  readonly id: EntityId;
  readonly sceneInstanceId: EntityId;
  readonly choiceKey: OpaqueKey;
  readonly label: string;
  readonly summary: string;
  readonly sortOrder: SortOrder;
}

export interface ChoiceResolution {
  readonly id: EntityId;
  readonly sceneChoiceId: EntityId;
  readonly chronicleId: EntityId;
  readonly outcome: ChoiceResolutionOutcome;
  readonly rationale?: string;
  readonly resolvedAt: IsoTimestamp;
}

export interface KnowledgeStateEntry {
  readonly id: EntityId;
  readonly chronicleId: EntityId;
  readonly canonEntryId: EntityId;
  readonly confidence: KnowledgeConfidence;
  readonly discoveredAt: IsoTimestamp;
}

export interface RuntimeEventEntry {
  readonly id: EntityId;
  readonly chronicleId: EntityId;
  readonly eventKind: RuntimeEventKind;
  readonly occurredAt: IsoTimestamp;
  readonly payload: MetadataRecord;
}

export interface CanonCommit {
  readonly id: EntityId;
  readonly chronicleId: EntityId;
  readonly canonEntryId: EntityId;
  readonly commitStatus: CanonCommitStatus;
  readonly committedAt: IsoTimestamp;
}

export interface ChronicleStateProjection {
  readonly chronicleId: EntityId;
  readonly activePerspectiveRunId?: EntityId;
  readonly latestSceneInstanceId?: EntityId;
  readonly lastResolvedChoiceId?: EntityId;
  readonly updatedAt: IsoTimestamp;
}
