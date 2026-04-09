import type {
  GeneratedScenePresentation,
  GeneratorSceneInput
} from "@/core/generator/contracts";

import type { GuardValidationResult } from "../contracts";
import { validateGeneratorPresentationSafety } from "../rules";

export interface ValidateGeneratorOutputInput {
  readonly sceneInput: GeneratorSceneInput;
  readonly presentation: GeneratedScenePresentation;
}

export function validateGeneratorOutputSafety(
  input: ValidateGeneratorOutputInput
): GuardValidationResult {
  return validateGeneratorPresentationSafety({
    sceneInput: input.sceneInput,
    presentation: input.presentation
  });
}
