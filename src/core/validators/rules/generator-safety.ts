import type {
  GeneratedScenePresentation,
  GeneratorSceneInput
} from "@/core/generator/contracts";

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
    fallbackAllowed: true,
    context
  };
}

export interface GeneratorSafetyValidationInput {
  readonly sceneInput: GeneratorSceneInput;
  readonly presentation: GeneratedScenePresentation;
}

export function validateGeneratorPresentationSafety(
  input: GeneratorSafetyValidationInput
): GuardValidationResult {
  const issues: GuardIssue[] = [];

  if (input.presentation.prose.trim().length === 0) {
    issues.push(
      issue(
        "generator-output-invalid",
        "Generated presentation prose is empty."
      )
    );
  }

  if (input.presentation.choices.length !== input.sceneInput.choices.length) {
    issues.push(
      issue(
        "generator-choice-mismatch",
        "Generated choice presentation count does not match structural choice count.",
        true,
        {
          expectedChoiceCount: input.sceneInput.choices.length,
          generatedChoiceCount: input.presentation.choices.length
        }
      )
    );
  }

  const approvedChoiceKeySet = new Set(
    input.sceneInput.choices.map((choice) => choice.choiceKey)
  );

  for (const generatedChoice of input.presentation.choices) {
    if (!approvedChoiceKeySet.has(generatedChoice.choiceKey)) {
      issues.push(
        issue(
          "generator-choice-mismatch",
          `Generated choice key ${generatedChoice.choiceKey} is not in the approved structural choice set.`,
          true,
          {
            choiceKey: generatedChoice.choiceKey
          }
        )
      );
    }
  }

  return createGuardResult("generator-safety", issues);
}
