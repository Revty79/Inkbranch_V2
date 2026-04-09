import type { ScenePackage } from "@/core/planner/contracts";

import type { GuardIssue } from "../contracts";
import { createGuardResult, type GuardValidationResult } from "../contracts";

function issue(
  code: GuardIssue["code"],
  message: string,
  blocking = true,
  context?: Record<string, unknown>
): GuardIssue {
  return {
    code,
    severity: blocking ? "error" : "warning",
    message,
    blocking,
    fallbackAllowed: !blocking,
    context
  };
}

export interface EndingEligibilityValidationInput {
  readonly scenePackage: ScenePackage;
}

export interface EndingTransitionValidationInput {
  readonly sceneKind: string;
  readonly hasEndingEffect: boolean;
}

export function validateEndingEligibilityCoherence(
  input: EndingEligibilityValidationInput
): GuardValidationResult {
  const issues: GuardIssue[] = [];
  const scene = input.scenePackage.scene;
  const endingStatus = scene.endingEligibility.status;
  const eligibleCount = scene.endingEligibility.eligibleEndings.length;

  if (scene.sceneKind === "ending" && eligibleCount === 0) {
    issues.push(
      issue(
        "ending-not-eligible",
        "Ending scenes must provide at least one eligible ending candidate."
      )
    );
  }

  if (endingStatus === "eligible" && eligibleCount === 0) {
    issues.push(
      issue(
        "invalid-ending-eligibility",
        "Ending eligibility status is `eligible` but no eligible endings were returned."
      )
    );
  }

  if (endingStatus === "none-eligible" && eligibleCount > 0) {
    issues.push(
      issue(
        "invalid-ending-eligibility",
        "Ending eligibility status is `none-eligible` despite eligible ending candidates."
      )
    );
  }

  return createGuardResult("ending", issues);
}

export function validateEndingTransitionSafety(
  input: EndingTransitionValidationInput
): GuardValidationResult {
  const issues: GuardIssue[] = [];

  if (input.sceneKind === "ending" && !input.hasEndingEffect) {
    issues.push(
      issue(
        "ending-transition-invalid",
        "Ending scenes must resolve with at least one ending effect hint."
      )
    );
  }

  return createGuardResult("ending", issues);
}
