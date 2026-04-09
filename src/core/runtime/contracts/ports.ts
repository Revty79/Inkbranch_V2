import type { ScenePackage } from "@/core/planner/contracts";

import type { RuntimeCanonCommitType, RuntimeKnowledgeStatus } from "./effects";
import type {
  RuntimeCommitEventInput,
  RuntimeCommitEventRecord
} from "./events";
import type {
  RuntimeCanonCommitRecord,
  RuntimeChoiceResolutionRecord,
  RuntimeChronicleRecord,
  RuntimeChronicleStateRecord,
  RuntimeKnowledgeStateRecord,
  RuntimePerspectiveRunRecord,
  RuntimeSceneChoiceRecord,
  RuntimeSceneInstanceRecord
} from "./records";

export interface CreateRuntimeSceneChoiceInput {
  readonly choiceKey: string;
  readonly label: string;
  readonly intent: string | null;
  readonly sortOrder: number;
  readonly plannerEffects: Record<string, unknown>;
  readonly isEnabled: boolean;
}

export interface CreateRuntimeSceneInput {
  readonly chronicleId: string;
  readonly perspectiveRunId: string;
  readonly plannerCycle: number;
  readonly sceneKind: string;
  readonly sceneGoal: string;
  readonly plannerPayload: Record<string, unknown>;
  readonly generatorPayload: Record<string, unknown>;
  readonly status: "planned" | "rendered" | "resolved" | "superseded";
  readonly choices: CreateRuntimeSceneChoiceInput[];
}

export interface CreateRuntimeChoiceResolutionInput {
  readonly sceneChoiceId: string;
  readonly chronicleId: string;
  readonly resolutionType:
    | "selected"
    | "skipped"
    | "auto_selected"
    | "rejected";
  readonly resolutionPayload: Record<string, unknown>;
}

export interface UpsertKnowledgeEntryInput {
  readonly chronicleId: string;
  readonly perspectiveId: string | null;
  readonly knowledgeKey: string;
  readonly knowledgeStatus: RuntimeKnowledgeStatus;
  readonly sourceSceneInstanceId: string | null;
  readonly metadata: Record<string, unknown>;
}

export interface CreateCanonCommitInput {
  readonly chronicleId: string;
  readonly canonEntryId: string | null;
  readonly commitType: RuntimeCanonCommitType;
  readonly commitKey: string;
  readonly commitValue: Record<string, unknown>;
  readonly sourceEventId: string | null;
}

export interface UpdateChronicleStateInput {
  readonly currentPerspectiveId?: string | null;
  readonly currentSceneInstanceId?: string | null;
  readonly progressIndex?: number;
  readonly endingLocked?: boolean;
  readonly summary?: Record<string, unknown>;
}

export interface UpdatePerspectiveRunInput {
  readonly status?: "active" | "paused" | "completed";
  readonly entryCount?: number;
  readonly knowledgeScore?: number;
  readonly lastSceneInstanceId?: string | null;
  readonly metadata?: Record<string, unknown>;
}

export interface RuntimeCommitStore {
  runInTransaction<T>(
    operation: (store: RuntimeCommitStore) => Promise<T>
  ): Promise<T>;
  getChronicleById(chronicleId: string): Promise<RuntimeChronicleRecord | null>;
  getChronicleStateByChronicleId(
    chronicleId: string
  ): Promise<RuntimeChronicleStateRecord | null>;
  createChronicleState(
    chronicleId: string,
    perspectiveId: string,
    sceneInstanceId: string
  ): Promise<RuntimeChronicleStateRecord>;
  countSceneInstancesByChronicleId(chronicleId: string): Promise<number>;
  getPerspectiveRunById(
    perspectiveRunId: string
  ): Promise<RuntimePerspectiveRunRecord | null>;
  getSceneInstanceById(
    sceneInstanceId: string
  ): Promise<RuntimeSceneInstanceRecord | null>;
  getSceneChoiceById(
    sceneChoiceId: string
  ): Promise<RuntimeSceneChoiceRecord | null>;
  getChoiceResolutionBySceneChoiceId(
    sceneChoiceId: string
  ): Promise<RuntimeChoiceResolutionRecord | null>;
  createSceneInstanceWithChoices(input: CreateRuntimeSceneInput): Promise<{
    sceneInstance: RuntimeSceneInstanceRecord;
    sceneChoices: RuntimeSceneChoiceRecord[];
  }>;
  updateSceneInstanceStatus(
    sceneInstanceId: string,
    status: "planned" | "rendered" | "resolved" | "superseded"
  ): Promise<RuntimeSceneInstanceRecord | null>;
  createChoiceResolution(
    input: CreateRuntimeChoiceResolutionInput
  ): Promise<RuntimeChoiceResolutionRecord>;
  upsertKnowledgeEntry(
    input: UpsertKnowledgeEntryInput
  ): Promise<RuntimeKnowledgeStateRecord>;
  getKnowledgeEntriesByChronicleAndPerspective(
    chronicleId: string,
    perspectiveId: string | null
  ): Promise<RuntimeKnowledgeStateRecord[]>;
  createCanonCommit(
    input: CreateCanonCommitInput
  ): Promise<RuntimeCanonCommitRecord>;
  getCanonCommitsByChronicleId(
    chronicleId: string
  ): Promise<RuntimeCanonCommitRecord[]>;
  updateChronicleStateByChronicleId(
    chronicleId: string,
    input: UpdateChronicleStateInput
  ): Promise<RuntimeChronicleStateRecord | null>;
  updatePerspectiveRunById(
    perspectiveRunId: string,
    input: UpdatePerspectiveRunInput
  ): Promise<RuntimePerspectiveRunRecord | null>;
  appendRuntimeEvent(
    input: RuntimeCommitEventInput
  ): Promise<RuntimeCommitEventRecord>;
}

export interface RuntimeScenePlanPayload {
  readonly plannerStatus: "success" | "fallback";
  readonly scenePackage: ScenePackage;
  readonly plannerDiagnostics: {
    readonly requestId: string;
    readonly notes: string[];
  };
}
