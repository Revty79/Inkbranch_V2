import type {
  RuntimeChronicleStateRecord,
  RuntimeCommitStore,
  RuntimeProjectionHints
} from "@/core/runtime/contracts";
import {
  projectChronicleStateForInstantiation,
  projectChronicleStateForResolution
} from "@/core/runtime/projections";

export interface ChronicleInstantiationRefreshInput {
  readonly chronicleId: string;
  readonly perspectiveId: string;
  readonly sceneInstanceId: string;
  readonly plannerCycle: number;
  readonly plannerRequestId: string;
}

export interface ChronicleResolutionRefreshInput {
  readonly chronicleId: string;
  readonly perspectiveId: string;
  readonly sceneInstanceId: string;
  readonly selectedChoiceId: string;
  readonly selectedChoiceKey: string;
  readonly selectedChoiceLabel: string;
  readonly hints: RuntimeProjectionHints;
}

export async function refreshChronicleStateForInstantiation(
  store: RuntimeCommitStore,
  input: ChronicleInstantiationRefreshInput
): Promise<RuntimeChronicleStateRecord | null> {
  const existingState = await store.getChronicleStateByChronicleId(
    input.chronicleId
  );

  if (!existingState) {
    return store.createChronicleState(
      input.chronicleId,
      input.perspectiveId,
      input.sceneInstanceId
    );
  }

  const update = projectChronicleStateForInstantiation({
    previousSummary: existingState.summary,
    perspectiveId: input.perspectiveId,
    sceneInstanceId: input.sceneInstanceId,
    plannerCycle: input.plannerCycle,
    plannerRequestId: input.plannerRequestId
  });

  return store.updateChronicleStateByChronicleId(input.chronicleId, update);
}

export async function refreshChronicleStateForResolution(
  store: RuntimeCommitStore,
  input: ChronicleResolutionRefreshInput
): Promise<RuntimeChronicleStateRecord | null> {
  const existingState = await store.getChronicleStateByChronicleId(
    input.chronicleId
  );

  if (!existingState) {
    return null;
  }

  const update = projectChronicleStateForResolution({
    previousSummary: existingState.summary,
    perspectiveId: input.perspectiveId,
    sceneInstanceId: input.sceneInstanceId,
    selectedChoiceId: input.selectedChoiceId,
    selectedChoiceKey: input.selectedChoiceKey,
    selectedChoiceLabel: input.selectedChoiceLabel,
    currentProgressIndex: existingState.progressIndex,
    hints: input.hints
  });

  return store.updateChronicleStateByChronicleId(input.chronicleId, update);
}
