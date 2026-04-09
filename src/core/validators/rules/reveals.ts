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

export interface RevealLegalityValidationInput {
  readonly revealKeysToApply: string[];
  readonly allowedRevealKeys: string[];
  readonly blockedRevealKeys: string[];
}

export function validateRevealLegality(
  input: RevealLegalityValidationInput
): GuardValidationResult {
  const issues: GuardIssue[] = [];
  const allowed = new Set(input.allowedRevealKeys);
  const blocked = new Set(input.blockedRevealKeys);

  for (const revealKey of input.revealKeysToApply) {
    if (revealKey.trim().length === 0) {
      issues.push(
        issue(
          "reveal-missing-reference",
          "Reveal effects must include non-empty reveal keys."
        )
      );
      continue;
    }

    if (blocked.has(revealKey)) {
      issues.push(
        issue(
          "reveal-blocked",
          `Reveal ${revealKey} is blocked for this scene.`,
          {
            revealKey
          }
        )
      );
    }

    if (!allowed.has(revealKey)) {
      issues.push(
        issue(
          "reveal-not-allowed",
          `Reveal ${revealKey} is not in the scene's allowed reveal set.`,
          { revealKey }
        )
      );
    }
  }

  for (const revealKey of blocked) {
    if (allowed.has(revealKey)) {
      issues.push(
        issue(
          "contradictory-reveal-sets",
          `Reveal ${revealKey} appears in both allowed and blocked sets.`,
          { revealKey }
        )
      );
    }
  }

  return createGuardResult("reveal", issues);
}
