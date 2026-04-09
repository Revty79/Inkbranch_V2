import type {
  RuntimePerspectiveRunRecord,
  UpdatePerspectiveRunInput
} from "@/core/runtime/contracts";

export interface PerspectiveInstantiationProjectionInput {
  readonly previousRun: RuntimePerspectiveRunRecord;
  readonly sceneInstanceId: string;
}

export interface PerspectiveResolutionProjectionInput {
  readonly previousRun: RuntimePerspectiveRunRecord;
  readonly sceneInstanceId: string;
  readonly selectedChoiceKey: string;
  readonly knowledgeDelta: number;
  readonly endingLocked: boolean;
}

export function projectPerspectiveRunForInstantiation(
  input: PerspectiveInstantiationProjectionInput
): UpdatePerspectiveRunInput {
  return {
    lastSceneInstanceId: input.sceneInstanceId,
    entryCount: input.previousRun.entryCount + 1,
    metadata: {
      ...input.previousRun.metadata,
      lastSceneInstanceId: input.sceneInstanceId
    }
  };
}

export function projectPerspectiveRunForResolution(
  input: PerspectiveResolutionProjectionInput
): UpdatePerspectiveRunInput {
  return {
    lastSceneInstanceId: input.sceneInstanceId,
    knowledgeScore: input.previousRun.knowledgeScore + input.knowledgeDelta,
    status: input.endingLocked ? "completed" : input.previousRun.status,
    metadata: {
      ...input.previousRun.metadata,
      lastSceneInstanceId: input.sceneInstanceId,
      lastResolvedChoiceKey: input.selectedChoiceKey
    }
  };
}
