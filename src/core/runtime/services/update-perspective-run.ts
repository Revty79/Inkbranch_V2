import type {
  RuntimeCommitStore,
  RuntimePerspectiveRunRecord
} from "@/core/runtime/contracts";
import {
  projectPerspectiveRunForInstantiation,
  projectPerspectiveRunForResolution
} from "@/core/runtime/projections";

export interface PerspectiveInstantiationUpdateInput {
  readonly perspectiveRun: RuntimePerspectiveRunRecord;
  readonly sceneInstanceId: string;
}

export interface PerspectiveResolutionUpdateInput {
  readonly perspectiveRun: RuntimePerspectiveRunRecord;
  readonly sceneInstanceId: string;
  readonly selectedChoiceKey: string;
  readonly knowledgeDelta: number;
  readonly endingLocked: boolean;
}

export async function updatePerspectiveRunForInstantiation(
  store: RuntimeCommitStore,
  input: PerspectiveInstantiationUpdateInput
): Promise<RuntimePerspectiveRunRecord | null> {
  const update = projectPerspectiveRunForInstantiation({
    previousRun: input.perspectiveRun,
    sceneInstanceId: input.sceneInstanceId
  });

  return store.updatePerspectiveRunById(input.perspectiveRun.id, update);
}

export async function updatePerspectiveRunForResolution(
  store: RuntimeCommitStore,
  input: PerspectiveResolutionUpdateInput
): Promise<RuntimePerspectiveRunRecord | null> {
  const update = projectPerspectiveRunForResolution({
    previousRun: input.perspectiveRun,
    sceneInstanceId: input.sceneInstanceId,
    selectedChoiceKey: input.selectedChoiceKey,
    knowledgeDelta: input.knowledgeDelta,
    endingLocked: input.endingLocked
  });

  return store.updatePerspectiveRunById(input.perspectiveRun.id, update);
}
