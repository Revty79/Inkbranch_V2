import type { ScenePackage } from "@/core/planner/contracts";

import type { GuardIssue } from "../contracts";
import { createGuardResult, type GuardValidationResult } from "../contracts";

const VALID_SCENE_KINDS = new Set([
  "setup",
  "development",
  "revelation",
  "consequence",
  "transition",
  "ending"
]);

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
    fallbackAllowed: code === "missing-decision-choices",
    context
  };
}

export interface PlannerSceneValidationInput {
  readonly scenePackage: ScenePackage;
  readonly expectedChronicleId?: string;
}

export function validatePlannerScenePackageStructure(
  input: PlannerSceneValidationInput
): GuardValidationResult {
  const issues: GuardIssue[] = [];
  const scenePlan = input.scenePackage.scene;

  if (!VALID_SCENE_KINDS.has(scenePlan.sceneKind)) {
    issues.push(
      issue(
        "invalid-scene-kind",
        `Unsupported scene kind ${scenePlan.sceneKind}.`
      )
    );
  }

  if (
    input.expectedChronicleId &&
    scenePlan.chronicleId !== input.expectedChronicleId
  ) {
    issues.push(
      issue(
        "invalid-version-context",
        "Scene package chronicle context mismatch.",
        {
          expectedChronicleId: input.expectedChronicleId,
          receivedChronicleId: scenePlan.chronicleId
        }
      )
    );
  }

  if (scenePlan.decisionPackage.choices.length === 0) {
    issues.push(
      issue(
        "missing-decision-choices",
        "Planner scene package must include at least one structural choice."
      )
    );
  }

  const seenChoiceKeys = new Set<string>();
  for (const choice of scenePlan.decisionPackage.choices) {
    if (seenChoiceKeys.has(choice.choiceKey)) {
      issues.push(
        issue(
          "duplicate-choice-key",
          `Duplicate choice key ${choice.choiceKey}.`,
          {
            choiceKey: choice.choiceKey
          }
        )
      );
    }

    seenChoiceKeys.add(choice.choiceKey);
  }

  const allowedRevealKeys = new Set(
    scenePlan.allowedReveals.map((reveal) => reveal.revealKey)
  );
  const blockedRevealKeys = new Set(
    scenePlan.blockedReveals.map((reveal) => reveal.revealKey)
  );

  for (const revealKey of allowedRevealKeys) {
    if (blockedRevealKeys.has(revealKey)) {
      issues.push(
        issue(
          "contradictory-reveal-sets",
          `Reveal ${revealKey} is both allowed and blocked.`,
          { revealKey }
        )
      );
    }
  }

  for (const fact of scenePlan.continuityFacts) {
    if (
      fact.factKey.trim().length === 0 ||
      fact.statement.trim().length === 0
    ) {
      issues.push(
        issue(
          "missing-continuity-fact",
          "Continuity facts must include both fact keys and statements."
        )
      );
      break;
    }
  }

  return createGuardResult("planner-scene", issues);
}
