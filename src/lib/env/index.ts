export const ENV_KEYS = {
  nodeEnv: "NODE_ENV",
  appUrl: "NEXT_PUBLIC_APP_URL",
  databaseUrl: "DATABASE_URL",
  authSecret: "AUTH_SECRET",
  openAiApiKey: "OPENAI_API_KEY"
} as const;

export type AppEnv = {
  readonly nodeEnv: string;
  readonly appUrl?: string;
  readonly databaseUrl?: string;
  readonly authSecret?: string;
  readonly openAiApiKey?: string;
};

export function readAppEnv(): AppEnv {
  return {
    nodeEnv: process.env[ENV_KEYS.nodeEnv] ?? "development",
    appUrl: process.env[ENV_KEYS.appUrl],
    databaseUrl: process.env[ENV_KEYS.databaseUrl],
    authSecret: process.env[ENV_KEYS.authSecret],
    openAiApiKey: process.env[ENV_KEYS.openAiApiKey]
  };
}
