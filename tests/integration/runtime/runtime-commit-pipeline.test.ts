import { describe, expect, it } from "vitest";

import type { SceneKind } from "@/core/planner/contracts";
import type {
  RuntimeCommitEventInput,
  RuntimeCommitPipelineService,
  RuntimeCommitStore,
  RuntimeScenePlanPayload
} from "@/core/runtime/contracts";
import { createRuntimeCommitPipeline } from "@/core/runtime/services";

interface InMemoryData {
  chronicles: Map<
    string,
    {
      id: string;
      bookVersionId: string;
      status: "active" | "completed" | "abandoned";
    }
  >;
  chronicleStates: Map<
    string,
    {
      chronicleId: string;
      currentPerspectiveId: string | null;
      currentSceneInstanceId: string | null;
      progressIndex: number;
      endingLocked: boolean;
      summary: Record<string, unknown>;
      updatedAt: string;
    }
  >;
  perspectiveRuns: Map<
    string,
    {
      id: string;
      chronicleId: string;
      perspectiveId: string;
      status: "active" | "paused" | "completed";
      entryCount: number;
      knowledgeScore: number;
      lastSceneInstanceId: string | null;
      metadata: Record<string, unknown>;
      updatedAt: string;
    }
  >;
  sceneInstances: Map<
    string,
    {
      id: string;
      chronicleId: string;
      perspectiveRunId: string;
      plannerCycle: number;
      sceneKind: string;
      sceneGoal: string;
      plannerPayload: Record<string, unknown>;
      generatorPayload: Record<string, unknown>;
      status: "planned" | "rendered" | "resolved" | "superseded";
      updatedAt: string;
    }
  >;
  sceneChoices: Map<
    string,
    {
      id: string;
      sceneInstanceId: string;
      choiceKey: string;
      label: string;
      intent: string | null;
      sortOrder: number;
      plannerEffects: Record<string, unknown>;
      isEnabled: boolean;
    }
  >;
  choiceResolutions: Map<
    string,
    {
      id: string;
      sceneChoiceId: string;
      chronicleId: string;
      resolutionType: "selected" | "skipped" | "auto_selected" | "rejected";
      resolutionPayload: Record<string, unknown>;
      resolvedAt: string;
    }
  >;
  knowledgeState: Map<
    string,
    {
      id: string;
      chronicleId: string;
      perspectiveId: string | null;
      knowledgeKey: string;
      knowledgeStatus: "hidden" | "discovered" | "confirmed" | "invalidated";
      sourceSceneInstanceId: string | null;
      metadata: Record<string, unknown>;
    }
  >;
  canonCommits: Map<
    string,
    {
      id: string;
      chronicleId: string;
      canonEntryId: string | null;
      commitType: "truth" | "retcon" | "reversal";
      commitKey: string;
      commitValue: Record<string, unknown>;
      sourceEventId: string | null;
    }
  >;
  events: Map<
    string,
    {
      id: string;
      chronicleId: string;
      eventType: string;
      eventTs: string;
      causedByType: string | null;
      causedById: string | null;
      payload: Record<string, unknown>;
    }
  >;
}

function createScenePlanPayload(
  sceneKind: SceneKind = "development"
): RuntimeScenePlanPayload {
  return {
    plannerStatus: "success",
    scenePackage: {
      packageId: "pkg:1",
      scene: {
        scenePlanId: "scene-plan:1",
        chronicleId: "chronicle-1",
        bookVersionId: "book-version-1",
        perspectiveId: "perspective-1",
        sceneKind,
        sceneGoal: sceneKind === "ending" ? "deliver-ending" : "advance-arc",
        intent: {
          intentKey: "intent:1",
          summary: "Advance the arc.",
          targetOutcome: "Milestone movement"
        },
        constraints: [],
        continuityFacts: [],
        activeMilestones: [],
        allowedReveals: [
          {
            revealRuleId: "reveal-1",
            revealKey: "reveal-1",
            subjectType: "character",
            impactHints: []
          }
        ],
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
          packageId: "decision:1",
          rationale: "Deterministic choices",
          choices: [
            {
              choiceKey: "choice:advance",
              intent: "advance-milestone",
              availability: "enabled",
              sortOrder: 10,
              optionLabelHint: "Advance",
              constraints: [],
              effectHints: [
                {
                  effectKey: "effect:milestone:truth-step",
                  effectType: "milestone",
                  summary: "Advance milestone",
                  relatedMilestoneId: "milestone-1"
                }
              ]
            },
            {
              choiceKey: "choice:reveal",
              intent: "surface-reveal",
              availability: "enabled",
              sortOrder: 20,
              optionLabelHint: "Reveal",
              constraints: [],
              effectHints: [
                {
                  effectKey: "effect:reveal:truth",
                  effectType: "reveal",
                  summary: "Reveal a hidden truth",
                  relatedRevealRuleId: "reveal-1"
                },
                {
                  effectKey: "knowledge:mentor-truth",
                  effectType: "knowledge",
                  summary: "Confirm mentor truth"
                }
              ]
            },
            {
              choiceKey: "choice:ending",
              intent: "position-ending",
              availability: "enabled",
              sortOrder: 30,
              optionLabelHint: "Lock ending",
              constraints: [],
              effectHints: [
                {
                  effectKey: "effect:ending:victory",
                  effectType: "ending",
                  summary: "Move into ending",
                  relatedEndingRuleId: "ending-1"
                }
              ]
            }
          ],
          defaultChoiceKey: "choice:advance"
        },
        endingEligibility:
          sceneKind === "ending"
            ? {
                status: "eligible",
                eligibleEndings: [
                  {
                    endingRuleId: "ending-1",
                    endingKey: "victory",
                    title: "Victory",
                    endingType: "positive"
                  }
                ],
                blockedEndings: []
              }
            : {
                status: "none-eligible",
                eligibleEndings: [],
                blockedEndings: []
              },
        plannedAt: "2026-04-08T00:00:00.000Z"
      }
    },
    plannerDiagnostics: {
      requestId: "plan:req:1",
      notes: ["deterministic planner output"]
    }
  };
}

function createInMemoryRuntimeStore(): {
  store: RuntimeCommitStore;
  data: InMemoryData;
  pipeline: RuntimeCommitPipelineService;
  chronicleId: string;
  perspectiveRunId: string;
} {
  let sequence = 0;

  function nextId(prefix: string): string {
    sequence += 1;
    return `${prefix}-${sequence}`;
  }

  const now = () => new Date().toISOString();

  const data: InMemoryData = {
    chronicles: new Map(),
    chronicleStates: new Map(),
    perspectiveRuns: new Map(),
    sceneInstances: new Map(),
    sceneChoices: new Map(),
    choiceResolutions: new Map(),
    knowledgeState: new Map(),
    canonCommits: new Map(),
    events: new Map()
  };

  const chronicleId = "chronicle-1";
  const perspectiveRunId = "perspective-run-1";

  data.chronicles.set(chronicleId, {
    id: chronicleId,
    bookVersionId: "book-version-1",
    status: "active"
  });
  data.chronicleStates.set(chronicleId, {
    chronicleId,
    currentPerspectiveId: "perspective-1",
    currentSceneInstanceId: null,
    progressIndex: 0,
    endingLocked: false,
    summary: {},
    updatedAt: now()
  });
  data.perspectiveRuns.set(perspectiveRunId, {
    id: perspectiveRunId,
    chronicleId,
    perspectiveId: "perspective-1",
    status: "active",
    entryCount: 0,
    knowledgeScore: 0,
    lastSceneInstanceId: null,
    metadata: {},
    updatedAt: now()
  });

  const store: RuntimeCommitStore = {
    async runInTransaction<T>(
      operation: (transactionStore: RuntimeCommitStore) => Promise<T>
    ): Promise<T> {
      return operation(store);
    },

    async getChronicleById(id) {
      return data.chronicles.get(id) ?? null;
    },

    async getChronicleStateByChronicleId(id) {
      return data.chronicleStates.get(id) ?? null;
    },

    async createChronicleState(id, perspectiveId, sceneInstanceId) {
      const record = {
        chronicleId: id,
        currentPerspectiveId: perspectiveId,
        currentSceneInstanceId: sceneInstanceId,
        progressIndex: 0,
        endingLocked: false,
        summary: {},
        updatedAt: now()
      };

      data.chronicleStates.set(id, record);

      return record;
    },

    async countSceneInstancesByChronicleId(id) {
      return Array.from(data.sceneInstances.values()).filter(
        (scene) => scene.chronicleId === id
      ).length;
    },

    async getPerspectiveRunById(id) {
      return data.perspectiveRuns.get(id) ?? null;
    },

    async getSceneInstanceById(id) {
      return data.sceneInstances.get(id) ?? null;
    },

    async getSceneChoiceById(id) {
      return data.sceneChoices.get(id) ?? null;
    },

    async getChoiceResolutionBySceneChoiceId(sceneChoiceId) {
      return (
        Array.from(data.choiceResolutions.values()).find(
          (resolution) => resolution.sceneChoiceId === sceneChoiceId
        ) ?? null
      );
    },

    async createSceneInstanceWithChoices(input) {
      const sceneId = nextId("scene");
      const scene = {
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
      const choices = input.choices.map((choice) => {
        const id = nextId("choice");
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

        data.sceneChoices.set(id, record);

        return record;
      });

      data.sceneInstances.set(sceneId, scene);

      return {
        sceneInstance: scene,
        sceneChoices: choices
      };
    },

    async updateSceneInstanceStatus(sceneInstanceId, status) {
      const scene = data.sceneInstances.get(sceneInstanceId);

      if (!scene) {
        return null;
      }

      const updated = {
        ...scene,
        status,
        updatedAt: now()
      };

      data.sceneInstances.set(sceneInstanceId, updated);

      return updated;
    },

    async createChoiceResolution(input) {
      const id = nextId("resolution");
      const record = {
        id,
        sceneChoiceId: input.sceneChoiceId,
        chronicleId: input.chronicleId,
        resolutionType: input.resolutionType,
        resolutionPayload: input.resolutionPayload,
        resolvedAt: now()
      };

      data.choiceResolutions.set(id, record);

      return record;
    },

    async upsertKnowledgeEntry(input) {
      const existing = Array.from(data.knowledgeState.values()).find(
        (entry) =>
          entry.chronicleId === input.chronicleId &&
          entry.perspectiveId === input.perspectiveId &&
          entry.knowledgeKey === input.knowledgeKey
      );

      if (existing) {
        const updated = {
          ...existing,
          knowledgeStatus: input.knowledgeStatus,
          sourceSceneInstanceId: input.sourceSceneInstanceId,
          metadata: input.metadata
        };

        data.knowledgeState.set(updated.id, updated);

        return updated;
      }

      const id = nextId("knowledge");
      const record = {
        id,
        chronicleId: input.chronicleId,
        perspectiveId: input.perspectiveId,
        knowledgeKey: input.knowledgeKey,
        knowledgeStatus: input.knowledgeStatus,
        sourceSceneInstanceId: input.sourceSceneInstanceId,
        metadata: input.metadata
      };

      data.knowledgeState.set(id, record);

      return record;
    },

    async getKnowledgeEntriesByChronicleAndPerspective(
      chronicleId,
      perspectiveId
    ) {
      return Array.from(data.knowledgeState.values()).filter(
        (entry) =>
          entry.chronicleId === chronicleId &&
          entry.perspectiveId === perspectiveId
      );
    },

    async createCanonCommit(input) {
      const id = nextId("canon");
      const record = {
        id,
        chronicleId: input.chronicleId,
        canonEntryId: input.canonEntryId,
        commitType: input.commitType,
        commitKey: input.commitKey,
        commitValue: input.commitValue,
        sourceEventId: input.sourceEventId
      };

      data.canonCommits.set(id, record);

      return record;
    },

    async getCanonCommitsByChronicleId(chronicleId) {
      return Array.from(data.canonCommits.values()).filter(
        (entry) => entry.chronicleId === chronicleId
      );
    },

    async updateChronicleStateByChronicleId(id, input) {
      const current = data.chronicleStates.get(id);

      if (!current) {
        return null;
      }

      const updated = {
        ...current,
        currentPerspectiveId:
          input.currentPerspectiveId ?? current.currentPerspectiveId,
        currentSceneInstanceId:
          input.currentSceneInstanceId ?? current.currentSceneInstanceId,
        progressIndex: input.progressIndex ?? current.progressIndex,
        endingLocked: input.endingLocked ?? current.endingLocked,
        summary: input.summary ?? current.summary,
        updatedAt: now()
      };

      data.chronicleStates.set(id, updated);

      return updated;
    },

    async updatePerspectiveRunById(id, input) {
      const current = data.perspectiveRuns.get(id);

      if (!current) {
        return null;
      }

      const updated = {
        ...current,
        status: input.status ?? current.status,
        entryCount: input.entryCount ?? current.entryCount,
        knowledgeScore: input.knowledgeScore ?? current.knowledgeScore,
        lastSceneInstanceId:
          input.lastSceneInstanceId ?? current.lastSceneInstanceId,
        metadata: input.metadata ?? current.metadata,
        updatedAt: now()
      };

      data.perspectiveRuns.set(id, updated);

      return updated;
    },

    async appendRuntimeEvent(input: RuntimeCommitEventInput) {
      const id = nextId("event");
      const event = {
        id,
        chronicleId: input.chronicleId,
        eventType: input.eventType,
        eventTs: input.eventTs ?? now(),
        causedByType: input.causedByType ?? null,
        causedById: input.causedById ?? null,
        payload: input.payload
      };

      data.events.set(id, event);

      return event;
    }
  };

  return {
    store,
    data,
    pipeline: createRuntimeCommitPipeline(store),
    chronicleId,
    perspectiveRunId
  };
}

describe("RuntimeCommitPipeline", () => {
  it("instantiates a planner scene package into scene + choices and refreshes projections", async () => {
    const fixture = createInMemoryRuntimeStore();

    const result = await fixture.pipeline.instantiateScene({
      requestId: "runtime:req:instantiate",
      chronicleId: fixture.chronicleId,
      perspectiveRunId: fixture.perspectiveRunId,
      plannerResult: createScenePlanPayload("development")
    });

    expect(result.status).toBe("success");

    if (result.status !== "success") {
      throw new Error("Expected successful instantiation.");
    }

    expect(result.data.sceneInstance.sceneKind).toBe("development");
    expect(result.data.sceneChoices).toHaveLength(3);
    expect(result.data.events.map((event) => event.eventType)).toEqual([
      "scene_instantiated",
      "scene_choices_created",
      "perspective_run_updated",
      "chronicle_state_refreshed"
    ]);
    expect(result.data.perspectiveRun.entryCount).toBe(1);
    expect(result.data.chronicleState.currentSceneInstanceId).toBe(
      result.data.sceneInstance.id
    );
  });

  it("rejects resolution when selected choice does not belong to the provided scene instance", async () => {
    const fixture = createInMemoryRuntimeStore();

    const first = await fixture.pipeline.instantiateScene({
      requestId: "runtime:req:instantiate:first",
      chronicleId: fixture.chronicleId,
      perspectiveRunId: fixture.perspectiveRunId,
      plannerResult: createScenePlanPayload("development")
    });
    const second = await fixture.pipeline.instantiateScene({
      requestId: "runtime:req:instantiate:second",
      chronicleId: fixture.chronicleId,
      perspectiveRunId: fixture.perspectiveRunId,
      plannerResult: createScenePlanPayload("development")
    });

    if (first.status !== "success" || second.status !== "success") {
      throw new Error("Expected successful setup for mismatch test.");
    }

    const result = await fixture.pipeline.resolveChoice({
      requestId: "runtime:req:resolve:mismatch",
      chronicleId: fixture.chronicleId,
      sceneInstanceId: first.data.sceneInstance.id,
      sceneChoiceId: second.data.sceneChoices[0].id
    });

    expect(result.status).toBe("failure");

    if (result.status !== "failure") {
      throw new Error("Expected failure for scene-choice mismatch.");
    }

    expect(result.diagnostics.issues[0]?.code).toBe("choice-scene-mismatch");
  });

  it("resolves choices with event append, knowledge/canon updates, and projection refresh", async () => {
    const fixture = createInMemoryRuntimeStore();

    const instantiated = await fixture.pipeline.instantiateScene({
      requestId: "runtime:req:instantiate",
      chronicleId: fixture.chronicleId,
      perspectiveRunId: fixture.perspectiveRunId,
      plannerResult: createScenePlanPayload("development")
    });

    if (instantiated.status !== "success") {
      throw new Error("Expected successful scene instantiation.");
    }

    const revealChoice = instantiated.data.sceneChoices.find(
      (choice) => choice.choiceKey === "choice:reveal"
    );

    if (!revealChoice) {
      throw new Error("Reveal choice not found in fixture package.");
    }

    const resolved = await fixture.pipeline.resolveChoice({
      requestId: "runtime:req:resolve",
      chronicleId: fixture.chronicleId,
      sceneInstanceId: instantiated.data.sceneInstance.id,
      sceneChoiceId: revealChoice.id
    });

    expect(resolved.status).toBe("success");

    if (resolved.status !== "success") {
      throw new Error("Expected successful resolution.");
    }

    const eventTypes = resolved.data.events.map((event) => event.eventType);

    expect(eventTypes).toContain("choice_resolved");
    expect(eventTypes).toContain("knowledge_state_updated");
    expect(eventTypes).toContain("canon_commit_created");
    expect(eventTypes).toContain("perspective_run_updated");
    expect(eventTypes).toContain("chronicle_state_refreshed");

    expect(resolved.data.knowledgeUpdates.length).toBeGreaterThan(0);
    expect(
      resolved.data.knowledgeUpdates.some((entry) =>
        entry.knowledgeKey.includes("reveal:")
      )
    ).toBe(true);
    expect(resolved.data.canonCommits.length).toBeGreaterThan(0);
    expect(
      resolved.data.canonCommits.some((commit) =>
        commit.commitKey.startsWith("reveal:")
      )
    ).toBe(true);
    expect(resolved.data.chronicleState.progressIndex).toBe(1);
    expect(resolved.data.chronicleState.summary.lastResolvedChoiceKey).toBe(
      "choice:reveal"
    );
    expect(resolved.data.perspectiveRun.knowledgeScore).toBeGreaterThan(0);
    expect(resolved.data.perspectiveRun.lastSceneInstanceId).toBe(
      instantiated.data.sceneInstance.id
    );
  });
});
