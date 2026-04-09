import type {
  RuntimeCanonCommitEffect,
  RuntimeCanonCommitRecord
} from "@/core/runtime/contracts";

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

function toCanonicalValue(value: Record<string, unknown>): string {
  return JSON.stringify(value, Object.keys(value).sort());
}

export interface CanonCommitValidationInput {
  readonly effects: RuntimeCanonCommitEffect[];
  readonly existingCommits: RuntimeCanonCommitRecord[];
}

export function validateCanonCommitEffects(
  input: CanonCommitValidationInput
): GuardValidationResult {
  const issues: GuardIssue[] = [];
  const seenEffectKeys = new Map<string, string>();
  const existingByKey = new Map(
    input.existingCommits.map((commit) => [
      commit.commitKey,
      toCanonicalValue(commit.commitValue)
    ])
  );

  for (const effect of input.effects) {
    const commitKey = effect.commitKey.trim();

    if (commitKey.length === 0) {
      issues.push(
        issue(
          "invalid-canon-commit-key",
          "Canon commit effects must include non-empty commit keys."
        )
      );
      continue;
    }

    const canonicalValue = toCanonicalValue(effect.commitValue);
    const seenValue = seenEffectKeys.get(commitKey);
    if (seenValue && seenValue !== canonicalValue) {
      issues.push(
        issue(
          "canon-commit-contradiction",
          `Canon commit key ${commitKey} appears with conflicting values in a single transition.`,
          { commitKey }
        )
      );
    }

    seenEffectKeys.set(commitKey, canonicalValue);

    const existingValue = existingByKey.get(commitKey);
    if (existingValue && existingValue !== canonicalValue) {
      issues.push(
        issue(
          "canon-commit-contradiction",
          `Canon commit key ${commitKey} conflicts with previously committed runtime truth.`,
          { commitKey }
        )
      );
    }
  }

  return createGuardResult("canon-commit", issues);
}
