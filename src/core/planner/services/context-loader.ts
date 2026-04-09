import type {
  PlannerFailureResult,
  PlannerIssue,
  PlannerService,
  PlanningContext,
  PlanNextSceneOutput
} from "@/core/planner/contracts";

export interface LoadPlanningContextInput {
  readonly chronicleId: string;
  readonly requestId?: string;
  readonly preferredPerspectiveId?: string;
}

export interface PlanningContextLoader {
  loadPlanningContext(
    input: LoadPlanningContextInput
  ): Promise<PlanningContext | null>;
}

function createMissingContextFailure(
  input: LoadPlanningContextInput
): PlannerFailureResult {
  const issue: PlannerIssue = {
    code: "insufficient-context",
    severity: "error",
    message: `No planning context could be loaded for chronicle ${input.chronicleId}.`
  };

  return {
    status: "failure",
    reason: "insufficient-context",
    diagnostics: {
      requestId: input.requestId ?? `req-${input.chronicleId}`,
      generatedAt: new Date().toISOString(),
      issues: [issue],
      notes: ["Context loader returned null and planner execution was skipped."]
    }
  };
}

export async function planNextSceneForChronicle(
  planner: PlannerService,
  contextLoader: PlanningContextLoader,
  input: LoadPlanningContextInput
): Promise<PlanNextSceneOutput> {
  const context = await contextLoader.loadPlanningContext(input);

  if (!context) {
    return createMissingContextFailure(input);
  }

  return planner.planNextScene({
    context
  });
}
