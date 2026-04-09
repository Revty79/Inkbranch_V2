export const ENV_KEYS = {
  nodeEnv: "NODE_ENV",
  appUrl: "NEXT_PUBLIC_APP_URL",
  databaseUrl: "DATABASE_URL",
  authSecret: "AUTH_SECRET",
  generatorEnabled: "GENERATOR_ENABLED",
  generatorProvider: "GENERATOR_PROVIDER",
  openAiApiKey: "OPENAI_API_KEY",
  openAiModel: "OPENAI_MODEL",
  openAiBaseUrl: "OPENAI_BASE_URL"
} as const;

export type AppEnv = {
  readonly nodeEnv: string;
  readonly appUrl?: string;
  readonly databaseUrl?: string;
  readonly authSecret?: string;
  readonly generatorEnabled?: string;
  readonly generatorProvider?: string;
  readonly openAiApiKey?: string;
  readonly openAiModel?: string;
  readonly openAiBaseUrl?: string;
};

export function readAppEnv(): AppEnv {
  return {
    nodeEnv: process.env[ENV_KEYS.nodeEnv] ?? "development",
    appUrl: process.env[ENV_KEYS.appUrl],
    databaseUrl: process.env[ENV_KEYS.databaseUrl],
    authSecret: process.env[ENV_KEYS.authSecret],
    generatorEnabled: process.env[ENV_KEYS.generatorEnabled],
    generatorProvider: process.env[ENV_KEYS.generatorProvider],
    openAiApiKey: process.env[ENV_KEYS.openAiApiKey],
    openAiModel: process.env[ENV_KEYS.openAiModel],
    openAiBaseUrl: process.env[ENV_KEYS.openAiBaseUrl]
  };
}
