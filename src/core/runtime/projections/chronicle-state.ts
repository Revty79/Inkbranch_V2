import type {
  RuntimeProjectionHints,
  UpdateChronicleStateInput
} from "@/core/runtime/contracts";

export interface ChronicleInstantiationProjectionInput {
  readonly previousSummary: Record<string, unknown>;
  readonly perspectiveId: string;
  readonly sceneInstanceId: string;
  readonly plannerCycle: number;
  readonly plannerRequestId: string;
}

export interface ChronicleResolutionProjectionInput {
  readonly previousSummary: Record<string, unknown>;
  readonly perspectiveId: string;
  readonly sceneInstanceId: string;
  readonly selectedChoiceId: string;
  readonly selectedChoiceKey: string;
  readonly selectedChoiceLabel: string;
  readonly currentProgressIndex: number;
  readonly hints: RuntimeProjectionHints;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((entry): entry is string => typeof entry === "string");
}

export function projectChronicleStateForInstantiation(
  input: ChronicleInstantiationProjectionInput
): UpdateChronicleStateInput {
  return {
    currentPerspectiveId: input.perspectiveId,
    currentSceneInstanceId: input.sceneInstanceId,
    summary: {
      ...input.previousSummary,
      lastPlannerRequestId: input.plannerRequestId,
      lastPlannerCycle: input.plannerCycle,
      lastSceneInstanceId: input.sceneInstanceId
    }
  };
}

export function projectChronicleStateForResolution(
  input: ChronicleResolutionProjectionInput
): UpdateChronicleStateInput {
  const existingMilestoneKeys = new Set(
    asStringArray(input.previousSummary.completedMilestoneKeys)
  );
  const existingRevealKeys = new Set(
    asStringArray(input.previousSummary.revealedKeys)
  );

  for (const milestoneKey of input.hints.completedMilestoneKeys) {
    existingMilestoneKeys.add(milestoneKey);
  }

  for (const revealKey of input.hints.revealedKeys) {
    existingRevealKeys.add(revealKey);
  }

  return {
    currentPerspectiveId: input.perspectiveId,
    currentSceneInstanceId: input.sceneInstanceId,
    progressIndex: input.currentProgressIndex + input.hints.progressDelta,
    endingLocked: input.hints.endingLocked,
    summary: {
      ...input.previousSummary,
      lastSceneInstanceId: input.sceneInstanceId,
      lastResolvedChoiceId: input.selectedChoiceId,
      lastResolvedChoiceKey: input.selectedChoiceKey,
      lastResolvedChoiceLabel: input.selectedChoiceLabel,
      completedMilestoneKeys: Array.from(existingMilestoneKeys),
      revealedKeys: Array.from(existingRevealKeys)
    }
  };
}
