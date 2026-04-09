import type { SceneGenerationAdapter } from "../adapters";
import type {
  GenerateSceneRequest,
  GenerateSceneResponse,
  GeneratedSceneOutput,
  GeneratedScenePresentation,
  GeneratorDiagnostics,
  GeneratorFallbackReason,
  GeneratorFailureReason,
  GeneratorIssue,
  SceneGenerator
} from "../contracts";
import { buildScenePromptBundle } from "../prompts";
import { validateGeneratedSceneOutput } from "../validators";
import { validateGeneratorOutputSafety } from "@/core/validators/services";

import { createFallbackSceneOutput } from "./fallback";

export interface GeneratorSceneServiceOptions {
  readonly adapter: SceneGenerationAdapter;
  readonly now?: () => string;
}

function createIssue(
  code: GeneratorIssue["code"],
  message: string,
  severity: GeneratorIssue["severity"] = "error",
  context?: Record<string, unknown>
): GeneratorIssue {
  return {
    code,
    severity,
    message,
    context
  };
}

function createDiagnostics(
  requestId: string,
  generatedAt: string,
  issues: GeneratorIssue[],
  notes: string[],
  metadata?: Record<string, unknown>
): GeneratorDiagnostics {
  return {
    requestId,
    generatedAt,
    issues,
    notes,
    metadata
  };
}

function toFailureReason(
  fallbackReason: GeneratorFallbackReason
): GeneratorFailureReason {
  if (fallbackReason === "validation-failed") {
    return "validation-failed";
  }

  if (fallbackReason === "provider-unavailable") {
    return "provider-unavailable";
  }

  if (fallbackReason === "adapter-failure") {
    return "adapter-failure";
  }

  if (fallbackReason === "generation-disabled") {
    return "generation-disabled";
  }

  if (fallbackReason === "timeout") {
    return "timeout";
  }

  return "unknown";
}

function toFallbackReason(
  reason: GeneratorFailureReason
): GeneratorFallbackReason {
  if (reason === "validation-failed") {
    return "validation-failed";
  }

  if (reason === "provider-unavailable") {
    return "provider-unavailable";
  }

  if (reason === "adapter-failure") {
    return "adapter-failure";
  }

  if (reason === "generation-disabled") {
    return "generation-disabled";
  }

  if (reason === "timeout") {
    return "timeout";
  }

  return "unknown";
}

function buildGeneratedSceneOutput(
  request: GenerateSceneRequest,
  presentation: GeneratedScenePresentation,
  metadata?: Record<string, unknown>
): GeneratedSceneOutput {
  return {
    requestId: request.input.requestId,
    chronicleId: request.input.chronicleId,
    sceneInstanceId: request.input.sceneInstanceId,
    sceneKind: request.input.sceneKind,
    sceneGoal: request.input.sceneGoal,
    plannerCycle: request.input.plannerCycle,
    presentation,
    metadata
  };
}

export class GeneratorSceneService implements SceneGenerator {
  private readonly now: () => string;

  constructor(private readonly options: GeneratorSceneServiceOptions) {
    this.now = options.now ?? (() => new Date().toISOString());
  }

  async generateScene(
    request: GenerateSceneRequest
  ): Promise<GenerateSceneResponse> {
    const generatedAt = this.now();
    const requestId = request.input.requestId;

    if (request.input.choices.length === 0) {
      const issue = createIssue(
        "invalid-input",
        "Generator scene input must include at least one approved choice."
      );

      return {
        status: "failure",
        reason: "invalid-input",
        diagnostics: createDiagnostics(
          requestId,
          generatedAt,
          [issue],
          ["Generation request rejected before adapter execution."]
        )
      };
    }

    if (request.options?.generationEnabled === false) {
      const issue = createIssue(
        "generation-disabled",
        "Generation is disabled for this request.",
        "warning"
      );

      return {
        status: "fallback",
        fallbackReason: "generation-disabled",
        output: createFallbackSceneOutput({
          sceneInput: request.input,
          fallbackReason: "generation-disabled",
          issues: [issue]
        }),
        diagnostics: createDiagnostics(
          requestId,
          generatedAt,
          [issue],
          ["Generation skipped because generationEnabled was false."]
        )
      };
    }

    let prompt;
    try {
      prompt = buildScenePromptBundle(request.input);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unknown prompt construction error.";
      const issue = createIssue("adapter-failure", message);
      const fallbackReason: GeneratorFallbackReason = "adapter-failure";

      return {
        status: "fallback",
        fallbackReason,
        output: createFallbackSceneOutput({
          sceneInput: request.input,
          fallbackReason,
          issues: [issue]
        }),
        diagnostics: createDiagnostics(
          requestId,
          generatedAt,
          [issue],
          ["Prompt build failed; fallback rendering returned."]
        )
      };
    }

    const adapterResult = await this.options.adapter.generateScene({
      request,
      prompt
    });

    if (adapterResult.status === "failure") {
      const fallbackReason = toFallbackReason(adapterResult.reason);
      const issue = createIssue(
        adapterResult.reason === "generation-disabled"
          ? "generation-disabled"
          : adapterResult.reason === "provider-unavailable"
            ? "provider-unavailable"
            : adapterResult.reason === "timeout"
              ? "timeout"
              : "adapter-failure",
        adapterResult.message,
        "warning",
        adapterResult.metadata
      );

      return {
        status: "fallback",
        fallbackReason,
        output: createFallbackSceneOutput({
          sceneInput: request.input,
          fallbackReason,
          issues: [issue]
        }),
        diagnostics: createDiagnostics(
          requestId,
          generatedAt,
          [issue],
          [
            `Adapter returned ${toFailureReason(fallbackReason)}; fallback rendering returned.`
          ]
        )
      };
    }

    const validationResult = validateGeneratedSceneOutput({
      sceneInput: request.input,
      payload: adapterResult.output
    });

    if (!validationResult.ok) {
      const fallbackIssue = createIssue(
        "fallback-applied",
        "Invalid generator output triggered fallback rendering.",
        "warning"
      );
      const issues = [...validationResult.issues, fallbackIssue];

      return {
        status: "fallback",
        fallbackReason: "validation-failed",
        output: createFallbackSceneOutput({
          sceneInput: request.input,
          fallbackReason: "validation-failed",
          issues
        }),
        diagnostics: createDiagnostics(requestId, generatedAt, issues, [
          "Output validation failed; fallback rendering returned."
        ])
      };
    }

    const generatorSafetyValidation = validateGeneratorOutputSafety({
      sceneInput: request.input,
      presentation: validationResult.output
    });

    if (!generatorSafetyValidation.ok) {
      const fallbackIssue = createIssue(
        "fallback-applied",
        "Generator safety validation failed; fallback rendering applied.",
        "warning"
      );
      const issues = [
        ...generatorSafetyValidation.issues.map((guardIssue) =>
          createIssue(
            guardIssue.code === "generator-choice-mismatch"
              ? "unexpected-choice"
              : "invalid-output-shape",
            guardIssue.message,
            guardIssue.severity === "warning" ? "warning" : "error",
            guardIssue.context
          )
        ),
        fallbackIssue
      ];

      return {
        status: "fallback",
        fallbackReason: "validation-failed",
        output: createFallbackSceneOutput({
          sceneInput: request.input,
          fallbackReason: "validation-failed",
          issues
        }),
        diagnostics: createDiagnostics(requestId, generatedAt, issues, [
          "Generator safety guard failed; fallback rendering returned."
        ])
      };
    }

    return {
      status: "success",
      output: buildGeneratedSceneOutput(
        request,
        validationResult.output,
        adapterResult.metadata
      ),
      diagnostics: createDiagnostics(
        requestId,
        generatedAt,
        [],
        ["Generation succeeded and output passed schema validation."]
      )
    };
  }
}

export function createGeneratorSceneService(
  options: GeneratorSceneServiceOptions
): SceneGenerator {
  return new GeneratorSceneService(options);
}
