import type { ScenePackage } from "@/core/planner/contracts";
import type {
  RuntimeCanonCommitEffect,
  RuntimeCanonCommitRecord,
  RuntimeChronicleStateRecord,
  RuntimeKnowledgeEffect,
  RuntimeKnowledgeStateRecord
} from "@/core/runtime/contracts";

import { mergeGuardResults, type GuardValidationResult } from "../contracts";
import {
  validateCanonCommitEffects,
  validateChoiceResolutionTransition,
  validateChronicleProjection,
  validateKnowledgeEffects,
  validateRuntimeInstantiation
} from "../rules";

export interface ValidateRuntimeInstantiationInput {
  readonly chronicleId: string;
  readonly perspectiveRunChronicleId: string;
  readonly scenePackage: ScenePackage;
}

export interface ValidateChoiceResolutionInput {
  readonly sceneStatus: string;
  readonly sceneChronicleId: string;
  readonly requestedChronicleId: string;
  readonly choiceEnabled: boolean;
  readonly alreadyResolved: boolean;
}

export interface ValidateKnowledgeUpdateInput {
  readonly effects: RuntimeKnowledgeEffect[];
  readonly existingEntries: RuntimeKnowledgeStateRecord[];
}

export interface ValidateCanonCommitInput {
  readonly effects: RuntimeCanonCommitEffect[];
  readonly existingCommits: RuntimeCanonCommitRecord[];
}

export interface ValidateChronicleProjectionInput {
  readonly chronicleId: string;
  readonly projection: RuntimeChronicleStateRecord;
  readonly currentSceneChronicleId?: string | null;
  readonly currentPerspectiveId?: string | null;
}

export function validateRuntimeInstantiationInput(
  input: ValidateRuntimeInstantiationInput
): GuardValidationResult {
  return validateRuntimeInstantiation({
    chronicleId: input.chronicleId,
    perspectiveRunChronicleId: input.perspectiveRunChronicleId,
    scenePackage: input.scenePackage
  });
}

export function validateChoiceResolutionInput(
  input: ValidateChoiceResolutionInput
): GuardValidationResult {
  return validateChoiceResolutionTransition({
    sceneStatus: input.sceneStatus,
    sceneChronicleId: input.sceneChronicleId,
    requestedChronicleId: input.requestedChronicleId,
    choiceEnabled: input.choiceEnabled,
    alreadyResolved: input.alreadyResolved
  });
}

export function validateKnowledgeUpdateInput(
  input: ValidateKnowledgeUpdateInput
): GuardValidationResult {
  return validateKnowledgeEffects({
    effects: input.effects,
    existingEntries: input.existingEntries
  });
}

export function validateCanonCommitInput(
  input: ValidateCanonCommitInput
): GuardValidationResult {
  return validateCanonCommitEffects({
    effects: input.effects,
    existingCommits: input.existingCommits
  });
}

export function validateChronicleProjectionInput(
  input: ValidateChronicleProjectionInput
): GuardValidationResult {
  return validateChronicleProjection({
    chronicleId: input.chronicleId,
    projection: input.projection,
    currentSceneChronicleId: input.currentSceneChronicleId,
    currentPerspectiveId: input.currentPerspectiveId
  });
}

export function validateRuntimeResolutionBundle(input: {
  readonly choiceValidation: ValidateChoiceResolutionInput;
  readonly knowledgeValidation: ValidateKnowledgeUpdateInput;
  readonly canonValidation: ValidateCanonCommitInput;
}): GuardValidationResult {
  const choiceResult = validateChoiceResolutionInput(input.choiceValidation);
  const knowledgeResult = validateKnowledgeUpdateInput(
    input.knowledgeValidation
  );
  const canonResult = validateCanonCommitInput(input.canonValidation);

  return mergeGuardResults("choice-resolution", [
    choiceResult,
    knowledgeResult,
    canonResult
  ]);
}
