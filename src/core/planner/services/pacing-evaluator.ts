import type {
  PacingDecisionHint,
  PacingPressure,
  PacingSnapshot,
  PlanningContext
} from "@/core/planner/contracts";

import type { MilestoneSelection } from "./milestone-selector";

export interface PacingEvaluation {
  readonly snapshot: PacingSnapshot;
  readonly hints: PacingDecisionHint[];
}

function createMilestonePressure(
  selection: MilestoneSelection
): PacingPressure | null {
  const requiredUnresolved = selection.unresolvedMilestones.filter(
    (milestone) => milestone.required
  );

  if (requiredUnresolved.length === 0) {
    return null;
  }

  const firstRequired = requiredUnresolved[0];

  return {
    pressureKey: `pressure:milestone:${firstRequired.milestoneKey}`,
    level: requiredUnresolved.length > 2 ? "high" : "moderate",
    source: "milestone",
    reason: "Required milestones remain unresolved.",
    relatedMilestoneId: firstRequired.milestoneId
  };
}

export function evaluatePacing(
  context: PlanningContext,
  selection: MilestoneSelection
): PacingEvaluation {
  const baselineSnapshot = context.pacing.snapshot;
  const pressures = [...baselineSnapshot.pressureLevels];

  const milestonePressure = createMilestonePressure(selection);

  if (milestonePressure) {
    pressures.push(milestonePressure);
  }

  const hints: PacingDecisionHint[] = [];

  if (selection.targetMilestone?.required) {
    hints.push({
      hintKey: "hint:required-milestone",
      recommendation: "increase-intensity",
      reason: "Required milestone should be advanced soon."
    });
  }

  if (baselineSnapshot.cadence.consecutiveHighIntensityScenes >= 2) {
    hints.push({
      hintKey: "hint:cadence-relief",
      recommendation: "decrease-intensity",
      reason: "Recent high-intensity cadence suggests a stabilizing scene."
    });
  }

  if (hints.length === 0) {
    hints.push({
      hintKey: "hint:steady",
      recommendation: "maintain-intensity",
      reason: "No strong pacing pressure detected."
    });
  }

  return {
    snapshot: {
      ...baselineSnapshot,
      pressureLevels: pressures
    },
    hints
  };
}
