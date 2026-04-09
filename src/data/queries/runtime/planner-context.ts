import "server-only";

import type {
  EndingCandidate,
  PacingPressureLevel,
  PlanningContext,
  PlanningKnowledgeEntry,
  PlanningMilestoneEntry,
  RevealCandidate
} from "@/core/planner/contracts";
import type { PlanningContextLoader } from "@/core/planner/services";
import {
  getBookById,
  getBookVersionById,
  getArcMilestonesByBookVersionId,
  getEndingRulesByBookVersionId,
  getPacingRulesByBookVersionId,
  getPerspectivesByBookVersionId,
  getRevealRulesByBookVersionId,
  getWorldById,
  listCanonEntriesByBookVersionId
} from "@/data/queries/authoring";
import {
  getChronicleById,
  getPerspectiveRunsByChronicleId
} from "./chronicles";
import { getSceneInstancesByChronicleId } from "./scenes";
import {
  getChronicleStateByChronicleId,
  getKnowledgeStateByChronicleId
} from "./state";

export interface LoadPlanningContextForChronicleInput {
  readonly chronicleId: string;
  readonly requestId?: string;
  readonly preferredPerspectiveId?: string;
}

function readStringArray(
  value: Record<string, unknown>,
  key: string
): string[] {
  const candidate = value[key];

  if (!Array.isArray(candidate)) {
    return [];
  }

  return candidate.filter(
    (entry): entry is string => typeof entry === "string"
  );
}

function readNumber(
  value: Record<string, unknown>,
  key: string
): number | null {
  const candidate = value[key];

  if (typeof candidate !== "number" || !Number.isFinite(candidate)) {
    return null;
  }

  return candidate;
}

function mapKnowledgeConfidence(
  status: string
): "suspected" | "confirmed" | "disproven" {
  if (status === "confirmed") {
    return "confirmed";
  }

  if (status === "invalidated") {
    return "disproven";
  }

  return "suspected";
}

function deriveMilestoneStatus(
  milestone: {
    milestoneKey: string;
    eligibilityRules: Record<string, unknown>;
    sequenceHint: number | null;
  },
  completedMilestoneKeys: Set<string>,
  progressIndex: number
): PlanningMilestoneEntry["status"] {
  if (completedMilestoneKeys.has(milestone.milestoneKey)) {
    return "completed";
  }

  const prerequisiteKeys = readStringArray(
    milestone.eligibilityRules,
    "requiredMilestoneKeys"
  );

  if (
    prerequisiteKeys.length > 0 &&
    prerequisiteKeys.some((key) => !completedMilestoneKeys.has(key))
  ) {
    return "blocked";
  }

  if (
    typeof milestone.sequenceHint === "number" &&
    progressIndex < milestone.sequenceHint
  ) {
    return "unseen";
  }

  return "available";
}

function createRevealCandidates(
  revealRules: Awaited<ReturnType<typeof getRevealRulesByBookVersionId>>
): RevealCandidate[] {
  return revealRules.map((rule) => ({
    revealRuleId: rule.id,
    revealKey: rule.revealKey,
    subjectType: rule.subjectType,
    subjectId: rule.subjectId ?? undefined,
    priority: 0,
    gatingRules: rule.gatingRules,
    exposureEffects: rule.exposureEffects
  }));
}

function createEndingCandidates(
  endingRules: Awaited<ReturnType<typeof getEndingRulesByBookVersionId>>
): EndingCandidate[] {
  return endingRules.map((rule) => ({
    endingRuleId: rule.id,
    endingKey: rule.endingKey,
    title: rule.title,
    endingType: rule.endingType,
    eligibilityRules: rule.eligibilityRules,
    priorityRules: rule.priorityRules,
    resolutionTemplate: rule.resolutionTemplate
  }));
}

function createKnowledgeEntries(
  entries: Awaited<ReturnType<typeof getKnowledgeStateByChronicleId>>
): PlanningKnowledgeEntry[] {
  return entries.map((entry) => ({
    canonEntryId: entry.knowledgeKey,
    knowledgeKey: entry.knowledgeKey,
    confidence: mapKnowledgeConfidence(entry.knowledgeStatus)
  }));
}

function derivePacingSnapshot(
  sceneInstances: Awaited<ReturnType<typeof getSceneInstancesByChronicleId>>,
  pacingRules: Awaited<ReturnType<typeof getPacingRulesByBookVersionId>>,
  progressIndex: number
): PlanningContext["pacing"]["snapshot"] {
  const recentSceneKinds = sceneInstances
    .slice(-5)
    .map((scene) => scene.sceneKind);

  const lastRevealIndex = sceneInstances
    .map((scene) => scene.sceneKind)
    .lastIndexOf("revelation");
  const lastMilestoneIndex = sceneInstances
    .map((scene) => scene.sceneGoal)
    .lastIndexOf("advance-arc");

  const scenesSinceLastMajorReveal =
    lastRevealIndex === -1
      ? sceneInstances.length
      : sceneInstances.length - 1 - lastRevealIndex;

  const scenesSinceLastMilestoneAdvance =
    lastMilestoneIndex === -1
      ? sceneInstances.length
      : sceneInstances.length - 1 - lastMilestoneIndex;

  let consecutiveHighIntensityScenes = 0;

  for (let index = sceneInstances.length - 1; index >= 0; index -= 1) {
    const kind = sceneInstances[index].sceneKind;
    const highIntensity =
      kind === "revelation" || kind === "consequence" || kind === "ending";

    if (!highIntensity) {
      break;
    }

    consecutiveHighIntensityScenes += 1;
  }

  const currentPhase =
    progressIndex <= 1
      ? "setup"
      : progressIndex <= 4
        ? "build"
        : progressIndex <= 7
          ? "climax"
          : "resolution";

  const momentum =
    consecutiveHighIntensityScenes >= 2
      ? "accelerating"
      : scenesSinceLastMajorReveal >= 4
        ? "decelerating"
        : "steady";

  const pressureLevels = pacingRules.map((rule) => {
    const configuredLevel = readStringArray(
      rule.ruleConfig,
      "pressureLevel"
    )[0];
    const level: PacingPressureLevel =
      configuredLevel === "low" ||
      configuredLevel === "moderate" ||
      configuredLevel === "high" ||
      configuredLevel === "critical"
        ? configuredLevel
        : "moderate";

    return {
      pressureKey: `pressure:rule:${rule.id}`,
      level,
      source: "authoring" as const,
      reason: `Pacing rule ${rule.ruleType} scoped to ${rule.scope}.`
    };
  });

  return {
    currentPhase,
    momentum,
    pressureLevels,
    cadence: {
      scenesSinceLastMajorReveal,
      scenesSinceLastMilestoneAdvance,
      consecutiveHighIntensityScenes,
      recentSceneKinds
    }
  };
}

export async function loadPlanningContextForChronicle(
  input: LoadPlanningContextForChronicleInput
): Promise<PlanningContext | null> {
  const chronicle = await getChronicleById(input.chronicleId);

  if (!chronicle) {
    return null;
  }

  const [
    chronicleState,
    sceneInstances,
    knowledgeEntries,
    perspectiveRuns,
    bookVersion
  ] = await Promise.all([
    getChronicleStateByChronicleId(chronicle.id),
    getSceneInstancesByChronicleId(chronicle.id),
    getKnowledgeStateByChronicleId(chronicle.id),
    getPerspectiveRunsByChronicleId(chronicle.id),
    getBookVersionById(chronicle.bookVersionId)
  ]);

  if (!bookVersion) {
    return null;
  }

  const [
    book,
    perspectives,
    canonEntries,
    arcMilestones,
    revealRules,
    pacingRules,
    endingRules
  ] = await Promise.all([
    getBookById(bookVersion.bookId),
    getPerspectivesByBookVersionId(bookVersion.id),
    listCanonEntriesByBookVersionId(bookVersion.id),
    getArcMilestonesByBookVersionId(bookVersion.id),
    getRevealRulesByBookVersionId(bookVersion.id),
    getPacingRulesByBookVersionId(bookVersion.id),
    getEndingRulesByBookVersionId(bookVersion.id)
  ]);

  if (!book) {
    return null;
  }

  const world = await getWorldById(book.worldId);

  if (!world || perspectives.length === 0) {
    return null;
  }

  const preferredPerspectiveId =
    input.preferredPerspectiveId ??
    chronicleState?.currentPerspectiveId ??
    perspectiveRuns.at(-1)?.perspectiveId ??
    perspectives[0].id;

  const selectedPerspective =
    perspectives.find(
      (perspective) => perspective.id === preferredPerspectiveId
    ) ?? perspectives[0];

  const progressIndex = chronicleState?.progressIndex ?? sceneInstances.length;
  const summary = chronicleState?.summary ?? {};

  const completedMilestoneKeys = new Set(
    readStringArray(summary, "completedMilestoneKeys")
  );

  const milestoneEntries: PlanningMilestoneEntry[] = arcMilestones.map(
    (milestone) => ({
      milestoneId: milestone.id,
      arcKey: milestone.arcKey,
      milestoneKey: milestone.milestoneKey,
      required: milestone.required,
      priority: milestone.priority,
      sequenceHint: milestone.sequenceHint ?? undefined,
      status: deriveMilestoneStatus(
        milestone,
        completedMilestoneKeys,
        progressIndex
      )
    })
  );

  const revealCandidates = createRevealCandidates(revealRules);
  const endingCandidates = createEndingCandidates(endingRules);

  const pacingSnapshot = derivePacingSnapshot(
    sceneInstances,
    pacingRules,
    progressIndex
  );
  const firstPacingRule = pacingRules[0];

  const latestScene = sceneInstances.at(-1);

  return {
    requestId:
      input.requestId ??
      `plan:${chronicle.id}:${progressIndex}:${sceneInstances.length + 1}`,
    requestedAt: new Date().toISOString(),
    book: {
      worldId: world.id,
      bookId: book.id,
      bookVersionId: bookVersion.id,
      versionLabel: bookVersion.versionLabel
    },
    chronicle: {
      chronicleId: chronicle.id,
      chronicleStatus:
        chronicle.status === "active" ? "active" : chronicle.status,
      sceneCount: sceneInstances.length,
      progressIndex,
      endingLocked: chronicleState?.endingLocked ?? false,
      latestSceneInstanceId:
        chronicleState?.currentSceneInstanceId ?? latestScene?.id,
      lastResolvedChoiceKey:
        typeof summary.lastResolvedChoiceKey === "string"
          ? summary.lastResolvedChoiceKey
          : undefined
    },
    perspective: {
      perspectiveId: selectedPerspective.id,
      characterId: selectedPerspective.characterId,
      perspectiveSlug: selectedPerspective.slug,
      perspectiveName: selectedPerspective.name,
      voiceGuide: selectedPerspective.voiceGuide ?? undefined,
      knowledgeBaseline: selectedPerspective.knowledgeBaseline,
      eligibilityRules: selectedPerspective.eligibilityRules
    },
    knowledge: {
      entries: createKnowledgeEntries(knowledgeEntries)
    },
    milestones: {
      milestones: milestoneEntries
    },
    reveals: {
      revealEligibility: {
        candidates: revealCandidates,
        allowed: [],
        blocked: []
      }
    },
    pacing: {
      snapshot: pacingSnapshot,
      activeTarget: firstPacingRule
        ? {
            targetKey: `target:${firstPacingRule.id}`,
            label: `${firstPacingRule.scope}:${firstPacingRule.ruleType}`,
            desiredCadence: "steady",
            targetWindowScenes:
              readNumber(firstPacingRule.ruleConfig, "targetWindowScenes") ??
              undefined
          }
        : undefined
    },
    endings: {
      candidates: {
        candidates: endingCandidates
      },
      currentEligibility: {
        status: "none-eligible",
        eligibleEndings: [],
        blockedEndings: endingCandidates.map((candidate) => ({
          endingRuleId: candidate.endingRuleId,
          endingKey: candidate.endingKey,
          reason: {
            code: "unknown",
            message:
              "Ending eligibility is evaluated during planning execution."
          }
        }))
      }
    },
    previousScene: latestScene
      ? {
          sceneInstanceId: latestScene.id,
          sceneKind: latestScene.sceneKind,
          sceneGoal: latestScene.sceneGoal,
          resolvedAt: latestScene.updatedAt
        }
      : undefined,
    continuityFacts: canonEntries
      .filter((entry) => entry.visibility !== "hidden")
      .slice(0, 8)
      .map((entry) => entry.canonicalText)
  };
}

export const runtimePlanningContextLoader: PlanningContextLoader = {
  loadPlanningContext: loadPlanningContextForChronicle
};
