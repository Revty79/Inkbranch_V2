import type {
  InstantiateSceneInput,
  RuntimeCommitStore,
  RuntimeSceneChoiceRecord,
  RuntimeSceneInstanceRecord
} from "@/core/runtime/contracts";

export interface InstantiateSceneServiceResult {
  readonly sceneInstance: RuntimeSceneInstanceRecord;
  readonly sceneChoices: RuntimeSceneChoiceRecord[];
  readonly plannerCycle: number;
}

export async function instantiateScenePackage(
  store: RuntimeCommitStore,
  input: InstantiateSceneInput
): Promise<InstantiateSceneServiceResult> {
  const plannerCycle =
    input.plannerCycle ??
    (await store.countSceneInstancesByChronicleId(input.chronicleId)) + 1;
  const scene = input.plannerResult.scenePackage.scene;

  const created = await store.createSceneInstanceWithChoices({
    chronicleId: input.chronicleId,
    perspectiveRunId: input.perspectiveRunId,
    plannerCycle,
    sceneKind: scene.sceneKind,
    sceneGoal: scene.sceneGoal,
    plannerPayload: {
      plannerStatus: input.plannerResult.plannerStatus,
      plannerRequestId: input.plannerResult.plannerDiagnostics.requestId,
      plannerNotes: input.plannerResult.plannerDiagnostics.notes,
      scenePackage: input.plannerResult.scenePackage
    },
    generatorPayload: {
      mode: "not-generated",
      reason: "generator-integration-deferred"
    },
    status: "planned",
    choices: scene.decisionPackage.choices.map((choice) => ({
      choiceKey: choice.choiceKey,
      label: choice.optionLabelHint,
      intent: choice.intent,
      sortOrder: choice.sortOrder,
      plannerEffects: {
        effectHints: choice.effectHints
      },
      isEnabled: choice.availability === "enabled"
    }))
  });

  return {
    sceneInstance: created.sceneInstance,
    sceneChoices: created.sceneChoices,
    plannerCycle
  };
}
