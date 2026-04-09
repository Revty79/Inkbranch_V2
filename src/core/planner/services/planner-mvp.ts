import type {
  PlannerDiagnostics,
  PlannerIssue,
  PlannerResult,
  PlannerService,
  PlannerSuccessResult,
  PlanningContext,
  PlanNextSceneInput,
  ScenePackage,
  ScenePlan
} from "@/core/planner/contracts";

import { buildDecisionPackage } from "./decision-builder";
import { evaluateEndingEligibility } from "./ending-evaluator";
import { selectTargetMilestone } from "./milestone-selector";
import { evaluatePacing } from "./pacing-evaluator";
import { evaluateRevealEligibility } from "./reveal-evaluator";
import { selectScene } from "./scene-selector";

function buildPlannerIssues(context: PlanningContext): PlannerIssue[] {
  const issues: PlannerIssue[] = [];

  if (context.milestones.milestones.length === 0) {
    issues.push({
      code: "invalid-authoring-input",
      severity: "warning",
      message: "No milestones were authored for this version."
    });
  }

  if (context.reveals.revealEligibility.candidates.length === 0) {
    issues.push({
      code: "invalid-authoring-input",
      severity: "info",
      message: "No reveal candidates were authored for this version."
    });
  }

  return issues;
}

function buildScenePlan(
  context: PlanningContext,
  selection: ReturnType<typeof selectTargetMilestone>,
  revealEligibility: ReturnType<typeof evaluateRevealEligibility>,
  pacingEvaluation: ReturnType<typeof evaluatePacing>,
  endingEligibility: ReturnType<typeof evaluateEndingEligibility>,
  decisionPackage: ReturnType<typeof buildDecisionPackage>,
  sceneSelection: ReturnType<typeof selectScene>
): ScenePlan {
  return {
    scenePlanId: `scene-plan:${context.requestId}:${context.chronicle.sceneCount + 1}`,
    chronicleId: context.chronicle.chronicleId,
    bookVersionId: context.book.bookVersionId,
    perspectiveId: context.perspective.perspectiveId,
    sceneKind: sceneSelection.sceneKind,
    sceneGoal: sceneSelection.sceneGoal,
    intent: sceneSelection.intent,
    constraints: sceneSelection.constraints,
    continuityFacts: sceneSelection.continuityFacts,
    activeMilestones: selection.targetMilestone
      ? [
          {
            milestoneId: selection.targetMilestone.milestoneId,
            arcKey: selection.targetMilestone.arcKey,
            milestoneKey: selection.targetMilestone.milestoneKey,
            required: selection.targetMilestone.required
          }
        ]
      : [],
    allowedReveals: revealEligibility.allowed,
    blockedReveals: revealEligibility.blocked,
    pacingSnapshot: pacingEvaluation.snapshot,
    pacingHints: pacingEvaluation.hints,
    decisionPackage,
    endingEligibility,
    plannedAt: context.requestedAt,
    metadata: {
      targetMilestoneId: selection.targetMilestone?.milestoneId ?? null
    }
  };
}

function buildDiagnostics(
  context: PlanningContext,
  additionalIssues: PlannerIssue[],
  notes: string[]
): PlannerDiagnostics {
  return {
    requestId: context.requestId,
    generatedAt: new Date().toISOString(),
    issues: [...buildPlannerIssues(context), ...additionalIssues],
    notes
  };
}

function buildSuccessResult(
  context: PlanningContext,
  scenePackage: ScenePackage,
  diagnostics: PlannerDiagnostics
): PlannerSuccessResult {
  const enabledChoiceCount = scenePackage.scene.decisionPackage.choices.filter(
    (choice) => choice.availability === "enabled"
  ).length;

  const disabledChoiceCount =
    scenePackage.scene.decisionPackage.choices.length - enabledChoiceCount;

  return {
    status: "success",
    scenePackage,
    decisionSummary: {
      sceneKind: scenePackage.scene.sceneKind,
      sceneGoal: scenePackage.scene.sceneGoal,
      enabledChoiceCount,
      disabledChoiceCount,
      allowedRevealCount: scenePackage.scene.allowedReveals.length,
      blockedRevealCount: scenePackage.scene.blockedReveals.length,
      eligibleEndingCount:
        scenePackage.scene.endingEligibility.eligibleEndings.length
    },
    diagnostics
  };
}

function buildFallbackResult(
  context: PlanningContext,
  scenePackage: ScenePackage,
  diagnostics: PlannerDiagnostics
): PlannerResult {
  return {
    status: "fallback",
    fallbackReason: "fallback-scene-kind",
    fallbackScenePackage: scenePackage,
    diagnostics: {
      ...diagnostics,
      issues: [
        ...diagnostics.issues,
        {
          code: "fallback-applied",
          severity: "warning",
          message:
            "Planner fallback applied because no enabled choices were produced."
        }
      ]
    }
  };
}

export class DeterministicPlannerMvpService implements PlannerService {
  async planNextScene(input: PlanNextSceneInput): Promise<PlannerResult> {
    const { context } = input;

    const milestoneSelection = selectTargetMilestone(context.milestones);
    const revealEligibility = evaluateRevealEligibility(
      context,
      milestoneSelection
    );
    const pacingEvaluation = evaluatePacing(context, milestoneSelection);
    const endingEligibility = evaluateEndingEligibility(
      context,
      milestoneSelection,
      revealEligibility
    );

    const sceneSelection = selectScene(
      context,
      milestoneSelection,
      revealEligibility,
      pacingEvaluation,
      endingEligibility
    );

    const decisionPackage = buildDecisionPackage({
      sceneKind: sceneSelection.sceneKind,
      sceneGoal: sceneSelection.sceneGoal,
      milestoneSelection,
      revealEligibility,
      endingEligibility
    });

    const scenePlan = buildScenePlan(
      context,
      milestoneSelection,
      revealEligibility,
      pacingEvaluation,
      endingEligibility,
      decisionPackage,
      sceneSelection
    );

    const scenePackage: ScenePackage = {
      packageId: `scene-package:${context.requestId}`,
      scene: scenePlan,
      notes: [...milestoneSelection.notes, ...sceneSelection.notes]
    };

    const diagnostics = buildDiagnostics(
      context,
      [],
      [
        ...milestoneSelection.notes,
        ...sceneSelection.notes,
        `Generated ${decisionPackage.choices.length} deterministic choices.`
      ]
    );

    const hasEnabledChoice = decisionPackage.choices.some(
      (choice) => choice.availability === "enabled"
    );

    if (!hasEnabledChoice) {
      return buildFallbackResult(context, scenePackage, diagnostics);
    }

    return buildSuccessResult(context, scenePackage, diagnostics);
  }
}

export function createDeterministicPlannerMvpService(): PlannerService {
  return new DeterministicPlannerMvpService();
}
