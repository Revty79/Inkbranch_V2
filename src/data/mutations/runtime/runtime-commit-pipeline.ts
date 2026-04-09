import "server-only";

import { asc, count, eq } from "drizzle-orm";

import type {
  RuntimeCanonCommitRecord,
  RuntimeChoiceResolutionRecord,
  RuntimeChronicleRecord,
  RuntimeChronicleStateRecord,
  RuntimeCommitEventInput,
  RuntimeCommitEventRecord,
  RuntimeCommitPipelineService,
  RuntimeCommitStore,
  RuntimeKnowledgeStateRecord,
  RuntimePerspectiveRunRecord,
  RuntimeSceneChoiceRecord,
  RuntimeSceneInstanceRecord
} from "@/core/runtime/contracts";
import { createRuntimeCommitPipeline } from "@/core/runtime/services";
import { db } from "@/data/db";
import {
  mapCanonCommitRow,
  mapChoiceResolutionRow,
  mapChronicleRow,
  mapChronicleStateRow,
  mapEventLogRow,
  mapKnowledgeStateRow,
  mapPerspectiveRunRow,
  mapSceneChoiceRow,
  mapSceneInstanceRow
} from "@/data/mappers";
import {
  canonCommits,
  choiceResolutions,
  chronicles,
  chronicleStates,
  eventLog,
  knowledgeState,
  perspectiveRuns,
  sceneChoices,
  sceneInstances
} from "@/data/schema";

type RuntimeDbExecutor = Pick<typeof db, "select" | "insert" | "update">;

function toChronicleRecord(
  row: ReturnType<typeof mapChronicleRow>
): RuntimeChronicleRecord {
  return {
    id: row.id,
    bookVersionId: row.bookVersionId,
    status: row.status
  };
}

function toChronicleStateRecord(
  row: ReturnType<typeof mapChronicleStateRow>
): RuntimeChronicleStateRecord {
  return {
    chronicleId: row.chronicleId,
    currentPerspectiveId: row.currentPerspectiveId,
    currentSceneInstanceId: row.currentSceneInstanceId,
    progressIndex: row.progressIndex,
    endingLocked: row.endingLocked,
    summary: row.summary,
    updatedAt: row.updatedAt
  };
}

function toPerspectiveRunRecord(
  row: ReturnType<typeof mapPerspectiveRunRow>
): RuntimePerspectiveRunRecord {
  return {
    id: row.id,
    chronicleId: row.chronicleId,
    perspectiveId: row.perspectiveId,
    status: row.status,
    entryCount: row.entryCount,
    knowledgeScore: row.knowledgeScore,
    lastSceneInstanceId: row.lastSceneInstanceId,
    metadata: row.metadata,
    updatedAt: row.updatedAt
  };
}

function toSceneInstanceRecord(
  row: ReturnType<typeof mapSceneInstanceRow>
): RuntimeSceneInstanceRecord {
  return {
    id: row.id,
    chronicleId: row.chronicleId,
    perspectiveRunId: row.perspectiveRunId,
    plannerCycle: row.plannerCycle,
    sceneKind: row.sceneKind,
    sceneGoal: row.sceneGoal,
    plannerPayload: row.plannerPayload,
    generatorPayload: row.generatorPayload,
    status: row.status,
    updatedAt: row.updatedAt
  };
}

function toSceneChoiceRecord(
  row: ReturnType<typeof mapSceneChoiceRow>
): RuntimeSceneChoiceRecord {
  return {
    id: row.id,
    sceneInstanceId: row.sceneInstanceId,
    choiceKey: row.choiceKey,
    label: row.label,
    intent: row.intent,
    sortOrder: row.sortOrder,
    plannerEffects: row.plannerEffects,
    isEnabled: row.isEnabled
  };
}

function toChoiceResolutionRecord(
  row: ReturnType<typeof mapChoiceResolutionRow>
): RuntimeChoiceResolutionRecord {
  return {
    id: row.id,
    sceneChoiceId: row.sceneChoiceId,
    chronicleId: row.chronicleId,
    resolutionType: row.resolutionType,
    resolutionPayload: row.resolutionPayload,
    resolvedAt: row.resolvedAt
  };
}

function toKnowledgeStateRecord(
  row: ReturnType<typeof mapKnowledgeStateRow>
): RuntimeKnowledgeStateRecord {
  return {
    id: row.id,
    chronicleId: row.chronicleId,
    perspectiveId: row.perspectiveId,
    knowledgeKey: row.knowledgeKey,
    knowledgeStatus: row.knowledgeStatus,
    sourceSceneInstanceId: row.sourceSceneInstanceId,
    metadata: row.metadata
  };
}

function toCanonCommitRecord(
  row: ReturnType<typeof mapCanonCommitRow>
): RuntimeCanonCommitRecord {
  return {
    id: row.id,
    chronicleId: row.chronicleId,
    canonEntryId: row.canonEntryId,
    commitType: row.commitType,
    commitKey: row.commitKey,
    commitValue: row.commitValue,
    sourceEventId: row.sourceEventId
  };
}

function toRuntimeEventRecord(
  row: ReturnType<typeof mapEventLogRow>
): RuntimeCommitEventRecord {
  return {
    id: row.id,
    chronicleId: row.chronicleId,
    eventType: row.eventType,
    eventTs: row.eventTs,
    causedByType: row.causedByType,
    causedById: row.causedById,
    payload: row.payload
  };
}

function createRuntimeCommitStore(
  executor: RuntimeDbExecutor,
  transactionRunner?: (
    operation: (store: RuntimeCommitStore) => Promise<unknown>
  ) => Promise<unknown>
): RuntimeCommitStore {
  const store: RuntimeCommitStore = {
    async runInTransaction<T>(
      operation: (transactionStore: RuntimeCommitStore) => Promise<T>
    ): Promise<T> {
      if (!transactionRunner) {
        return operation(store);
      }

      return transactionRunner(
        operation as (transactionStore: RuntimeCommitStore) => Promise<unknown>
      ) as Promise<T>;
    },

    async getChronicleById(chronicleId) {
      const rows = await executor
        .select()
        .from(chronicles)
        .where(eq(chronicles.id, chronicleId))
        .limit(1);

      return rows[0] ? toChronicleRecord(mapChronicleRow(rows[0])) : null;
    },

    async getChronicleStateByChronicleId(chronicleId) {
      const rows = await executor
        .select()
        .from(chronicleStates)
        .where(eq(chronicleStates.chronicleId, chronicleId))
        .limit(1);

      return rows[0]
        ? toChronicleStateRecord(mapChronicleStateRow(rows[0]))
        : null;
    },

    async createChronicleState(chronicleId, perspectiveId, sceneInstanceId) {
      const rows = await executor
        .insert(chronicleStates)
        .values({
          chronicleId,
          currentPerspectiveId: perspectiveId,
          currentSceneInstanceId: sceneInstanceId,
          progressIndex: 0,
          endingLocked: false,
          summaryJson: {}
        })
        .returning();

      return toChronicleStateRecord(mapChronicleStateRow(rows[0]));
    },

    async countSceneInstancesByChronicleId(chronicleId) {
      const rows = await executor
        .select({
          total: count()
        })
        .from(sceneInstances)
        .where(eq(sceneInstances.chronicleId, chronicleId));

      return Number(rows[0]?.total ?? 0);
    },

    async getPerspectiveRunById(perspectiveRunId) {
      const rows = await executor
        .select()
        .from(perspectiveRuns)
        .where(eq(perspectiveRuns.id, perspectiveRunId))
        .limit(1);

      return rows[0]
        ? toPerspectiveRunRecord(mapPerspectiveRunRow(rows[0]))
        : null;
    },

    async getSceneInstanceById(sceneInstanceId) {
      const rows = await executor
        .select()
        .from(sceneInstances)
        .where(eq(sceneInstances.id, sceneInstanceId))
        .limit(1);

      return rows[0]
        ? toSceneInstanceRecord(mapSceneInstanceRow(rows[0]))
        : null;
    },

    async getSceneChoiceById(sceneChoiceId) {
      const rows = await executor
        .select()
        .from(sceneChoices)
        .where(eq(sceneChoices.id, sceneChoiceId))
        .limit(1);

      return rows[0] ? toSceneChoiceRecord(mapSceneChoiceRow(rows[0])) : null;
    },

    async getChoiceResolutionBySceneChoiceId(sceneChoiceId) {
      const rows = await executor
        .select()
        .from(choiceResolutions)
        .where(eq(choiceResolutions.sceneChoiceId, sceneChoiceId))
        .limit(1);

      return rows[0]
        ? toChoiceResolutionRecord(mapChoiceResolutionRow(rows[0]))
        : null;
    },

    async createSceneInstanceWithChoices(input) {
      const sceneRows = await executor
        .insert(sceneInstances)
        .values({
          chronicleId: input.chronicleId,
          perspectiveRunId: input.perspectiveRunId,
          plannerCycle: input.plannerCycle,
          sceneKind: input.sceneKind,
          sceneGoal: input.sceneGoal,
          plannerPayloadJson: input.plannerPayload,
          generatorPayloadJson: input.generatorPayload,
          status: input.status
        })
        .returning();

      const sceneRow = sceneRows[0];
      const sceneChoiceRows =
        input.choices.length === 0
          ? []
          : await executor
              .insert(sceneChoices)
              .values(
                input.choices.map((choice) => ({
                  sceneInstanceId: sceneRow.id,
                  choiceKey: choice.choiceKey,
                  label: choice.label,
                  intent: choice.intent,
                  sortOrder: choice.sortOrder,
                  plannerEffectsJson: choice.plannerEffects,
                  isEnabled: choice.isEnabled
                }))
              )
              .returning();

      return {
        sceneInstance: toSceneInstanceRecord(mapSceneInstanceRow(sceneRow)),
        sceneChoices: sceneChoiceRows
          .map(mapSceneChoiceRow)
          .sort((left, right) => left.sortOrder - right.sortOrder)
          .map(toSceneChoiceRecord)
      };
    },

    async updateSceneInstanceStatus(sceneInstanceId, status) {
      const rows = await executor
        .update(sceneInstances)
        .set({
          status,
          updatedAt: new Date()
        })
        .where(eq(sceneInstances.id, sceneInstanceId))
        .returning();

      return rows[0]
        ? toSceneInstanceRecord(mapSceneInstanceRow(rows[0]))
        : null;
    },

    async createChoiceResolution(input) {
      const rows = await executor
        .insert(choiceResolutions)
        .values({
          sceneChoiceId: input.sceneChoiceId,
          chronicleId: input.chronicleId,
          resolutionType: input.resolutionType,
          resolutionPayloadJson: input.resolutionPayload
        })
        .returning();

      return toChoiceResolutionRecord(mapChoiceResolutionRow(rows[0]));
    },

    async upsertKnowledgeEntry(input) {
      const rows = await executor
        .insert(knowledgeState)
        .values({
          chronicleId: input.chronicleId,
          perspectiveId: input.perspectiveId,
          knowledgeKey: input.knowledgeKey,
          knowledgeStatus: input.knowledgeStatus,
          sourceSceneInstanceId: input.sourceSceneInstanceId,
          metadataJson: input.metadata
        })
        .onConflictDoUpdate({
          target: [
            knowledgeState.chronicleId,
            knowledgeState.perspectiveId,
            knowledgeState.knowledgeKey
          ],
          set: {
            knowledgeStatus: input.knowledgeStatus,
            sourceSceneInstanceId: input.sourceSceneInstanceId,
            metadataJson: input.metadata,
            updatedAt: new Date()
          }
        })
        .returning();

      return toKnowledgeStateRecord(mapKnowledgeStateRow(rows[0]));
    },

    async getKnowledgeEntriesByChronicleAndPerspective(
      chronicleId,
      perspectiveId
    ) {
      const rows = await executor
        .select()
        .from(knowledgeState)
        .where(eq(knowledgeState.chronicleId, chronicleId))
        .orderBy(asc(knowledgeState.createdAt), asc(knowledgeState.updatedAt));

      return rows
        .map(mapKnowledgeStateRow)
        .map(toKnowledgeStateRecord)
        .filter((entry) => entry.perspectiveId === perspectiveId);
    },

    async createCanonCommit(input) {
      const rows = await executor
        .insert(canonCommits)
        .values({
          chronicleId: input.chronicleId,
          canonEntryId: input.canonEntryId,
          commitType: input.commitType,
          commitKey: input.commitKey,
          commitValueJson: input.commitValue,
          sourceEventId: input.sourceEventId
        })
        .returning();

      return toCanonCommitRecord(mapCanonCommitRow(rows[0]));
    },

    async getCanonCommitsByChronicleId(chronicleId) {
      const rows = await executor
        .select()
        .from(canonCommits)
        .where(eq(canonCommits.chronicleId, chronicleId))
        .orderBy(asc(canonCommits.createdAt), asc(canonCommits.updatedAt));

      return rows.map(mapCanonCommitRow).map(toCanonCommitRecord);
    },

    async updateChronicleStateByChronicleId(chronicleId, input) {
      const rows = await executor
        .update(chronicleStates)
        .set({
          currentPerspectiveId: input.currentPerspectiveId,
          currentSceneInstanceId: input.currentSceneInstanceId,
          progressIndex: input.progressIndex,
          endingLocked: input.endingLocked,
          summaryJson: input.summary,
          updatedAt: new Date()
        })
        .where(eq(chronicleStates.chronicleId, chronicleId))
        .returning();

      return rows[0]
        ? toChronicleStateRecord(mapChronicleStateRow(rows[0]))
        : null;
    },

    async updatePerspectiveRunById(perspectiveRunId, input) {
      const rows = await executor
        .update(perspectiveRuns)
        .set({
          status: input.status,
          entryCount: input.entryCount,
          knowledgeScore: input.knowledgeScore,
          lastSceneInstanceId: input.lastSceneInstanceId,
          metadataJson: input.metadata,
          updatedAt: new Date()
        })
        .where(eq(perspectiveRuns.id, perspectiveRunId))
        .returning();

      return rows[0]
        ? toPerspectiveRunRecord(mapPerspectiveRunRow(rows[0]))
        : null;
    },

    async appendRuntimeEvent(input: RuntimeCommitEventInput) {
      const rows = await executor
        .insert(eventLog)
        .values({
          chronicleId: input.chronicleId,
          eventType: input.eventType,
          eventTs: input.eventTs ? new Date(input.eventTs) : new Date(),
          causedByType: input.causedByType ?? null,
          causedById: input.causedById ?? null,
          payloadJson: input.payload
        })
        .returning();

      return toRuntimeEventRecord(mapEventLogRow(rows[0]));
    }
  };

  return store;
}

export function createDatabaseRuntimeCommitStore(): RuntimeCommitStore {
  return createRuntimeCommitStore(
    db,
    async (operation: (store: RuntimeCommitStore) => Promise<unknown>) =>
      db.transaction(async (tx) =>
        operation(createRuntimeCommitStore(tx as RuntimeDbExecutor))
      )
  );
}

export function createDatabaseRuntimeCommitPipeline(): RuntimeCommitPipelineService {
  return createRuntimeCommitPipeline(createDatabaseRuntimeCommitStore());
}

export async function listRuntimeEventsForChronicle(
  chronicleId: string
): Promise<RuntimeCommitEventRecord[]> {
  const rows = await db
    .select()
    .from(eventLog)
    .where(eq(eventLog.chronicleId, chronicleId))
    .orderBy(asc(eventLog.eventTs), asc(eventLog.createdAt));

  return rows.map(mapEventLogRow).map(toRuntimeEventRecord);
}
