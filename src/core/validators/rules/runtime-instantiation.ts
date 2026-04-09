import type { ScenePackage } from "@/core/planner/contracts";

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

export interface RuntimeInstantiationValidationInput {
  readonly chronicleId: string;
  readonly perspectiveRunChronicleId: string;
  readonly scenePackage: ScenePackage;
}

export function validateRuntimeInstantiation(
  input: RuntimeInstantiationValidationInput
): GuardValidationResult {
  const issues: GuardIssue[] = [];
  const scene = input.scenePackage.scene;

  if (input.perspectiveRunChronicleId !== input.chronicleId) {
    issues.push(
      issue(
        "invalid-perspective-run",
        "Perspective run does not belong to the target chronicle.",
        {
          expectedChronicleId: input.chronicleId,
          perspectiveRunChronicleId: input.perspectiveRunChronicleId
        }
      )
    );
  }

  if (scene.chronicleId !== input.chronicleId) {
    issues.push(
      issue(
        "invalid-version-context",
        "Scene package chronicle context does not match runtime chronicle.",
        {
          expectedChronicleId: input.chronicleId,
          scenePackageChronicleId: scene.chronicleId
        }
      )
    );
  }

  if (scene.decisionPackage.choices.length === 0) {
    issues.push(
      issue(
        "missing-decision-choices",
        "Runtime instantiation requires at least one structural choice."
      )
    );
  }

  if (
    scene.decisionPackage.defaultChoiceKey &&
    !scene.decisionPackage.choices.some(
      (choice) => choice.choiceKey === scene.decisionPackage.defaultChoiceKey
    )
  ) {
    issues.push(
      issue(
        "choice-not-resolvable",
        "Scene package default choice key is not present in structural choices.",
        {
          defaultChoiceKey: scene.decisionPackage.defaultChoiceKey
        }
      )
    );
  }

  return createGuardResult("runtime-instantiation", issues);
}
