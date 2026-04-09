import type { RuntimeChronicleStateRecord } from "@/core/runtime/contracts";

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

export interface ChronicleProjectionValidationInput {
  readonly chronicleId: string;
  readonly projection: RuntimeChronicleStateRecord;
  readonly currentSceneChronicleId?: string | null;
  readonly currentPerspectiveId?: string | null;
}

export function validateChronicleProjection(
  input: ChronicleProjectionValidationInput
): GuardValidationResult {
  const issues: GuardIssue[] = [];

  if (input.projection.chronicleId !== input.chronicleId) {
    issues.push(
      issue(
        "chronicle-projection-mismatch",
        "Chronicle projection record does not belong to the requested chronicle.",
        {
          expectedChronicleId: input.chronicleId,
          projectionChronicleId: input.projection.chronicleId
        }
      )
    );
  }

  if (input.projection.progressIndex < 0) {
    issues.push(
      issue(
        "chronicle-projection-mismatch",
        "Chronicle projection progress index cannot be negative."
      )
    );
  }

  if (
    input.currentSceneChronicleId &&
    input.currentSceneChronicleId !== input.chronicleId
  ) {
    issues.push(
      issue(
        "chronicle-projection-mismatch",
        "Chronicle projection points to a scene instance from another chronicle."
      )
    );
  }

  if (
    input.currentPerspectiveId &&
    input.projection.currentPerspectiveId &&
    input.projection.currentPerspectiveId !== input.currentPerspectiveId
  ) {
    issues.push(
      issue(
        "chronicle-projection-mismatch",
        "Chronicle projection perspective id mismatches the active perspective run."
      )
    );
  }

  return createGuardResult("chronicle-state", issues);
}
