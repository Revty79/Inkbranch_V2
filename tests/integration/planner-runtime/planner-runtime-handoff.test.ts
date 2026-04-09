import { describe, expect, it } from "vitest";

import type { PlanningContext } from "@/core/planner/contracts";
import { createDeterministicPlannerMvpService } from "@/core/planner/services";
import type {
  RuntimeCommitStore,
  RuntimeScenePlanPayload
} from "@/core/runtime/contracts";
import { createRuntimeCommitPipeline } from "@/core/runtime/services";

function createPlanningContext(): PlanningContext {
  return {
    requestId: "plan:req:integration",
    requestedAt: "2026-04-08T00:00:00.000Z",
    book: {
      worldId: "world-1",
      bookId: "book-1",
      bookVersionId: "version-1",
      versionLabel: "demo-v1"
    },
    chronicle: {
      chronicleId: "chronicle-1",
      chronicleStatus: "active",
      sceneCount: 0,
      progressIndex: 0,
      endingLocked: false
    },
    perspective: {
      perspectiveId: "perspective-1",
      characterId: "character-1",
      perspectiveSlug: "lead-perspective",
      perspectiveName: "Lead Perspective",
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
          milestoneKey: "secure-ledger",
          required: true,
          priority: 100,
          sequenceHint: 0,
          status: "available"
        }
      ]
    },
    reveals: {
      revealEligibility: {
        candidates: [],
        allowed: [],
        blocked: []
      }
    },
    pacing: {
      snapshot: {
        currentPhase: "setup",
        momentum: "steady",
        pressureLevels: [],
        cadence: {
          scenesSinceLastMajorReveal: 1,
          scenesSinceLastMilestoneAdvance: 1,
          consecutiveHighIntensityScenes: 0,
          recentSceneKinds: []
        }
      }
    },
    endings: {
      candidates: {
        candidates: []
      },
      currentEligibility: {
        status: "none-eligible",
        eligibleEndings: [],
        blockedEndings: []
      }
    },
    continuityFacts: ["Meridian Gate must stay stable for evacuation."]
  };
}

function toRuntimeScenePlanPayload(
  plannerResult: Awaited<
    ReturnType<
      ReturnType<typeof createDeterministicPlannerMvpService>["planNextScene"]
    >
  >
): RuntimeScenePlanPayload {
  if (plannerResult.status === "failure") {
    throw new Error("Planner returned failure for integration handoff test.");
  }

  return {
    plannerStatus: plannerResult.status === "success" ? "success" : "fallback",
    scenePackage:
      plannerResult.status === "success"
        ? plannerResult.scenePackage
        : plannerResult.fallbackScenePackage,
    plannerDiagnostics: {
      requestId: plannerResult.diagnostics.requestId,
      notes: plannerResult.diagnostics.notes ?? []
    }
  };
}

function createIntegrationRuntimeStore(): RuntimeCommitStore {
  let sequence = 0;
  const now = () => new Date().toISOString();

  const chronicle = {
    id: "chronicle-1",
    bookVersionId: "version-1",
    status: "active" as const
  };
  const perspectiveRun = {
    id: "perspective-run-1",
    chronicleId: chronicle.id,
    perspectiveId: "perspective-1",
    status: "active" as const,
    entryCount: 0,
    knowledgeScore: 0,
    lastSceneInstanceId: null as string | null,
    metadata: {},
    updatedAt: now()
  };
  let chronicleState = {
    chronicleId: chronicle.id,
    currentPerspectiveId: "perspective-1",
    currentSceneInstanceId: null as string | null,
    progressIndex: 0,
    endingLocked: false,
    summary: {},
    updatedAt: now()
  };
  const scenes = new Map<
    string,
    Awaited<
      ReturnType<RuntimeCommitStore["createSceneInstanceWithChoices"]>
    >["sceneInstance"]
  >();
  const sceneChoices = new Map<
    string,
    Awaited<
      ReturnType<RuntimeCommitStore["createSceneInstanceWithChoices"]>
    >["sceneChoices"][number]
  >();

  const unsupported = async () => {
    throw new Error(
      "Method not required for planner-runtime instantiate integration test."
    );
  };

  return {
    async runInTransaction(operation) {
      return operation(this);
    },
    async getChronicleById(chronicleId) {
      return chronicleId === chronicle.id ? chronicle : null;
    },
    async getChronicleStateByChronicleId(chronicleId) {
      return chronicleId === chronicle.id ? chronicleState : null;
    },
    async createChronicleState(chronicleId, perspectiveId, sceneInstanceId) {
      chronicleState = {
        chronicleId,
        currentPerspectiveId: perspectiveId,
        currentSceneInstanceId: sceneInstanceId,
        progressIndex: 0,
        endingLocked: false,
        summary: {},
        updatedAt: now()
      };
      return chronicleState;
    },
    async countSceneInstancesByChronicleId(chronicleId) {
      return Array.from(scenes.values()).filter(
        (scene) => scene.chronicleId === chronicleId
      ).length;
    },
    async getPerspectiveRunById(perspectiveRunId) {
      return perspectiveRunId === perspectiveRun.id ? perspectiveRun : null;
    },
    async getSceneInstanceById(sceneInstanceId) {
      return scenes.get(sceneInstanceId) ?? null;
    },
    async getSceneChoiceById(sceneChoiceId) {
      return sceneChoices.get(sceneChoiceId) ?? null;
    },
    async getChoiceResolutionBySceneChoiceId() {
      return null;
    },
    async createSceneInstanceWithChoices(input) {
      sequence += 1;
      const sceneId = `scene-${sequence}`;
      const createdScene = {
        id: sceneId,
        chronicleId: input.chronicleId,
        perspectiveRunId: input.perspectiveRunId,
        plannerCycle: input.plannerCycle,
        sceneKind: input.sceneKind,
        sceneGoal: input.sceneGoal,
        plannerPayload: input.plannerPayload,
        generatorPayload: input.generatorPayload,
        status: input.status,
        updatedAt: now()
      };

      const createdChoices = input.choices.map((choice, index) => {
        const id = `choice-${sequence}-${index + 1}`;
        const record = {
          id,
          sceneInstanceId: sceneId,
          choiceKey: choice.choiceKey,
          label: choice.label,
          intent: choice.intent,
          sortOrder: choice.sortOrder,
          plannerEffects: choice.plannerEffects,
          isEnabled: choice.isEnabled
        };
        sceneChoices.set(id, record);
        return record;
      });

      scenes.set(sceneId, createdScene);

      return {
        sceneInstance: createdScene,
        sceneChoices: createdChoices
      };
    },
    async updateSceneInstanceStatus(sceneInstanceId, status) {
      const scene = scenes.get(sceneInstanceId);
      if (!scene) {
        return null;
      }

      const updated = {
        ...scene,
        status,
        updatedAt: now()
      };
      scenes.set(sceneInstanceId, updated);
      return updated;
    },
    createChoiceResolution: unsupported,
    upsertKnowledgeEntry: unsupported,
    getKnowledgeEntriesByChronicleAndPerspective: unsupported,
    createCanonCommit: unsupported,
    getCanonCommitsByChronicleId: unsupported,
    async updateChronicleStateByChronicleId(chronicleId, input) {
      if (chronicleId !== chronicle.id) {
        return null;
      }

      chronicleState = {
        ...chronicleState,
        currentPerspectiveId:
          input.currentPerspectiveId ?? chronicleState.currentPerspectiveId,
        currentSceneInstanceId:
          input.currentSceneInstanceId ?? chronicleState.currentSceneInstanceId,
        progressIndex: input.progressIndex ?? chronicleState.progressIndex,
        endingLocked: input.endingLocked ?? chronicleState.endingLocked,
        summary: input.summary ?? chronicleState.summary,
        updatedAt: now()
      };

      return chronicleState;
    },
    async updatePerspectiveRunById(perspectiveRunId, input) {
      if (perspectiveRunId !== perspectiveRun.id) {
        return null;
      }

      const updated = {
        ...perspectiveRun,
        status: input.status ?? perspectiveRun.status,
        entryCount: input.entryCount ?? perspectiveRun.entryCount,
        knowledgeScore: input.knowledgeScore ?? perspectiveRun.knowledgeScore,
        lastSceneInstanceId:
          input.lastSceneInstanceId ?? perspectiveRun.lastSceneInstanceId,
        metadata: input.metadata ?? perspectiveRun.metadata,
        updatedAt: now()
      };

      Object.assign(perspectiveRun, updated);

      return perspectiveRun;
    },
    async appendRuntimeEvent(input) {
      sequence += 1;
      return {
        id: `event-${sequence}`,
        chronicleId: input.chronicleId,
        eventType: input.eventType,
        eventTs: input.eventTs ?? now(),
        causedByType: input.causedByType ?? null,
        causedById: input.causedById ?? null,
        payload: input.payload
      };
    }
  };
}

describe("planner-runtime integration", () => {
  it("instantiates planner output through runtime pipeline", async () => {
    const planner = createDeterministicPlannerMvpService();
    const plannerResult = await planner.planNextScene({
      context: createPlanningContext()
    });
    const runtimePayload = toRuntimeScenePlanPayload(plannerResult);
    const pipeline = createRuntimeCommitPipeline(
      createIntegrationRuntimeStore()
    );

    const instantiateResult = await pipeline.instantiateScene({
      requestId: "runtime:req:planner-handoff",
      chronicleId: "chronicle-1",
      perspectiveRunId: "perspective-run-1",
      plannerResult: runtimePayload
    });

    expect(instantiateResult.status).toBe("success");

    if (instantiateResult.status !== "success") {
      throw new Error("Expected successful planner-runtime handoff.");
    }

    expect(instantiateResult.data.sceneInstance.sceneKind).toBe(
      runtimePayload.scenePackage.scene.sceneKind
    );
    expect(instantiateResult.data.sceneChoices.length).toBe(
      runtimePayload.scenePackage.scene.decisionPackage.choices.length
    );
    expect(instantiateResult.data.chronicleState.currentSceneInstanceId).toBe(
      instantiateResult.data.sceneInstance.id
    );
  });
});
