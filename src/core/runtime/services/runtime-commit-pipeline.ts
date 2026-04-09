import type {
  InstantiateSceneInput,
  InstantiateSceneResult,
  ResolveChoiceInput,
  ResolveChoiceResult,
  RuntimeCommitDiagnostics,
  RuntimeCommitIssue,
  RuntimeCommitPipelineService,
  RuntimeCommitStore
} from "@/core/runtime/contracts";
import { mapChoiceEffects } from "@/core/runtime/contracts";
import type {
  GuardIssue,
  GuardValidationResult
} from "@/core/validators/contracts";
import {
  validateCanonCommitEffectsInput,
  validateChronicleProjectionInput,
  validateEndingTransition,
  validateKnowledgeUpdateInput,
  validatePlannerScenePackage,
  validateRevealUsage,
  validateRuntimeInstantiationInput
} from "@/core/validators/services";

import { appendRuntimeCommitEvent } from "./append-event";
import { instantiateScenePackage } from "./instantiate-scene";
import {
  refreshChronicleStateForInstantiation,
  refreshChronicleStateForResolution
} from "./refresh-chronicle-state";
import { resolveChoiceSelection } from "./resolve-choice";
import { applyCanonCommits } from "./update-canon-commits";
import { applyKnowledgeUpdates } from "./update-knowledge";
import {
  updatePerspectiveRunForInstantiation,
  updatePerspectiveRunForResolution
} from "./update-perspective-run";

function createIssue(
  code: RuntimeCommitIssue["code"],
  message: string,
  context?: Record<string, unknown>
): RuntimeCommitIssue {
  return {
    code,
    severity: "error",
    message,
    context
  };
}

function createDiagnostics(
  requestId: string,
  issues: RuntimeCommitIssue[],
  notes: string[] = []
): RuntimeCommitDiagnostics {
  return {
    requestId,
    generatedAt: new Date().toISOString(),
    issues,
    notes
  };
}

function mapGuardIssueToRuntimeCode(
  code: GuardIssue["code"]
): RuntimeCommitIssue["code"] {
  if (code === "missing-decision-choices" || code === "invalid-scene-kind") {
    return "invalid-planner-package";
  }

  if (code === "reveal-not-allowed" || code === "reveal-blocked") {
    return "reveal-not-allowed";
  }

  if (
    code === "knowledge-status-regression" ||
    code === "invalid-knowledge-key"
  ) {
    return "knowledge-state-contradiction";
  }

  if (
    code === "canon-commit-contradiction" ||
    code === "invalid-canon-commit-key"
  ) {
    return "canon-commit-contradiction";
  }

  if (code === "chronicle-projection-mismatch") {
    return "chronicle-projection-mismatch";
  }

  if (code === "ending-not-eligible" || code === "ending-transition-invalid") {
    return "ending-transition-invalid";
  }

  if (
    code === "invalid-version-context" ||
    code === "invalid-perspective-run" ||
    code === "contradictory-reveal-sets" ||
    code === "duplicate-choice-key" ||
    code === "invalid-ending-eligibility" ||
    code === "missing-continuity-fact"
  ) {
    return "invalid-planner-package";
  }

  return "validation-guard-failed";
}

function toRuntimeIssueFromGuard(
  guardResult: GuardValidationResult,
  defaultCode: RuntimeCommitIssue["code"] = "validation-guard-failed"
): RuntimeCommitIssue {
  const blockingIssue = guardResult.issues.find((issue) => issue.blocking);

  if (!blockingIssue) {
    return createIssue(
      defaultCode,
      `Validation guard ${guardResult.domain} failed without a blocking issue.`
    );
  }

  return createIssue(
    mapGuardIssueToRuntimeCode(blockingIssue.code),
    blockingIssue.message,
    blockingIssue.context
  );
}

function readRevealGateSetFromPlannerPayload(
  plannerPayload: Record<string, unknown>,
  key: "allowedReveals" | "blockedReveals"
): string[] {
  const scenePackage =
    typeof plannerPayload.scenePackage === "object" &&
    plannerPayload.scenePackage !== null &&
    !Array.isArray(plannerPayload.scenePackage)
      ? (plannerPayload.scenePackage as Record<string, unknown>)
      : null;
  const scene =
    scenePackage &&
    typeof scenePackage.scene === "object" &&
    scenePackage.scene !== null &&
    !Array.isArray(scenePackage.scene)
      ? (scenePackage.scene as Record<string, unknown>)
      : null;
  const revealList = scene?.[key];

  if (!Array.isArray(revealList)) {
    return [];
  }

  return revealList.flatMap((entry) => {
    if (
      typeof entry !== "object" ||
      entry === null ||
      Array.isArray(entry) ||
      typeof (entry as Record<string, unknown>).revealKey !== "string"
    ) {
      return [];
    }

    return [(entry as Record<string, string>).revealKey];
  });
}

function toFailureInstantiateResult(
  requestId: string,
  issue: RuntimeCommitIssue,
  notes: string[] = []
): InstantiateSceneResult {
  return {
    status: "failure",
    diagnostics: createDiagnostics(requestId, [issue], notes)
  };
}

function toFailureResolveResult(
  requestId: string,
  issue: RuntimeCommitIssue,
  notes: string[] = []
): ResolveChoiceResult {
  return {
    status: "failure",
    diagnostics: createDiagnostics(requestId, [issue], notes)
  };
}

export class RuntimeCommitPipeline implements RuntimeCommitPipelineService {
  constructor(private readonly store: RuntimeCommitStore) {}

  async instantiateScene(
    input: InstantiateSceneInput
  ): Promise<InstantiateSceneResult> {
    return this.store.runInTransaction(async (txStore) => {
      const plannerValidation = validatePlannerScenePackage({
        scenePackage: input.plannerResult.scenePackage,
        expectedChronicleId: input.chronicleId
      });

      if (!plannerValidation.ok) {
        return toFailureInstantiateResult(
          input.requestId,
          toRuntimeIssueFromGuard(plannerValidation, "invalid-planner-package"),
          plannerValidation.issues.map((issue) => issue.message)
        );
      }

      if (
        input.plannerResult.scenePackage.scene.decisionPackage.choices
          .length === 0
      ) {
        return toFailureInstantiateResult(
          input.requestId,
          createIssue(
            "invalid-planner-package",
            "Planner scene package must include at least one choice."
          )
        );
      }

      const chronicle = await txStore.getChronicleById(input.chronicleId);

      if (!chronicle) {
        return toFailureInstantiateResult(
          input.requestId,
          createIssue(
            "chronicle-not-found",
            `Chronicle ${input.chronicleId} does not exist.`
          )
        );
      }

      const perspectiveRun = await txStore.getPerspectiveRunById(
        input.perspectiveRunId
      );

      if (!perspectiveRun || perspectiveRun.chronicleId !== chronicle.id) {
        return toFailureInstantiateResult(
          input.requestId,
          createIssue(
            "perspective-run-not-found",
            "Perspective run is missing or does not belong to the target chronicle.",
            {
              chronicleId: chronicle.id,
              perspectiveRunId: input.perspectiveRunId
            }
          )
        );
      }

      const runtimeInstantiationValidation = validateRuntimeInstantiationInput({
        chronicleId: chronicle.id,
        perspectiveRunChronicleId: perspectiveRun.chronicleId,
        scenePackage: input.plannerResult.scenePackage
      });

      if (!runtimeInstantiationValidation.ok) {
        return toFailureInstantiateResult(
          input.requestId,
          toRuntimeIssueFromGuard(
            runtimeInstantiationValidation,
            "invalid-planner-package"
          ),
          runtimeInstantiationValidation.issues.map((issue) => issue.message)
        );
      }

      const instantiated = await instantiateScenePackage(txStore, input);
      const sceneInstantiatedEvent = await appendRuntimeCommitEvent(txStore, {
        chronicleId: chronicle.id,
        eventType: "scene_instantiated",
        causedByType: "planner",
        causedById: input.plannerResult.plannerDiagnostics.requestId,
        payload: {
          sceneInstanceId: instantiated.sceneInstance.id,
          plannerCycle: instantiated.plannerCycle,
          sceneKind: instantiated.sceneInstance.sceneKind,
          sceneGoal: instantiated.sceneInstance.sceneGoal
        }
      });
      const sceneChoicesCreatedEvent = await appendRuntimeCommitEvent(txStore, {
        chronicleId: chronicle.id,
        eventType: "scene_choices_created",
        causedByType: "scene_instance",
        causedById: instantiated.sceneInstance.id,
        payload: {
          sceneInstanceId: instantiated.sceneInstance.id,
          choiceCount: instantiated.sceneChoices.length,
          enabledChoiceCount: instantiated.sceneChoices.filter(
            (choice) => choice.isEnabled
          ).length
        }
      });

      const updatedPerspectiveRun = await updatePerspectiveRunForInstantiation(
        txStore,
        {
          perspectiveRun,
          sceneInstanceId: instantiated.sceneInstance.id
        }
      );

      if (!updatedPerspectiveRun) {
        return toFailureInstantiateResult(
          input.requestId,
          createIssue(
            "perspective-run-not-found",
            "Failed to refresh perspective run projection after instantiation."
          )
        );
      }

      const perspectiveRunEvent = await appendRuntimeCommitEvent(txStore, {
        chronicleId: chronicle.id,
        eventType: "perspective_run_updated",
        causedByType: "scene_instance",
        causedById: instantiated.sceneInstance.id,
        payload: {
          perspectiveRunId: updatedPerspectiveRun.id,
          entryCount: updatedPerspectiveRun.entryCount,
          lastSceneInstanceId: updatedPerspectiveRun.lastSceneInstanceId
        }
      });

      const refreshedChronicleState =
        await refreshChronicleStateForInstantiation(txStore, {
          chronicleId: chronicle.id,
          perspectiveId: perspectiveRun.perspectiveId,
          sceneInstanceId: instantiated.sceneInstance.id,
          plannerCycle: instantiated.plannerCycle,
          plannerRequestId: input.plannerResult.plannerDiagnostics.requestId
        });

      if (!refreshedChronicleState) {
        return toFailureInstantiateResult(
          input.requestId,
          createIssue(
            "chronicle-state-not-found",
            "Failed to refresh chronicle state projection after instantiation."
          )
        );
      }

      const chronicleProjectionValidation = validateChronicleProjectionInput({
        chronicleId: chronicle.id,
        projection: refreshedChronicleState,
        currentSceneChronicleId: instantiated.sceneInstance.chronicleId,
        currentPerspectiveId: perspectiveRun.perspectiveId
      });

      if (!chronicleProjectionValidation.ok) {
        return toFailureInstantiateResult(
          input.requestId,
          toRuntimeIssueFromGuard(
            chronicleProjectionValidation,
            "chronicle-projection-mismatch"
          ),
          chronicleProjectionValidation.issues.map((issue) => issue.message)
        );
      }

      const chronicleStateEvent = await appendRuntimeCommitEvent(txStore, {
        chronicleId: chronicle.id,
        eventType: "chronicle_state_refreshed",
        causedByType: "scene_instance",
        causedById: instantiated.sceneInstance.id,
        payload: {
          chronicleId: chronicle.id,
          currentSceneInstanceId:
            refreshedChronicleState.currentSceneInstanceId,
          currentPerspectiveId: refreshedChronicleState.currentPerspectiveId,
          progressIndex: refreshedChronicleState.progressIndex,
          endingLocked: refreshedChronicleState.endingLocked
        }
      });

      return {
        status: "success",
        data: {
          sceneInstance: instantiated.sceneInstance,
          sceneChoices: instantiated.sceneChoices,
          perspectiveRun: updatedPerspectiveRun,
          chronicleState: refreshedChronicleState,
          events: [
            sceneInstantiatedEvent,
            sceneChoicesCreatedEvent,
            perspectiveRunEvent,
            chronicleStateEvent
          ]
        },
        diagnostics: createDiagnostics(
          input.requestId,
          [],
          [
            "Scene package instantiated and persisted.",
            "Scene choices persisted and event log appended.",
            "Perspective run and chronicle state projections refreshed."
          ]
        )
      };
    });
  }

  async resolveChoice(input: ResolveChoiceInput): Promise<ResolveChoiceResult> {
    return this.store.runInTransaction(async (txStore) => {
      const chronicle = await txStore.getChronicleById(input.chronicleId);

      if (!chronicle) {
        return toFailureResolveResult(
          input.requestId,
          createIssue(
            "chronicle-not-found",
            `Chronicle ${input.chronicleId} does not exist.`
          )
        );
      }

      const resolved = await resolveChoiceSelection(txStore, input);

      if (resolved.status === "failure") {
        return toFailureResolveResult(input.requestId, resolved.issue);
      }

      const perspectiveRun = await txStore.getPerspectiveRunById(
        resolved.sceneInstance.perspectiveRunId
      );

      if (!perspectiveRun) {
        return toFailureResolveResult(
          input.requestId,
          createIssue(
            "perspective-run-not-found",
            "Perspective run for the resolved scene instance could not be loaded.",
            {
              perspectiveRunId: resolved.sceneInstance.perspectiveRunId
            }
          )
        );
      }

      const choiceResolvedEvent = await appendRuntimeCommitEvent(txStore, {
        chronicleId: chronicle.id,
        eventType: "choice_resolved",
        causedByType: "scene_choice",
        causedById: resolved.selectedChoice.id,
        payload: {
          sceneInstanceId: resolved.sceneInstance.id,
          sceneChoiceId: resolved.selectedChoice.id,
          choiceKey: resolved.selectedChoice.choiceKey,
          resolutionId: resolved.resolution.id
        }
      });

      const runtimeEffects = mapChoiceEffects(resolved.selectedChoiceEffects);
      const allowedRevealKeys = readRevealGateSetFromPlannerPayload(
        resolved.sceneInstance.plannerPayload,
        "allowedReveals"
      );
      const blockedRevealKeys = readRevealGateSetFromPlannerPayload(
        resolved.sceneInstance.plannerPayload,
        "blockedReveals"
      );
      const revealValidation = validateRevealUsage({
        revealKeysToApply: runtimeEffects.projectionHints.revealedKeys,
        allowedRevealKeys,
        blockedRevealKeys
      });

      if (!revealValidation.ok) {
        return toFailureResolveResult(
          input.requestId,
          toRuntimeIssueFromGuard(revealValidation, "reveal-not-allowed"),
          revealValidation.issues.map((issue) => issue.message)
        );
      }

      const endingValidation = validateEndingTransition({
        sceneKind: resolved.sceneInstance.sceneKind,
        hasEndingEffect: resolved.selectedChoiceEffects.some(
          (effect) => effect.effectType === "ending"
        )
      });

      if (!endingValidation.ok) {
        return toFailureResolveResult(
          input.requestId,
          toRuntimeIssueFromGuard(
            endingValidation,
            "ending-transition-invalid"
          ),
          endingValidation.issues.map((issue) => issue.message)
        );
      }

      const existingKnowledgeEntries =
        await txStore.getKnowledgeEntriesByChronicleAndPerspective(
          chronicle.id,
          perspectiveRun.perspectiveId
        );
      const knowledgeValidation = validateKnowledgeUpdateInput({
        effects: runtimeEffects.knowledgeEffects,
        existingEntries: existingKnowledgeEntries
      });

      if (!knowledgeValidation.ok) {
        return toFailureResolveResult(
          input.requestId,
          toRuntimeIssueFromGuard(
            knowledgeValidation,
            "knowledge-state-contradiction"
          ),
          knowledgeValidation.issues.map((issue) => issue.message)
        );
      }

      const existingCanonCommits = await txStore.getCanonCommitsByChronicleId(
        chronicle.id
      );
      const canonValidation = validateCanonCommitEffectsInput({
        effects: runtimeEffects.canonCommitEffects,
        existingCommits: existingCanonCommits
      });

      if (!canonValidation.ok) {
        return toFailureResolveResult(
          input.requestId,
          toRuntimeIssueFromGuard(
            canonValidation,
            "canon-commit-contradiction"
          ),
          canonValidation.issues.map((issue) => issue.message)
        );
      }

      const knowledgeResult = await applyKnowledgeUpdates(txStore, {
        chronicleId: chronicle.id,
        perspectiveId: perspectiveRun.perspectiveId,
        sourceSceneInstanceId: resolved.sceneInstance.id,
        effects: runtimeEffects.knowledgeEffects
      });

      const knowledgeEvents = await Promise.all(
        knowledgeResult.updatedEntries.map((entry) =>
          appendRuntimeCommitEvent(txStore, {
            chronicleId: chronicle.id,
            eventType: "knowledge_state_updated",
            causedByType: "choice_resolution",
            causedById: resolved.resolution.id,
            payload: {
              knowledgeStateId: entry.id,
              knowledgeKey: entry.knowledgeKey,
              knowledgeStatus: entry.knowledgeStatus,
              sourceSceneInstanceId: entry.sourceSceneInstanceId
            }
          })
        )
      );

      const canonCommitResult = await applyCanonCommits(txStore, {
        chronicleId: chronicle.id,
        sourceEventId: choiceResolvedEvent.id,
        effects: runtimeEffects.canonCommitEffects
      });

      const canonEvents = await Promise.all(
        canonCommitResult.commits.map((commit) =>
          appendRuntimeCommitEvent(txStore, {
            chronicleId: chronicle.id,
            eventType: "canon_commit_created",
            causedByType: "choice_resolution",
            causedById: resolved.resolution.id,
            payload: {
              canonCommitId: commit.id,
              commitType: commit.commitType,
              commitKey: commit.commitKey
            }
          })
        )
      );

      await txStore.updateSceneInstanceStatus(
        resolved.sceneInstance.id,
        "resolved"
      );

      const updatedPerspectiveRun = await updatePerspectiveRunForResolution(
        txStore,
        {
          perspectiveRun,
          sceneInstanceId: resolved.sceneInstance.id,
          selectedChoiceKey: resolved.selectedChoice.choiceKey,
          knowledgeDelta: knowledgeResult.updatedEntries.length,
          endingLocked: runtimeEffects.projectionHints.endingLocked
        }
      );

      if (!updatedPerspectiveRun) {
        return toFailureResolveResult(
          input.requestId,
          createIssue(
            "perspective-run-not-found",
            "Failed to refresh perspective run projection after choice resolution."
          )
        );
      }

      const perspectiveEvent = await appendRuntimeCommitEvent(txStore, {
        chronicleId: chronicle.id,
        eventType: "perspective_run_updated",
        causedByType: "choice_resolution",
        causedById: resolved.resolution.id,
        payload: {
          perspectiveRunId: updatedPerspectiveRun.id,
          knowledgeScore: updatedPerspectiveRun.knowledgeScore,
          status: updatedPerspectiveRun.status
        }
      });

      const refreshedChronicleState = await refreshChronicleStateForResolution(
        txStore,
        {
          chronicleId: chronicle.id,
          perspectiveId: perspectiveRun.perspectiveId,
          sceneInstanceId: resolved.sceneInstance.id,
          selectedChoiceId: resolved.selectedChoice.id,
          selectedChoiceKey: resolved.selectedChoice.choiceKey,
          selectedChoiceLabel: resolved.selectedChoice.label,
          hints: runtimeEffects.projectionHints
        }
      );

      if (!refreshedChronicleState) {
        return toFailureResolveResult(
          input.requestId,
          createIssue(
            "chronicle-state-not-found",
            "Chronicle state projection is missing and could not be refreshed."
          )
        );
      }

      const chronicleProjectionValidation = validateChronicleProjectionInput({
        chronicleId: chronicle.id,
        projection: refreshedChronicleState,
        currentSceneChronicleId: resolved.sceneInstance.chronicleId,
        currentPerspectiveId: perspectiveRun.perspectiveId
      });

      if (!chronicleProjectionValidation.ok) {
        return toFailureResolveResult(
          input.requestId,
          toRuntimeIssueFromGuard(
            chronicleProjectionValidation,
            "chronicle-projection-mismatch"
          ),
          chronicleProjectionValidation.issues.map((issue) => issue.message)
        );
      }

      const chronicleStateEvent = await appendRuntimeCommitEvent(txStore, {
        chronicleId: chronicle.id,
        eventType: "chronicle_state_refreshed",
        causedByType: "choice_resolution",
        causedById: resolved.resolution.id,
        payload: {
          chronicleId: chronicle.id,
          progressIndex: refreshedChronicleState.progressIndex,
          endingLocked: refreshedChronicleState.endingLocked,
          currentSceneInstanceId: refreshedChronicleState.currentSceneInstanceId
        }
      });

      return {
        status: "success",
        data: {
          resolution: resolved.resolution,
          selectedChoice: resolved.selectedChoice,
          selectedChoiceEffects: resolved.selectedChoiceEffects,
          knowledgeUpdates: knowledgeResult.updatedEntries,
          canonCommits: canonCommitResult.commits,
          chronicleState: refreshedChronicleState,
          perspectiveRun: updatedPerspectiveRun,
          events: [
            choiceResolvedEvent,
            ...knowledgeEvents,
            ...canonEvents,
            perspectiveEvent,
            chronicleStateEvent
          ]
        },
        diagnostics: createDiagnostics(
          input.requestId,
          [],
          [
            "Choice resolved and persisted.",
            "Knowledge and canon updates committed from structural effect hints.",
            "Perspective run and chronicle state projections refreshed."
          ]
        )
      };
    });
  }
}

export function createRuntimeCommitPipeline(
  store: RuntimeCommitStore
): RuntimeCommitPipelineService {
  return new RuntimeCommitPipeline(store);
}
