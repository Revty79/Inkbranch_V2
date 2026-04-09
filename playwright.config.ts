import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;
const baseURL = `http://127.0.0.1:${PORT}`;
const databaseUrl =
  process.env.DATABASE_URL ??
  "postgresql://inkbranch_app:Darkness1%40@localhost:5432/inkbranch_dev";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  retries: 0,
  reporter: "list",
  use: {
    baseURL,
    trace: "on-first-retry"
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"]
      }
    }
  ],
  webServer: {
    command: `npm run dev -- --hostname 127.0.0.1 --port ${PORT}`,
    url: baseURL,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
    env: {
      ...process.env,
      DATABASE_URL: databaseUrl,
      GENERATOR_PROVIDER: process.env.GENERATOR_PROVIDER ?? "mock",
      GENERATOR_ENABLED: process.env.GENERATOR_ENABLED ?? "true"
    }
  }
});
