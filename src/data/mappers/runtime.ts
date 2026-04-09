import type { InferSelectModel } from "drizzle-orm";

import {
  canonCommits,
  chronicles,
  chronicleStates,
  eventLog,
  knowledgeState,
  perspectiveRuns,
  choiceResolutions,
  sceneChoices,
  sceneInstances
} from "@/data/schema";

type ChronicleRow = InferSelectModel<typeof chronicles>;
type ChronicleStateRow = InferSelectModel<typeof chronicleStates>;
type PerspectiveRunRow = InferSelectModel<typeof perspectiveRuns>;
type SceneInstanceRow = InferSelectModel<typeof sceneInstances>;
type SceneChoiceRow = InferSelectModel<typeof sceneChoices>;
type ChoiceResolutionRow = InferSelectModel<typeof choiceResolutions>;
type EventLogRow = InferSelectModel<typeof eventLog>;
type KnowledgeStateRow = InferSelectModel<typeof knowledgeState>;
type CanonCommitRow = InferSelectModel<typeof canonCommits>;

export type ChronicleRecord = {
  readonly id: string;
  readonly bookVersionId: string;
  readonly readerId: string | null;
  readonly status: ChronicleRow["status"];
  readonly startedAt: string;
  readonly completedAt: string | null;
  readonly metadata: ChronicleRow["metadataJson"];
  readonly createdAt: string;
  readonly updatedAt: string;
};

export type ChronicleStateRecord = {
  readonly chronicleId: string;
  readonly currentPerspectiveId: string | null;
  readonly currentSceneInstanceId: string | null;
  readonly progressIndex: number;
  readonly endingLocked: boolean;
  readonly summary: ChronicleStateRow["summaryJson"];
  readonly updatedAt: string;
};

export type PerspectiveRunRecord = {
  readonly id: string;
  readonly chronicleId: string;
  readonly perspectiveId: string;
  readonly status: PerspectiveRunRow["status"];
  readonly entryCount: number;
  readonly knowledgeScore: number;
  readonly lastSceneInstanceId: string | null;
  readonly metadata: PerspectiveRunRow["metadataJson"];
  readonly createdAt: string;
  readonly updatedAt: string;
};

export type SceneInstanceRecord = {
  readonly id: string;
  readonly chronicleId: string;
  readonly perspectiveRunId: string;
  readonly plannerCycle: number;
  readonly sceneKind: string;
  readonly sceneGoal: string;
  readonly plannerPayload: SceneInstanceRow["plannerPayloadJson"];
  readonly generatorPayload: SceneInstanceRow["generatorPayloadJson"];
  readonly renderedProse: string | null;
  readonly status: SceneInstanceRow["status"];
  readonly createdAt: string;
  readonly updatedAt: string;
};

export type SceneChoiceRecord = {
  readonly id: string;
  readonly sceneInstanceId: string;
  readonly choiceKey: string;
  readonly label: string;
  readonly intent: string | null;
  readonly sortOrder: number;
  readonly plannerEffects: SceneChoiceRow["plannerEffectsJson"];
  readonly isEnabled: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
};

export type EventLogRecord = {
  readonly id: string;
  readonly chronicleId: string;
  readonly eventType: string;
  readonly eventTs: string;
  readonly causedByType: string | null;
  readonly causedById: string | null;
  readonly payload: EventLogRow["payloadJson"];
  readonly createdAt: string;
};

export type ChoiceResolutionRecord = {
  readonly id: string;
  readonly sceneChoiceId: string;
  readonly chronicleId: string;
  readonly resolutionType: ChoiceResolutionRow["resolutionType"];
  readonly resolutionPayload: ChoiceResolutionRow["resolutionPayloadJson"];
  readonly resolvedAt: string;
  readonly createdAt: string;
};

export type KnowledgeStateRecord = {
  readonly id: string;
  readonly chronicleId: string;
  readonly perspectiveId: string | null;
  readonly knowledgeKey: string;
  readonly knowledgeStatus: KnowledgeStateRow["knowledgeStatus"];
  readonly sourceSceneInstanceId: string | null;
  readonly metadata: KnowledgeStateRow["metadataJson"];
  readonly createdAt: string;
  readonly updatedAt: string;
};

export type CanonCommitRecord = {
  readonly id: string;
  readonly chronicleId: string;
  readonly canonEntryId: string | null;
  readonly commitType: CanonCommitRow["commitType"];
  readonly commitKey: string;
  readonly commitValue: CanonCommitRow["commitValueJson"];
  readonly sourceEventId: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
};

function toIsoTimestamp(value: Date): string {
  return value.toISOString();
}

export function mapChronicleRow(row: ChronicleRow): ChronicleRecord {
  return {
    id: row.id,
    bookVersionId: row.bookVersionId,
    readerId: row.readerId,
    status: row.status,
    startedAt: toIsoTimestamp(row.startedAt),
    completedAt: row.completedAt ? toIsoTimestamp(row.completedAt) : null,
    metadata: row.metadataJson,
    createdAt: toIsoTimestamp(row.createdAt),
    updatedAt: toIsoTimestamp(row.updatedAt)
  };
}

export function mapChronicleStateRow(
  row: ChronicleStateRow
): ChronicleStateRecord {
  return {
    chronicleId: row.chronicleId,
    currentPerspectiveId: row.currentPerspectiveId,
    currentSceneInstanceId: row.currentSceneInstanceId,
    progressIndex: row.progressIndex,
    endingLocked: row.endingLocked,
    summary: row.summaryJson,
    updatedAt: toIsoTimestamp(row.updatedAt)
  };
}

export function mapPerspectiveRunRow(
  row: PerspectiveRunRow
): PerspectiveRunRecord {
  return {
    id: row.id,
    chronicleId: row.chronicleId,
    perspectiveId: row.perspectiveId,
    status: row.status,
    entryCount: row.entryCount,
    knowledgeScore: row.knowledgeScore,
    lastSceneInstanceId: row.lastSceneInstanceId,
    metadata: row.metadataJson,
    createdAt: toIsoTimestamp(row.createdAt),
    updatedAt: toIsoTimestamp(row.updatedAt)
  };
}

export function mapSceneInstanceRow(
  row: SceneInstanceRow
): SceneInstanceRecord {
  return {
    id: row.id,
    chronicleId: row.chronicleId,
    perspectiveRunId: row.perspectiveRunId,
    plannerCycle: row.plannerCycle,
    sceneKind: row.sceneKind,
    sceneGoal: row.sceneGoal,
    plannerPayload: row.plannerPayloadJson,
    generatorPayload: row.generatorPayloadJson,
    renderedProse: row.renderedProse,
    status: row.status,
    createdAt: toIsoTimestamp(row.createdAt),
    updatedAt: toIsoTimestamp(row.updatedAt)
  };
}

export function mapSceneChoiceRow(row: SceneChoiceRow): SceneChoiceRecord {
  return {
    id: row.id,
    sceneInstanceId: row.sceneInstanceId,
    choiceKey: row.choiceKey,
    label: row.label,
    intent: row.intent,
    sortOrder: row.sortOrder,
    plannerEffects: row.plannerEffectsJson,
    isEnabled: row.isEnabled,
    createdAt: toIsoTimestamp(row.createdAt),
    updatedAt: toIsoTimestamp(row.updatedAt)
  };
}

export function mapChoiceResolutionRow(
  row: ChoiceResolutionRow
): ChoiceResolutionRecord {
  return {
    id: row.id,
    sceneChoiceId: row.sceneChoiceId,
    chronicleId: row.chronicleId,
    resolutionType: row.resolutionType,
    resolutionPayload: row.resolutionPayloadJson,
    resolvedAt: toIsoTimestamp(row.resolvedAt),
    createdAt: toIsoTimestamp(row.createdAt)
  };
}

export function mapEventLogRow(row: EventLogRow): EventLogRecord {
  return {
    id: row.id,
    chronicleId: row.chronicleId,
    eventType: row.eventType,
    eventTs: toIsoTimestamp(row.eventTs),
    causedByType: row.causedByType,
    causedById: row.causedById,
    payload: row.payloadJson,
    createdAt: toIsoTimestamp(row.createdAt)
  };
}

export function mapKnowledgeStateRow(
  row: KnowledgeStateRow
): KnowledgeStateRecord {
  return {
    id: row.id,
    chronicleId: row.chronicleId,
    perspectiveId: row.perspectiveId,
    knowledgeKey: row.knowledgeKey,
    knowledgeStatus: row.knowledgeStatus,
    sourceSceneInstanceId: row.sourceSceneInstanceId,
    metadata: row.metadataJson,
    createdAt: toIsoTimestamp(row.createdAt),
    updatedAt: toIsoTimestamp(row.updatedAt)
  };
}

export function mapCanonCommitRow(row: CanonCommitRow): CanonCommitRecord {
  return {
    id: row.id,
    chronicleId: row.chronicleId,
    canonEntryId: row.canonEntryId,
    commitType: row.commitType,
    commitKey: row.commitKey,
    commitValue: row.commitValueJson,
    sourceEventId: row.sourceEventId,
    createdAt: toIsoTimestamp(row.createdAt),
    updatedAt: toIsoTimestamp(row.updatedAt)
  };
}
