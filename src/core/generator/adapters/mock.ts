import type { GeneratorChoiceInput } from "../contracts";

import type {
  AdapterGenerateSceneInput,
  AdapterGenerateSceneResult,
  SceneGenerationAdapter
} from "./base";

export interface MockSceneGenerationAdapterOptions {
  readonly shouldFail?: boolean;
  readonly failureReason?:
    | "adapter-failure"
    | "timeout"
    | "provider-unavailable";
}

function toSentenceCase(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return trimmed;
  }

  return `${trimmed[0].toUpperCase()}${trimmed.slice(1)}`;
}

function createChoiceBody(choice: GeneratorChoiceInput): string {
  return `${toSentenceCase(choice.intentLabel)} while preserving approved scene continuity.`;
}

export class MockSceneGenerationAdapter implements SceneGenerationAdapter {
  readonly adapterId = "mock-scene-generator";

  constructor(
    private readonly options: MockSceneGenerationAdapterOptions = {}
  ) {}

  async generateScene(
    input: AdapterGenerateSceneInput
  ): Promise<AdapterGenerateSceneResult> {
    if (this.options.shouldFail) {
      return {
        status: "failure",
        reason: this.options.failureReason ?? "adapter-failure",
        message: "Mock scene generator failure requested by test harness.",
        metadata: {
          adapterId: this.adapterId
        }
      };
    }

    const sceneInput = input.request.input;
    const perspectiveName = sceneInput.perspective.perspectiveName;
    const revealClause =
      sceneInput.approvedReveals.length > 0
        ? `Approved reveal focus: ${sceneInput.approvedReveals
            .map((reveal) => reveal.revealKey)
            .join(", ")}.`
        : "No reveals are approved for this scene.";
    const prose = `${perspectiveName} navigates a ${sceneInput.sceneKind} scene centered on ${sceneInput.sceneGoal}. ${revealClause}`;

    return {
      status: "success",
      output: {
        prose,
        summary: `Mock rendering for ${sceneInput.sceneKind} scene`,
        choices: sceneInput.choices.map((choice) => ({
          choiceKey: choice.choiceKey,
          label: toSentenceCase(choice.structuralLabel),
          body: createChoiceBody(choice)
        })),
        presentationNotes: [
          "Rendered by deterministic mock adapter for local generator-boundary verification."
        ]
      },
      metadata: {
        adapterId: this.adapterId,
        promptPreview: input.prompt.userPrompt.slice(0, 120)
      }
    };
  }
}

export function createMockSceneGenerationAdapter(
  options: MockSceneGenerationAdapterOptions = {}
): SceneGenerationAdapter {
  return new MockSceneGenerationAdapter(options);
}
