import type {
  EndingEligibility,
  PlanningContext,
  RevealEligibility,
  SceneConstraint,
  SceneContinuityFact,
  SceneGoal,
  SceneIntent,
  SceneKind
} from "@/core/planner/contracts";

import type { MilestoneSelection } from "./milestone-selector";
import type { PacingEvaluation } from "./pacing-evaluator";

export interface SceneSelection {
  readonly sceneKind: SceneKind;
  readonly sceneGoal: SceneGoal;
  readonly intent: SceneIntent;
  readonly constraints: SceneConstraint[];
  readonly continuityFacts: SceneContinuityFact[];
  readonly notes: string[];
}

function chooseSceneKind(
  context: PlanningContext,
  milestoneSelection: MilestoneSelection,
  revealEligibility: RevealEligibility,
  endingEligibility: EndingEligibility
): { kind: SceneKind; goal: SceneGoal; note: string } {
  if (
    endingEligibility.status === "eligible" &&
    !context.chronicle.endingLocked &&
    context.chronicle.sceneCount >= 3
  ) {
    return {
      kind: "ending",
      goal: "deliver-ending",
      note: "Ending candidate is eligible and chronology is ready for closure."
    };
  }

  if (
    revealEligibility.allowed.length > 0 &&
    context.pacing.snapshot.cadence.scenesSinceLastMajorReveal >= 1
  ) {
    return {
      kind: "revelation",
      goal: "surface-reveal",
      note: "At least one reveal is currently legal and pacing allows reveal delivery."
    };
  }

  if (milestoneSelection.targetMilestone) {
    return {
      kind: "development",
      goal: "advance-arc",
      note: "A milestone target exists and should be advanced."
    };
  }

  return {
    kind: "setup",
    goal: "stabilize-continuity",
    note: "No stronger target available; using a continuity-safe setup scene."
  };
}

function buildConstraints(
  milestoneSelection: MilestoneSelection,
  revealEligibility: RevealEligibility,
  pacingEvaluation: PacingEvaluation
): SceneConstraint[] {
  const constraints: SceneConstraint[] = [
    {
      constraintKey: "constraint:preserve-authored-truth",
      description:
        "Scene output must respect authored canon and approved planner structure.",
      source: "authoring",
      required: true
    }
  ];

  if (milestoneSelection.targetMilestone) {
    constraints.push({
      constraintKey: `constraint:milestone:${milestoneSelection.targetMilestone.milestoneKey}`,
      description:
        "Scene should create progress toward the targeted milestone.",
      source: "authoring",
      required: milestoneSelection.targetMilestone.required
    });
  }

  if (revealEligibility.blocked.length > 0) {
    constraints.push({
      constraintKey: "constraint:blocked-reveals",
      description:
        "Blocked reveals must not be surfaced in this scene package.",
      source: "continuity",
      required: true
    });
  }

  if (
    pacingEvaluation.hints.some(
      (hint) => hint.recommendation === "decrease-intensity"
    )
  ) {
    constraints.push({
      constraintKey: "constraint:cadence-relief",
      description:
        "Scene should avoid further intensity escalation due to pacing pressure.",
      source: "pacing",
      required: false
    });
  }

  return constraints;
}

function buildContinuityFacts(context: PlanningContext): SceneContinuityFact[] {
  return context.continuityFacts.slice(0, 5).map((fact, index) => ({
    factKey: `continuity:${index + 1}`,
    statement: fact,
    source: "canon",
    required: true
  }));
}

export function selectScene(
  context: PlanningContext,
  milestoneSelection: MilestoneSelection,
  revealEligibility: RevealEligibility,
  pacingEvaluation: PacingEvaluation,
  endingEligibility: EndingEligibility
): SceneSelection {
  const decision = chooseSceneKind(
    context,
    milestoneSelection,
    revealEligibility,
    endingEligibility
  );

  return {
    sceneKind: decision.kind,
    sceneGoal: decision.goal,
    intent: {
      intentKey: `intent:${decision.kind}:${decision.goal}`,
      summary: decision.note,
      targetOutcome:
        milestoneSelection.targetMilestone?.milestoneKey ??
        "maintain continuity stability"
    },
    constraints: buildConstraints(
      milestoneSelection,
      revealEligibility,
      pacingEvaluation
    ),
    continuityFacts: buildContinuityFacts(context),
    notes: [decision.note]
  };
}
