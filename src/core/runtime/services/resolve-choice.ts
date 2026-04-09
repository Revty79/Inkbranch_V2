import type { ChoiceEffectHint } from "@/core/planner/contracts";
import type {
  ResolveChoiceInput,
  RuntimeChoiceResolutionRecord,
  RuntimeCommitIssue,
  RuntimeSceneChoiceRecord,
  RuntimeSceneInstanceRecord,
  RuntimeCommitStore
} from "@/core/runtime/contracts";
import { validateChoiceResolutionInput } from "@/core/validators/services";

function isString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function toChoiceEffectHintArray(value: unknown): ChoiceEffectHint[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (typeof item !== "object" || item === null) {
      return [];
    }

    const candidate = item as Record<string, unknown>;
    const effectType = candidate.effectType;
    const effectKey = candidate.effectKey;
    const summary = candidate.summary;

    if (
      !isString(effectKey) ||
      !isString(summary) ||
      (effectType !== "milestone" &&
        effectType !== "reveal" &&
        effectType !== "knowledge" &&
        effectType !== "relationship" &&
        effectType !== "ending")
    ) {
      return [];
    }

    return [
      {
        effectKey,
        effectType,
        summary,
        relatedMilestoneId: isString(candidate.relatedMilestoneId)
          ? candidate.relatedMilestoneId
          : undefined,
        relatedRevealRuleId: isString(candidate.relatedRevealRuleId)
          ? candidate.relatedRevealRuleId
          : undefined,
        relatedEndingRuleId: isString(candidate.relatedEndingRuleId)
          ? candidate.relatedEndingRuleId
          : undefined
      }
    ];
  });
}

function readChoiceEffectHints(
  choice: RuntimeSceneChoiceRecord
): ChoiceEffectHint[] {
  return toChoiceEffectHintArray(choice.plannerEffects.effectHints);
}

function issue(
  code: RuntimeCommitIssue["code"],
  message: string,
  context?: Record<string, unknown>
): RuntimeCommitIssue {
  return {
    code,
    severity: "error",
    message,
    context
  };
}

export interface ResolveChoiceServiceSuccess {
  readonly status: "success";
  readonly sceneInstance: RuntimeSceneInstanceRecord;
  readonly selectedChoice: RuntimeSceneChoiceRecord;
  readonly resolution: RuntimeChoiceResolutionRecord;
  readonly selectedChoiceEffects: ChoiceEffectHint[];
}

export interface ResolveChoiceServiceFailure {
  readonly status: "failure";
  readonly issue: RuntimeCommitIssue;
}

export type ResolveChoiceServiceResult =
  | ResolveChoiceServiceSuccess
  | ResolveChoiceServiceFailure;

export async function resolveChoiceSelection(
  store: RuntimeCommitStore,
  input: ResolveChoiceInput
): Promise<ResolveChoiceServiceResult> {
  const sceneInstance = await store.getSceneInstanceById(input.sceneInstanceId);

  if (!sceneInstance) {
    return {
      status: "failure",
      issue: issue(
        "scene-instance-not-found",
        `Scene instance ${input.sceneInstanceId} does not exist.`
      )
    };
  }

  if (sceneInstance.chronicleId !== input.chronicleId) {
    return {
      status: "failure",
      issue: issue(
        "choice-chronicle-mismatch",
        "Scene instance does not belong to the provided chronicle.",
        {
          sceneInstanceChronicleId: sceneInstance.chronicleId,
          requestedChronicleId: input.chronicleId
        }
      )
    };
  }

  const selectedChoice = await store.getSceneChoiceById(input.sceneChoiceId);

  if (!selectedChoice) {
    return {
      status: "failure",
      issue: issue(
        "scene-choice-not-found",
        `Scene choice ${input.sceneChoiceId} does not exist.`
      )
    };
  }

  if (selectedChoice.sceneInstanceId !== sceneInstance.id) {
    return {
      status: "failure",
      issue: issue(
        "choice-scene-mismatch",
        "Scene choice does not belong to the provided scene instance.",
        {
          sceneChoiceSceneInstanceId: selectedChoice.sceneInstanceId,
          requestedSceneInstanceId: sceneInstance.id
        }
      )
    };
  }

  const existingResolution = await store.getChoiceResolutionBySceneChoiceId(
    selectedChoice.id
  );
  const choiceValidation = validateChoiceResolutionInput({
    sceneStatus: sceneInstance.status,
    sceneChronicleId: sceneInstance.chronicleId,
    requestedChronicleId: input.chronicleId,
    choiceEnabled: selectedChoice.isEnabled,
    alreadyResolved: Boolean(existingResolution)
  });

  if (!choiceValidation.ok) {
    const blockingIssue = choiceValidation.issues.find(
      (validationIssue) => validationIssue.blocking
    );
    const runtimeIssueCode: RuntimeCommitIssue["code"] =
      blockingIssue?.code === "choice-disabled"
        ? "scene-choice-disabled"
        : blockingIssue?.code === "choice-already-resolved"
          ? "scene-choice-already-resolved"
          : blockingIssue?.code === "scene-status-not-resolvable"
            ? "scene-status-not-resolvable"
            : blockingIssue?.code === "invalid-version-context"
              ? "choice-chronicle-mismatch"
              : "validation-guard-failed";

    return {
      status: "failure",
      issue: issue(
        runtimeIssueCode,
        blockingIssue?.message ??
          "Choice resolution failed runtime validation guard checks.",
        blockingIssue?.context
      )
    };
  }

  const resolution = await store.createChoiceResolution({
    sceneChoiceId: selectedChoice.id,
    chronicleId: input.chronicleId,
    resolutionType: "selected",
    resolutionPayload: {
      sceneInstanceId: sceneInstance.id,
      sceneChoiceId: selectedChoice.id,
      choiceKey: selectedChoice.choiceKey,
      choiceLabel: selectedChoice.label
    }
  });

  return {
    status: "success",
    sceneInstance,
    selectedChoice,
    resolution,
    selectedChoiceEffects: readChoiceEffectHints(selectedChoice)
  };
}
