import { describe, expect, it } from "vitest";

import type { PlanningContext } from "@/core/planner/contracts";
import { createDeterministicPlannerMvpService } from "@/core/planner/services";

function createBaseContext(): PlanningContext {
  return {
    requestId: "req:planner:test",
    requestedAt: "2026-01-01T00:00:00.000Z",
    book: {
      worldId: "world-1",
      bookId: "book-1",
      bookVersionId: "version-1",
      versionLabel: "v1"
    },
    chronicle: {
      chronicleId: "chronicle-1",
      chronicleStatus: "active",
      sceneCount: 2,
      progressIndex: 2,
      endingLocked: false
    },
    perspective: {
      perspectiveId: "perspective-1",
      characterId: "character-1",
      perspectiveSlug: "lead-pov",
      perspectiveName: "Lead POV",
      knowledgeBaseline: {},
      eligibilityRules: {}
    },
    knowledge: {
      entries: []
    },
    milestones: {
      milestones: [
        {
          milestoneId: "milestone-1",
          arcKey: "main",
          milestoneKey: "truth-step",
          required: true,
          priority: 5,
          status: "available"
        }
      ]
    },
    reveals: {
      revealEligibility: {
        candidates: [
          {
            revealRuleId: "reveal-1",
            revealKey: "truth-reveal",
            subjectType: "character",
            gatingRules: {},
            exposureEffects: {}
          }
        ],
        allowed: [],
        blocked: []
      }
    },
    pacing: {
      snapshot: {
        currentPhase: "build",
        momentum: "steady",
        pressureLevels: [],
        cadence: {
          scenesSinceLastMajorReveal: 2,
          scenesSinceLastMilestoneAdvance: 1,
          consecutiveHighIntensityScenes: 0,
          recentSceneKinds: ["setup", "development"]
        }
      }
    },
    endings: {
      candidates: {
        candidates: [
          {
            endingRuleId: "ending-1",
            endingKey: "default-ending",
            title: "Default Ending",
            endingType: "standard",
            eligibilityRules: {
              requiredMilestoneKeys: ["finale-step"]
            },
            priorityRules: {},
            resolutionTemplate: {}
          }
        ]
      },
      currentEligibility: {
        status: "none-eligible",
        eligibleEndings: [],
        blockedEndings: []
      }
    },
    continuityFacts: ["The mentor is alive."]
  };
}

describe("DeterministicPlannerMvpService", () => {
  it("produces deterministic structural output for identical context", async () => {
    const planner = createDeterministicPlannerMvpService();
    const context = createBaseContext();

    const first = await planner.planNextScene({ context });
    const second = await planner.planNextScene({ context });

    expect(first.status).toBe("success");
    expect(second.status).toBe("success");

    if (first.status !== "success" || second.status !== "success") {
      throw new Error("Expected success results for deterministic assertion.");
    }

    expect(first.scenePackage.scene.sceneKind).toBe("revelation");
    expect(first.scenePackage.scene.sceneKind).toBe(
      second.scenePackage.scene.sceneKind
    );
    expect(first.scenePackage.scene.sceneGoal).toBe(
      second.scenePackage.scene.sceneGoal
    );
    expect(first.scenePackage.scene.decisionPackage.choices).toEqual(
      second.scenePackage.scene.decisionPackage.choices
    );
  });

  it("chooses an ending scene when ending eligibility is satisfied", async () => {
    const planner = createDeterministicPlannerMvpService();
    const context = createBaseContext();

    const endingContext: PlanningContext = {
      ...context,
      chronicle: {
        ...context.chronicle,
        sceneCount: 5,
        progressIndex: 7
      },
      endings: {
        candidates: {
          candidates: [
            {
              endingRuleId: "ending-2",
              endingKey: "victory",
              title: "Victory",
              endingType: "positive",
              eligibilityRules: {},
              priorityRules: {},
              resolutionTemplate: {}
            }
          ]
        },
        currentEligibility: {
          status: "none-eligible",
          eligibleEndings: [],
          blockedEndings: []
        }
      }
    };

    const result = await planner.planNextScene({ context: endingContext });

    expect(result.status).toBe("success");

    if (result.status !== "success") {
      throw new Error("Expected success result for ending assertion.");
    }

    expect(result.scenePackage.scene.sceneKind).toBe("ending");
    expect(result.scenePackage.scene.sceneGoal).toBe("deliver-ending");
    expect(result.scenePackage.scene.endingEligibility.status).toBe("eligible");
  });
});
