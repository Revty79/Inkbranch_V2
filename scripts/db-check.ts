import {
  checkDatabaseHealth,
  closeDatabaseHealthResources
} from "../src/data/db";

async function main(): Promise<void> {
  const result = await checkDatabaseHealth();

  if (result.ok) {
    console.log("DB health check passed.");
    return;
  }

  console.error(`DB health check failed: ${result.message}`);
  process.exitCode = 1;
}

main()
  .catch((error: unknown) => {
    const message =
      error instanceof Error ? error.message : "Unexpected DB check failure.";
    console.error(`DB health check failed: ${message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await closeDatabaseHealthResources();
    } catch {
      // Ignore shutdown errors so command exits with the primary result.
    }
  });
