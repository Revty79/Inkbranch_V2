import type { GuardIssue } from "../contracts";
import { createGuardResult, type GuardValidationResult } from "../contracts";

function issue(
  code: GuardIssue["code"],
  message: string,
  context?: Record<string, unknown>
): GuardIssue {
  return {
    code,
    severity: "error",
    message,
    blocking: true,
    fallbackAllowed: false,
    context
  };
}

export interface ChoiceResolutionValidationInput {
  readonly sceneStatus: string;
  readonly sceneChronicleId: string;
  readonly requestedChronicleId: string;
  readonly choiceEnabled: boolean;
  readonly alreadyResolved: boolean;
}

const RESOLVABLE_SCENE_STATUSES = new Set(["planned", "rendered"]);

export function validateChoiceResolutionTransition(
  input: ChoiceResolutionValidationInput
): GuardValidationResult {
  const issues: GuardIssue[] = [];

  if (input.sceneChronicleId !== input.requestedChronicleId) {
    issues.push(
      issue(
        "invalid-version-context",
        "Scene chronicle and requested chronicle do not match for resolution.",
        {
          sceneChronicleId: input.sceneChronicleId,
          requestedChronicleId: input.requestedChronicleId
        }
      )
    );
  }

  if (!RESOLVABLE_SCENE_STATUSES.has(input.sceneStatus)) {
    issues.push(
      issue(
        "scene-status-not-resolvable",
        `Scene status ${input.sceneStatus} is not resolvable.`
      )
    );
  }

  if (!input.choiceEnabled) {
    issues.push(
      issue(
        "choice-disabled",
        "Disabled scene choices cannot be resolved in runtime transitions."
      )
    );
  }

  if (input.alreadyResolved) {
    issues.push(
      issue(
        "choice-already-resolved",
        "Scene choice already has a committed resolution."
      )
    );
  }

  return createGuardResult("choice-resolution", issues);
}
