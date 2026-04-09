import type { ScenePackage } from "@/core/planner/contracts";

import { mergeGuardResults, type GuardValidationResult } from "../contracts";
import {
  validateEndingEligibilityCoherence,
  validateEndingTransitionSafety
} from "../rules";

export interface ValidateEndingEligibilityInput {
  readonly scenePackage: ScenePackage;
}

export interface ValidateEndingTransitionInput {
  readonly sceneKind: string;
  readonly hasEndingEffect: boolean;
}

export function validateEndingEligibility(
  input: ValidateEndingEligibilityInput
): GuardValidationResult {
  return validateEndingEligibilityCoherence({
    scenePackage: input.scenePackage
  });
}

export function validateEndingTransition(
  input: ValidateEndingTransitionInput
): GuardValidationResult {
  return validateEndingTransitionSafety({
    sceneKind: input.sceneKind,
    hasEndingEffect: input.hasEndingEffect
  });
}

export function validateEndingBundle(input: {
  readonly eligibility: ValidateEndingEligibilityInput;
  readonly transition?: ValidateEndingTransitionInput;
}): GuardValidationResult {
  const results = [validateEndingEligibility(input.eligibility)];

  if (input.transition) {
    results.push(validateEndingTransition(input.transition));
  }

  return mergeGuardResults("ending", results);
}
