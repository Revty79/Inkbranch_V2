import { describe, expect, it } from "vitest";

import {
  createOpenAiSceneGenerationAdapter,
  type OpenAiSceneGenerationAdapterOptions
} from "@/core/generator/adapters";
import type { GeneratorSceneInput } from "@/core/generator/contracts";
import { buildScenePromptBundle } from "@/core/generator/prompts";
import {
  createConfiguredGeneratorSceneService,
  createGeneratorSceneService,
  resolveGeneratorRuntimeConfig
} from "@/core/generator/services";

function createSceneInput(): GeneratorSceneInput {
  return {
    requestId: "gen:int:req:1",
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
        "Fallback scene body.",
        "Generated prose unavailable in this environment."
      ]
    }
  };
}

function createOpenAiFetchStub(payload: unknown, status = 200): typeof fetch {
  return (async () =>
    new Response(JSON.stringify(payload), {
      status,
      headers: {
        "Content-Type": "application/json"
      }
    })) as typeof fetch;
}

function createAdapterOptions(
  fetchImpl: typeof fetch
): OpenAiSceneGenerationAdapterOptions {
  return {
    apiKey: "test-openai-key",
    model: "gpt-test-model",
    baseUrl: "https://api.openai.com/v1",
    fetchImpl
  };
}

describe("generator integration", () => {
  it("resolves runtime config with safe defaults and provider parsing", () => {
    const config = resolveGeneratorRuntimeConfig({
      nodeEnv: "test",
      generatorEnabled: "true",
      generatorProvider: "openai",
      openAiApiKey: "sk-test",
      openAiModel: "gpt-5.4-mini",
      openAiBaseUrl: "https://api.openai.com/v1"
    });

    expect(config.generationEnabled).toBe(true);
    expect(config.provider).toBe("openai");
    expect(config.openAiApiKey).toBe("sk-test");
    expect(config.openAiModel).toBe("gpt-5.4-mini");
  });

  it("returns provider-unavailable fallback when openai provider is selected without API key", async () => {
    const configuredService = createConfiguredGeneratorSceneService({
      generationEnabled: true,
      provider: "openai",
      openAiModel: "gpt-5.4-mini"
    });
    const result = await configuredService.service.generateScene({
      input: createSceneInput(),
      options: {
        generationEnabled: configuredService.runtime.generationEnabled
      }
    });

    expect(result.status).toBe("fallback");

    if (result.status !== "fallback") {
      throw new Error("Expected fallback when openai key is missing.");
    }

    expect(result.fallbackReason).toBe("provider-unavailable");
  });

  it("parses structured OpenAI output through the live adapter path", async () => {
    const adapter = createOpenAiSceneGenerationAdapter(
      createAdapterOptions(
        createOpenAiFetchStub({
          id: "resp_123",
          model: "gpt-test-model",
          output_text: JSON.stringify({
            prose: "Generated prose from OpenAI.",
            choices: [
              {
                choiceKey: "choice:press-forward",
                label: "Push ahead"
              },
              {
                choiceKey: "choice:hold-position",
                label: "Stay hidden"
              }
            ]
          })
        })
      )
    );
    const sceneInput = createSceneInput();
    const prompt = buildScenePromptBundle(sceneInput);

    const result = await adapter.generateScene({
      request: {
        input: sceneInput
      },
      prompt
    });

    expect(result.status).toBe("success");

    if (result.status !== "success") {
      throw new Error("Expected successful OpenAI adapter result.");
    }

    const payload = result.output as { prose: string };
    expect(payload.prose).toContain("Generated prose");
  });

  it("falls back when the live adapter returns schema-invalid structured output", async () => {
    const adapter = createOpenAiSceneGenerationAdapter(
      createAdapterOptions(
        createOpenAiFetchStub({
          output_text: JSON.stringify({
            prose: "",
            choices: []
          })
        })
      )
    );
    const service = createGeneratorSceneService({
      adapter,
      now: () => "2026-04-08T00:00:00.000Z"
    });
    const result = await service.generateScene({
      input: createSceneInput()
    });

    expect(result.status).toBe("fallback");

    if (result.status !== "fallback") {
      throw new Error("Expected fallback result for invalid live output.");
    }

    expect(result.fallbackReason).toBe("validation-failed");
  });

  it("uses the mock path for configured non-live environments", async () => {
    const configuredService = createConfiguredGeneratorSceneService({
      generationEnabled: true,
      provider: "mock",
      openAiModel: "gpt-5.4-mini"
    });
    const result = await configuredService.service.generateScene({
      input: createSceneInput(),
      options: {
        generationEnabled: configuredService.runtime.generationEnabled
      }
    });

    expect(result.status).toBe("success");
  });
});
