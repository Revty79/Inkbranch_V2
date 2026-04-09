import "server-only";

import type { AppEnv } from "@/lib/env";
import { readAppEnv } from "@/lib/env";

import {
  createMockSceneGenerationAdapter,
  createOpenAiSceneGenerationAdapter,
  type SceneGenerationAdapter
} from "../adapters";
import type { SceneGenerator } from "../contracts";

import { createGeneratorSceneService } from "./generate-scene";

export type GeneratorProvider = "mock" | "openai";

export interface GeneratorRuntimeConfig {
  readonly generationEnabled: boolean;
  readonly provider: GeneratorProvider;
  readonly openAiApiKey?: string;
  readonly openAiModel: string;
  readonly openAiBaseUrl?: string;
}

export interface ConfiguredGeneratorService {
  readonly service: SceneGenerator;
  readonly runtime: GeneratorRuntimeConfig;
}

function parseBooleanFlag(
  value: string | undefined,
  fallbackValue: boolean
): boolean {
  if (!value) {
    return fallbackValue;
  }

  const normalized = value.trim().toLowerCase();
  if (normalized === "true" || normalized === "1" || normalized === "yes") {
    return true;
  }

  if (normalized === "false" || normalized === "0" || normalized === "no") {
    return false;
  }

  return fallbackValue;
}

function parseProvider(
  value: string | undefined,
  fallbackValue: GeneratorProvider
): GeneratorProvider {
  if (value === "openai" || value === "mock") {
    return value;
  }

  return fallbackValue;
}

function createMissingProviderConfigAdapter(
  message: string
): SceneGenerationAdapter {
  return {
    adapterId: "missing-provider-config",
    async generateScene() {
      return {
        status: "failure",
        reason: "provider-unavailable",
        message,
        metadata: {
          adapterId: "missing-provider-config"
        }
      };
    }
  };
}

export function resolveGeneratorRuntimeConfig(
  env: AppEnv = readAppEnv()
): GeneratorRuntimeConfig {
  const providerDefault: GeneratorProvider = env.openAiApiKey
    ? "openai"
    : "mock";

  return {
    generationEnabled: parseBooleanFlag(env.generatorEnabled, true),
    provider: parseProvider(env.generatorProvider, providerDefault),
    openAiApiKey: env.openAiApiKey,
    openAiModel: env.openAiModel?.trim() || "gpt-5.4-mini",
    openAiBaseUrl: env.openAiBaseUrl?.trim() || undefined
  };
}

export function createConfiguredGeneratorSceneService(
  config: GeneratorRuntimeConfig = resolveGeneratorRuntimeConfig()
): ConfiguredGeneratorService {
  const adapter =
    config.provider === "openai"
      ? config.openAiApiKey
        ? createOpenAiSceneGenerationAdapter({
            apiKey: config.openAiApiKey,
            model: config.openAiModel,
            baseUrl: config.openAiBaseUrl
          })
        : createMissingProviderConfigAdapter(
            "OPENAI_API_KEY is required when GENERATOR_PROVIDER is set to openai."
          )
      : createMockSceneGenerationAdapter();

  return {
    runtime: config,
    service: createGeneratorSceneService({
      adapter
    })
  };
}
