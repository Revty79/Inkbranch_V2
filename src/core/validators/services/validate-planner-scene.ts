import type { ScenePackage } from "@/core/planner/contracts";

import { mergeGuardResults, type GuardValidationResult } from "../contracts";
import {
  validateEndingEligibilityCoherence,
  validatePlannerScenePackageStructure
} from "../rules";

export interface ValidatePlannerSceneInput {
  readonly scenePackage: ScenePackage;
  readonly expectedChronicleId?: string;
}

export function validatePlannerScenePackage(
  input: ValidatePlannerSceneInput
): GuardValidationResult {
  const structuralResult = validatePlannerScenePackageStructure({
    scenePackage: input.scenePackage,
    expectedChronicleId: input.expectedChronicleId
  });
  const endingResult = validateEndingEligibilityCoherence({
    scenePackage: input.scenePackage
  });

  return mergeGuardResults("planner-scene", [structuralResult, endingResult]);
}
