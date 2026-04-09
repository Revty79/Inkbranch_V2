import type {
  ChoiceEffectHint,
  ChoiceConstraint,
  DecisionPackage,
  EndingEligibility,
  PlannedChoice,
  RevealEligibility,
  SceneGoal,
  SceneKind
} from "@/core/planner/contracts";

import type { MilestoneSelection } from "./milestone-selector";

export interface DecisionBuilderInput {
  readonly sceneKind: SceneKind;
  readonly sceneGoal: SceneGoal;
  readonly milestoneSelection: MilestoneSelection;
  readonly revealEligibility: RevealEligibility;
  readonly endingEligibility: EndingEligibility;
}

function buildMilestoneChoice(input: DecisionBuilderInput): PlannedChoice {
  const target = input.milestoneSelection.targetMilestone;

  const constraints: ChoiceConstraint[] = [];
  const effectHints: ChoiceEffectHint[] = [];

  if (target) {
    effectHints.push({
      effectKey: `effect:milestone:${target.milestoneKey}`,
      effectType: "milestone",
      relatedMilestoneId: target.milestoneId,
      summary: "Likely advances the target milestone."
    });
  }

  return {
    choiceKey: "choice:advance-milestone",
    intent: "advance-milestone",
    availability: target ? "enabled" : "disabled",
    sortOrder: 10,
    optionLabelHint: "Push toward arc progress",
    optionSummaryHint:
      "Take action that advances the current narrative milestone.",
    constraints,
    effectHints,
    disabledReason: target
      ? undefined
      : {
          code: "milestone-prerequisite-missing",
          message: "No unresolved milestone target is currently available."
        }
  };
}

function buildRevealChoice(input: DecisionBuilderInput): PlannedChoice {
  const firstAllowedReveal = input.revealEligibility.allowed[0];

  return {
    choiceKey: "choice:surface-reveal",
    intent: "surface-reveal",
    availability: firstAllowedReveal ? "enabled" : "disabled",
    sortOrder: 20,
    optionLabelHint: "Probe for hidden truth",
    optionSummaryHint: "Take a risk that could expose new information.",
    constraints: firstAllowedReveal
      ? []
      : [
          {
            constraintKey: "constraint:reveal-gated",
            description:
              "Reveal options are currently gated by planner constraints.",
            source: "continuity"
          }
        ],
    effectHints: firstAllowedReveal
      ? [
          {
            effectKey: `effect:reveal:${firstAllowedReveal.revealKey}`,
            effectType: "reveal",
            relatedRevealRuleId: firstAllowedReveal.revealRuleId,
            summary: "May expose an allowed reveal in this cycle."
          }
        ]
      : [],
    disabledReason: firstAllowedReveal
      ? undefined
      : {
          code: "reveal-gated",
          message: "No reveal is currently legal to expose."
        }
  };
}

function buildContinuityChoice(input: DecisionBuilderInput): PlannedChoice {
  const ending = input.endingEligibility.eligibleEndings[0];

  const effectHints: ChoiceEffectHint[] = ending
    ? [
        {
          effectKey: `effect:ending:${ending.endingKey}`,
          effectType: "ending",
          relatedEndingRuleId: ending.endingRuleId,
          summary: "May move the run toward an eligible ending path."
        }
      ]
    : [
        {
          effectKey: "effect:continuity:stabilize",
          effectType: "knowledge",
          summary: "Stabilizes continuity and gathers safe information."
        }
      ];

  return {
    choiceKey: "choice:stabilize-continuity",
    intent: ending ? "position-ending" : "protect-continuity",
    availability: "enabled",
    sortOrder: 30,
    optionLabelHint: ending ? "Position toward ending" : "Stabilize continuity",
    optionSummaryHint: ending
      ? "Take the safer path that preserves ending viability."
      : "Take a conservative action to preserve story continuity.",
    constraints: [],
    effectHints
  };
}

export function buildDecisionPackage(
  input: DecisionBuilderInput
): DecisionPackage {
  const choices = [
    buildMilestoneChoice(input),
    buildRevealChoice(input),
    buildContinuityChoice(input)
  ];

  const defaultChoice = choices.find(
    (choice) => choice.availability === "enabled"
  );

  return {
    packageId: `decision:${input.sceneKind}:${input.sceneGoal}`,
    rationale:
      "Deterministic MVP package balancing milestone progress, reveal legality, and continuity.",
    choices,
    defaultChoiceKey: defaultChoice?.choiceKey,
    metadata: {
      enabledChoiceCount: choices.filter(
        (choice) => choice.availability === "enabled"
      ).length
    }
  };
}
