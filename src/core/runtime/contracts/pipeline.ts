import type { ChoiceEffectHint } from "@/core/planner/contracts";

import type {
  RuntimeCanonCommitRecord,
  RuntimeChoiceResolutionRecord,
  RuntimeChronicleStateRecord,
  RuntimeKnowledgeStateRecord,
  RuntimePerspectiveRunRecord,
  RuntimeSceneChoiceRecord,
  RuntimeSceneInstanceRecord
} from "./records";
import type { RuntimeScenePlanPayload } from "./ports";
import type { RuntimeCommitDiagnostics, RuntimeCommitIssue } from "./issues";
import type { RuntimeCommitEventRecord } from "./events";

export interface InstantiateSceneInput {
  readonly requestId: string;
  readonly chronicleId: string;
  readonly perspectiveRunId: string;
  readonly plannerResult: RuntimeScenePlanPayload;
  readonly plannerCycle?: number;
}

export interface InstantiatedScenePackage {
  readonly sceneInstance: RuntimeSceneInstanceRecord;
  readonly sceneChoices: RuntimeSceneChoiceRecord[];
  readonly chronicleState: RuntimeChronicleStateRecord;
  readonly perspectiveRun: RuntimePerspectiveRunRecord;
  readonly events: RuntimeCommitEventRecord[];
}

export interface InstantiateSceneSuccessResult {
  readonly status: "success";
  readonly data: InstantiatedScenePackage;
  readonly diagnostics: RuntimeCommitDiagnostics;
}

export interface InstantiateSceneFailureResult {
  readonly status: "failure";
  readonly diagnostics: RuntimeCommitDiagnostics;
}

export type InstantiateSceneResult =
  | InstantiateSceneSuccessResult
  | InstantiateSceneFailureResult;

export interface ResolveChoiceInput {
  readonly requestId: string;
  readonly chronicleId: string;
  readonly sceneInstanceId: string;
  readonly sceneChoiceId: string;
}

export interface KnowledgeUpdateResult {
  readonly updatedEntries: RuntimeKnowledgeStateRecord[];
  readonly discoveredKeys: string[];
}

export interface CanonCommitResult {
  readonly commits: RuntimeCanonCommitRecord[];
}

export interface ChronicleProjectionResult {
  readonly chronicleState: RuntimeChronicleStateRecord;
}

export interface PerspectiveProjectionResult {
  readonly perspectiveRun: RuntimePerspectiveRunRecord;
}

export interface ResolveChoiceData {
  readonly resolution: RuntimeChoiceResolutionRecord;
  readonly selectedChoice: RuntimeSceneChoiceRecord;
  readonly selectedChoiceEffects: ChoiceEffectHint[];
  readonly knowledgeUpdates: RuntimeKnowledgeStateRecord[];
  readonly canonCommits: RuntimeCanonCommitRecord[];
  readonly chronicleState: RuntimeChronicleStateRecord;
  readonly perspectiveRun: RuntimePerspectiveRunRecord;
  readonly events: RuntimeCommitEventRecord[];
}

export interface ResolveChoiceSuccessResult {
  readonly status: "success";
  readonly data: ResolveChoiceData;
  readonly diagnostics: RuntimeCommitDiagnostics;
}

export interface ResolveChoiceFailureResult {
  readonly status: "failure";
  readonly diagnostics: RuntimeCommitDiagnostics;
}

export type ResolveChoiceResult =
  | ResolveChoiceSuccessResult
  | ResolveChoiceFailureResult;

export interface RuntimeCommitIssueContext {
  readonly issue: RuntimeCommitIssue;
  readonly diagnostics: RuntimeCommitDiagnostics;
}
