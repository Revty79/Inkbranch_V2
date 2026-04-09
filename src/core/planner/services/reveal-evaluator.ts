import type {
  AllowedReveal,
  BlockedReveal,
  PlanningContext,
  RevealBlockReason,
  RevealEligibility
} from "@/core/planner/contracts";

import type { MilestoneSelection } from "./milestone-selector";

function readStringArray(value: unknown, key: string): string[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return [];
  }

  const candidate = (value as Record<string, unknown>)[key];
  if (!Array.isArray(candidate)) {
    return [];
  }

  return candidate.filter(
    (entry): entry is string => typeof entry === "string"
  );
}

function isRevealBlockedByMilestones(
  completedMilestoneKeys: Set<string>,
  requiredMilestoneKeys: string[]
): RevealBlockReason | null {
  const missing = requiredMilestoneKeys.filter(
    (milestoneKey) => !completedMilestoneKeys.has(milestoneKey)
  );

  if (missing.length === 0) {
    return null;
  }

  return {
    code: "missing-prerequisite",
    message: `Missing required milestone keys: ${missing.join(", ")}.`
  };
}

function isRevealBlockedByPacing(
  context: PlanningContext
): RevealBlockReason | null {
  const cadence = context.pacing.snapshot.cadence;
  const recentReveal = cadence.scenesSinceLastMajorReveal;

  if (recentReveal < 1) {
    return {
      code: "pacing-constraint",
      message:
        "A major reveal just occurred and cadence requires a buffer scene."
    };
  }

  return null;
}

export function evaluateRevealEligibility(
  context: PlanningContext,
  milestoneSelection: MilestoneSelection
): RevealEligibility {
  const completedMilestoneKeys = new Set(
    milestoneSelection.completedMilestones.map(
      (milestone) => milestone.milestoneKey
    )
  );

  const allowed: AllowedReveal[] = [];
  const blocked: BlockedReveal[] = [];

  for (const candidate of context.reveals.revealEligibility.candidates) {
    const requiredMilestoneKeys = readStringArray(
      candidate.gatingRules,
      "requiredMilestoneKeys"
    );

    const blockedByMilestones = isRevealBlockedByMilestones(
      completedMilestoneKeys,
      requiredMilestoneKeys
    );

    if (blockedByMilestones) {
      blocked.push({
        revealRuleId: candidate.revealRuleId,
        revealKey: candidate.revealKey,
        reason: blockedByMilestones
      });
      continue;
    }

    const blockedByPacing = isRevealBlockedByPacing(context);

    if (blockedByPacing) {
      blocked.push({
        revealRuleId: candidate.revealRuleId,
        revealKey: candidate.revealKey,
        reason: blockedByPacing
      });
      continue;
    }

    allowed.push({
      revealRuleId: candidate.revealRuleId,
      revealKey: candidate.revealKey,
      subjectType: candidate.subjectType,
      subjectId: candidate.subjectId,
      impactHints: [
        {
          impactKey: `impact:${candidate.revealKey}:knowledge`,
          impactType: "knowledge",
          summary: "May update perspective knowledge constraints."
        }
      ]
    });
  }

  return {
    candidates: context.reveals.revealEligibility.candidates,
    allowed,
    blocked,
    metadata: {
      totalCandidates: context.reveals.revealEligibility.candidates.length
    }
  };
}
