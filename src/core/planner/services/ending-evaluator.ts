import type {
  BlockedEnding,
  EndingBlockReason,
  EndingEligibility,
  PlanningContext,
  RevealEligibility
} from "@/core/planner/contracts";

import type { MilestoneSelection } from "./milestone-selector";

function readStringArray(
  source: Record<string, unknown>,
  key: string
): string[] {
  const value = source[key];

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((entry): entry is string => typeof entry === "string");
}

function evaluateEndingBlockReason(
  requiredMilestoneKeys: string[],
  completedMilestoneKeys: Set<string>,
  requiredRevealKeys: string[],
  allowedRevealKeys: Set<string>
): EndingBlockReason | null {
  const missingMilestones = requiredMilestoneKeys.filter(
    (key) => !completedMilestoneKeys.has(key)
  );

  if (missingMilestones.length > 0) {
    return {
      code: "missing-required-milestone",
      message: `Missing required milestone keys: ${missingMilestones.join(", ")}.`
    };
  }

  const missingReveals = requiredRevealKeys.filter(
    (key) => !allowedRevealKeys.has(key)
  );

  if (missingReveals.length > 0) {
    return {
      code: "missing-required-reveal",
      message: `Missing required reveal keys: ${missingReveals.join(", ")}.`
    };
  }

  return null;
}

export function evaluateEndingEligibility(
  context: PlanningContext,
  milestoneSelection: MilestoneSelection,
  revealEligibility: RevealEligibility
): EndingEligibility {
  const completedMilestoneKeys = new Set(
    milestoneSelection.completedMilestones.map(
      (milestone) => milestone.milestoneKey
    )
  );

  const allowedRevealKeys = new Set(
    revealEligibility.allowed.map((reveal) => reveal.revealKey)
  );

  const eligibleEndings: EndingEligibility["eligibleEndings"] = [];
  const blockedEndings: BlockedEnding[] = [];

  for (const candidate of context.endings.candidates.candidates) {
    const requiredMilestoneKeys = readStringArray(
      candidate.eligibilityRules,
      "requiredMilestoneKeys"
    );
    const requiredRevealKeys = readStringArray(
      candidate.eligibilityRules,
      "requiredRevealKeys"
    );

    const blockReason = evaluateEndingBlockReason(
      requiredMilestoneKeys,
      completedMilestoneKeys,
      requiredRevealKeys,
      allowedRevealKeys
    );

    if (blockReason) {
      blockedEndings.push({
        endingRuleId: candidate.endingRuleId,
        endingKey: candidate.endingKey,
        reason: blockReason
      });
      continue;
    }

    eligibleEndings.push({
      endingRuleId: candidate.endingRuleId,
      endingKey: candidate.endingKey,
      title: candidate.title,
      endingType: candidate.endingType
    });
  }

  return {
    status: eligibleEndings.length > 0 ? "eligible" : "none-eligible",
    eligibleEndings,
    blockedEndings,
    metadata: {
      totalCandidates: context.endings.candidates.candidates.length
    }
  };
}
