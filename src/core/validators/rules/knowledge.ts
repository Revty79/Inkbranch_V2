import type {
  RuntimeKnowledgeEffect,
  RuntimeKnowledgeStateRecord
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

const KNOWLEDGE_STATUS_RANK: Record<string, number> = {
  hidden: 0,
  discovered: 1,
  confirmed: 2,
  invalidated: 3
};

function isKnowledgeRegression(
  previousStatus: string,
  nextStatus: string
): boolean {
  const previousRank = KNOWLEDGE_STATUS_RANK[previousStatus];
  const nextRank = KNOWLEDGE_STATUS_RANK[nextStatus];

  if (previousRank === undefined || nextRank === undefined) {
    return false;
  }

  if (previousStatus === "invalidated" && nextStatus !== "invalidated") {
    return true;
  }

  return nextRank < previousRank;
}

export interface KnowledgeValidationInput {
  readonly effects: RuntimeKnowledgeEffect[];
  readonly existingEntries: RuntimeKnowledgeStateRecord[];
}

export function validateKnowledgeEffects(
  input: KnowledgeValidationInput
): GuardValidationResult {
  const issues: GuardIssue[] = [];
  const existingByKey = new Map(
    input.existingEntries.map((entry) => [entry.knowledgeKey, entry])
  );

  for (const effect of input.effects) {
    if (effect.knowledgeKey.trim().length === 0) {
      issues.push(
        issue(
          "invalid-knowledge-key",
          "Knowledge effect keys must be non-empty.",
          {
            sourceEffectKey: effect.sourceEffectKey
          }
        )
      );
      continue;
    }

    const existing = existingByKey.get(effect.knowledgeKey);
    if (
      existing &&
      isKnowledgeRegression(existing.knowledgeStatus, effect.knowledgeStatus)
    ) {
      issues.push(
        issue(
          "knowledge-status-regression",
          `Knowledge key ${effect.knowledgeKey} regresses from ${existing.knowledgeStatus} to ${effect.knowledgeStatus}.`,
          {
            knowledgeKey: effect.knowledgeKey
          }
        )
      );
    }
  }

  return createGuardResult("knowledge", issues);
}
