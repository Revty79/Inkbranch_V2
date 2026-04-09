import { describe, expect, it } from "vitest";

import type { ScenePackage } from "@/core/planner/contracts";
import { createGeneratorSceneService } from "@/core/generator/services";
import type { GeneratorSceneInput } from "@/core/generator/contracts";
import {
  validateCanonCommitEffectsInput,
  validateChoiceResolutionInput,
  validateChronicleProjectionInput,
  validateEndingEligibility,
  validateKnowledgeUpdateInput,
  validatePlannerScenePackage,
  validateRevealUsage
} from "@/core/validators/services";

function createBaseScenePackage(): ScenePackage {
  return {
    packageId: "scene-package:1",
    scene: {
      scenePlanId: "scene-plan:1",
      chronicleId: "chronicle-1",
      bookVersionId: "book-version-1",
      perspectiveId: "perspective-1",
      sceneKind: "development",
      sceneGoal: "advance-arc",
      intent: {
        intentKey: "intent-1",
        summary: "Advance the arc.",
        targetOutcome: "Milestone progression."
      },
      constraints: [],
      continuityFacts: [
        {
          factKey: "fact-1",
          statement: "The mentor remains missing.",
          source: "canon",
          required: true
        }
      ],
      activeMilestones: [],
      allowedReveals: [],
      blockedReveals: [],
      pacingSnapshot: {
        currentPhase: "build",
        momentum: "steady",
        pressureLevels: [],
        cadence: {
          scenesSinceLastMajorReveal: 1,
          scenesSinceLastMilestoneAdvance: 1,
          consecutiveHighIntensityScenes: 0,
          recentSceneKinds: ["setup"]
        }
      },
      pacingHints: [],
      decisionPackage: {
        packageId: "decision-package:1",
        rationale: "Deterministic choices",
        choices: [
          {
            choiceKey: "choice:advance",
            intent: "advance-milestone",
            availability: "enabled",
            sortOrder: 10,
            optionLabelHint: "Advance",
            constraints: [],
            effectHints: []
          }
        ]
      },
      endingEligibility: {
        status: "none-eligible",
        eligibleEndings: [],
        blockedEndings: []
      },
      plannedAt: "2026-04-08T00:00:00.000Z"
    },
    notes: []
  };
}

function createGeneratorSceneInput(): GeneratorSceneInput {
  return {
    requestId: "gen:validator:req:1",
    chronicleId: "chronicle-1",
    sceneInstanceId: "scene-1",
    sceneKind: "development",
    sceneGoal: "advance-arc",
    plannerCycle: 1,
    perspective: {
      perspectiveId: "perspective-1",
      perspectiveName: "Lead POV"
    },
    constraints: [],
    continuityFacts: [],
    approvedReveals: [],
    choices: [
      {
        choiceId: "choice-id-1",
        choiceKey: "choice:advance",
        structuralLabel: "Advance",
        intentLabel: "advance milestone",
        availability: "enabled"
      },
      {
        choiceId: "choice-id-2",
        choiceKey: "choice:hold",
        structuralLabel: "Hold",
        intentLabel: "stabilize continuity",
        availability: "disabled"
      }
    ],
    fallbackBody: {
      title: "Scene structure available",
      paragraphs: ["Fallback paragraph."]
    }
  };
}

describe("validation and continuity guards", () => {
  it("blocks planner scene packages with contradictory reveal sets", () => {
    const scenePackage = createBaseScenePackage();
    const result = validatePlannerScenePackage({
      scenePackage: {
        ...scenePackage,
        scene: {
          ...scenePackage.scene,
          allowedReveals: [
            {
              revealRuleId: "reveal-1",
              revealKey: "reveal-1",
              subjectType: "character",
              impactHints: []
            }
          ],
          blockedReveals: [
            {
              revealRuleId: "reveal-1",
              revealKey: "reveal-1",
              reason: {
                code: "continuity-risk",
                message: "Reveal is blocked."
              }
            }
          ]
        }
      },
      expectedChronicleId: "chronicle-1"
    });

    expect(result.ok).toBe(false);
    expect(
      result.issues.some((issue) => issue.code === "contradictory-reveal-sets")
    ).toBe(true);
  });

  it("blocks illegal reveal usage when reveal is blocked or not allowed", () => {
    const result = validateRevealUsage({
      revealKeysToApply: ["reveal-2"],
      allowedRevealKeys: ["reveal-1"],
      blockedRevealKeys: ["reveal-2"]
    });

    expect(result.ok).toBe(false);
    expect(result.issues.some((issue) => issue.code === "reveal-blocked")).toBe(
      true
    );
  });

  it("rejects invalid choice resolution transitions", () => {
    const result = validateChoiceResolutionInput({
      sceneStatus: "resolved",
      sceneChronicleId: "chronicle-1",
      requestedChronicleId: "chronicle-1",
      choiceEnabled: true,
      alreadyResolved: true
    });

    expect(result.ok).toBe(false);
    expect(
      result.issues.some((issue) => issue.code === "choice-already-resolved")
    ).toBe(true);
  });

  it("rejects contradictory canon commit effects", () => {
    const result = validateCanonCommitEffectsInput({
      effects: [
        {
          commitType: "truth",
          commitKey: "reveal:mentor-letter",
          commitValue: {
            exposed: true
          },
          sourceEffectKey: "effect:reveal-1"
        }
      ],
      existingCommits: [
        {
          id: "commit-1",
          chronicleId: "chronicle-1",
          canonEntryId: null,
          commitType: "truth",
          commitKey: "reveal:mentor-letter",
          commitValue: {
            exposed: false
          },
          sourceEventId: null
        }
      ]
    });

    expect(result.ok).toBe(false);
    expect(
      result.issues.some((issue) => issue.code === "canon-commit-contradiction")
    ).toBe(true);
  });

  it("rejects contradictory knowledge status regressions", () => {
    const result = validateKnowledgeUpdateInput({
      effects: [
        {
          knowledgeKey: "reveal:mentor-letter",
          knowledgeStatus: "discovered",
          summary: "Reveal was surfaced.",
          sourceEffectKey: "effect:reveal:mentor-letter"
        }
      ],
      existingEntries: [
        {
          id: "knowledge-1",
          chronicleId: "chronicle-1",
          perspectiveId: "perspective-1",
          knowledgeKey: "reveal:mentor-letter",
          knowledgeStatus: "confirmed",
          sourceSceneInstanceId: "scene-1",
          metadata: {}
        }
      ]
    });

    expect(result.ok).toBe(false);
    expect(
      result.issues.some(
        (issue) => issue.code === "knowledge-status-regression"
      )
    ).toBe(true);
  });

  it("blocks premature ending eligibility for ending scenes", () => {
    const scenePackage = createBaseScenePackage();
    const result = validateEndingEligibility({
      scenePackage: {
        ...scenePackage,
        scene: {
          ...scenePackage.scene,
          sceneKind: "ending",
          sceneGoal: "deliver-ending",
          endingEligibility: {
            status: "none-eligible",
            eligibleEndings: [],
            blockedEndings: []
          }
        }
      }
    });

    expect(result.ok).toBe(false);
    expect(
      result.issues.some((issue) => issue.code === "ending-not-eligible")
    ).toBe(true);
  });

  it("detects chronicle projection mismatches", () => {
    const result = validateChronicleProjectionInput({
      chronicleId: "chronicle-1",
      projection: {
        chronicleId: "chronicle-2",
        currentPerspectiveId: null,
        currentSceneInstanceId: null,
        progressIndex: 0,
        endingLocked: false,
        summary: {},
        updatedAt: "2026-04-08T00:00:00.000Z"
      },
      currentSceneChronicleId: "chronicle-2",
      currentPerspectiveId: null
    });

    expect(result.ok).toBe(false);
    expect(
      result.issues.some(
        (issue) => issue.code === "chronicle-projection-mismatch"
      )
    ).toBe(true);
  });

  it("falls back safely when generator output is invalid", async () => {
    const service = createGeneratorSceneService({
      adapter: {
        adapterId: "invalid-output-adapter",
        async generateScene() {
          return {
            status: "success" as const,
            output: {
              prose: "Generated prose",
              choices: [
                {
                  choiceKey: "choice:advance",
                  label: "Advance now"
                }
              ]
            }
          };
        }
      },
      now: () => "2026-04-08T00:00:00.000Z"
    });

    const result = await service.generateScene({
      input: createGeneratorSceneInput()
    });

    expect(result.status).toBe("fallback");

    if (result.status !== "fallback") {
      throw new Error("Expected generator fallback for invalid output.");
    }

    expect(result.fallbackReason).toBe("validation-failed");
  });
});
