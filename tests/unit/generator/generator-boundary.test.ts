import { describe, expect, it } from "vitest";

import type { SceneGenerationAdapter } from "@/core/generator/adapters";
import { createMockSceneGenerationAdapter } from "@/core/generator/adapters";
import type { GeneratorSceneInput } from "@/core/generator/contracts";
import { buildScenePromptBundle } from "@/core/generator/prompts";
import { createGeneratorSceneService } from "@/core/generator/services";
import { validateGeneratedSceneOutput } from "@/core/generator/validators";

function createSceneInput(): GeneratorSceneInput {
  return {
    requestId: "gen:req:1",
    chronicleId: "chronicle-1",
    sceneInstanceId: "scene-1",
    sceneKind: "development",
    sceneGoal: "advance-arc",
    plannerCycle: 2,
    perspective: {
      perspectiveId: "perspective-1",
      perspectiveName: "Lead POV",
      characterName: "Mara",
      voiceGuide: "Measured and observant."
    },
    constraints: [
      {
        constraintKey: "constraint:stay-hidden",
        description: "Keep the faction operative hidden from guards.",
        source: "continuity",
        required: true
      }
    ],
    continuityFacts: [
      {
        factKey: "fact:mentor-alive",
        statement: "The mentor is alive but missing.",
        source: "canon",
        required: true
      }
    ],
    approvedReveals: [
      {
        revealKey: "reveal:mentor-letter",
        summary: "A coded letter confirms the mentor's location.",
        presentationHint: "Subtle foreshadowing."
      }
    ],
    choices: [
      {
        choiceId: "choice-id-1",
        choiceKey: "choice:press-forward",
        structuralLabel: "Press forward",
        intentLabel: "advance the main arc",
        availability: "enabled"
      },
      {
        choiceId: "choice-id-2",
        choiceKey: "choice:hold-position",
        structuralLabel: "Hold position",
        intentLabel: "stabilize continuity",
        availability: "disabled"
      }
    ],
    fallbackBody: {
      title: "Scene structure available",
      paragraphs: [
        "The scene continues under approved structural constraints.",
        "Generated prose is unavailable, so this fallback body is shown."
      ]
    },
    tone: {
      toneKey: "tense-investigative",
      toneDescription: "Tension with quiet investigative momentum."
    },
    metadata: {
      source: "generator-boundary-test"
    }
  };
}

describe("generator boundary", () => {
  it("accepts valid generated output through schema validation", () => {
    const sceneInput = createSceneInput();
    const result = validateGeneratedSceneOutput({
      sceneInput,
      payload: {
        prose:
          "Mara studies the coded letter and weighs each risk before moving.",
        summary: "Mara decodes a lead while balancing immediate danger.",
        choices: [
          {
            choiceKey: "choice:press-forward",
            label: "Pursue the coded trail",
            body: "Advance the mission before the trail goes cold."
          },
          {
            choiceKey: "choice:hold-position",
            label: "Maintain covert position",
            body: "Delay movement to protect continuity constraints."
          }
        ],
        presentationNotes: ["Keep reveal language restrained."]
      }
    });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error("Expected valid generator output.");
    }

    expect(result.output.mode).toBe("generated");
    expect(result.output.choices).toHaveLength(2);
    expect(result.output.choices[0]?.choiceKey).toBe("choice:press-forward");
  });

  it("returns structured fallback when adapter output fails validation", async () => {
    const invalidAdapter: SceneGenerationAdapter = {
      adapterId: "invalid-output-adapter",
      async generateScene() {
        return {
          status: "success",
          output: {
            prose: "",
            choices: [{ choiceKey: "choice:press-forward", label: "" }]
          }
        };
      }
    };
    const generatorService = createGeneratorSceneService({
      adapter: invalidAdapter,
      now: () => "2026-04-08T00:00:00.000Z"
    });

    const result = await generatorService.generateScene({
      input: createSceneInput()
    });

    expect(result.status).toBe("fallback");

    if (result.status !== "fallback") {
      throw new Error("Expected fallback result for invalid output.");
    }

    expect(result.fallbackReason).toBe("validation-failed");
    expect(result.output.presentation.mode).toBe("fallback");
    expect(
      result.diagnostics.issues.some((issue) => issue.code === "missing-prose")
    ).toBe(true);
  });

  it("supports a deterministic mock adapter path for local development", async () => {
    const generatorService = createGeneratorSceneService({
      adapter: createMockSceneGenerationAdapter(),
      now: () => "2026-04-08T00:00:00.000Z"
    });
    const result = await generatorService.generateScene({
      input: createSceneInput()
    });

    expect(result.status).toBe("success");

    if (result.status !== "success") {
      throw new Error("Expected success from mock adapter.");
    }

    expect(result.output.presentation.mode).toBe("generated");
    expect(result.output.presentation.prose).toContain("Lead POV");
    expect(result.output.presentation.choices).toHaveLength(2);
  });

  it("builds prompts from approved structural input only", () => {
    const sceneInput = {
      ...createSceneInput(),
      // Intentionally attached to assert prompt builders only use approved contract fields.
      plannerPayload: {
        forbidden: "should-not-leak"
      }
    } as GeneratorSceneInput & {
      readonly plannerPayload: Record<string, unknown>;
    };
    const prompt = buildScenePromptBundle(sceneInput);

    expect(prompt.systemPrompt).toContain("presentation renderer");
    expect(prompt.userPrompt).toContain("sceneKind");
    expect(prompt.userPrompt).toContain("choice:press-forward");
    expect(prompt.userPrompt).not.toContain("should-not-leak");
    expect(prompt.userPrompt).not.toContain("decide what scene comes next");
  });

  it("does not mutate approved scene input while generating presentation", async () => {
    const sceneInput = createSceneInput();
    const snapshot = JSON.stringify(sceneInput);
    const generatorService = createGeneratorSceneService({
      adapter: createMockSceneGenerationAdapter(),
      now: () => "2026-04-08T00:00:00.000Z"
    });

    const result = await generatorService.generateScene({
      input: sceneInput
    });

    expect(JSON.stringify(sceneInput)).toBe(snapshot);
    expect(result.status).toBe("success");
  });
});
