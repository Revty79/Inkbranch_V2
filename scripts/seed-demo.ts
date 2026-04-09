import { and, eq, ne } from "drizzle-orm";

import type { PlanNextSceneOutput } from "../src/core/planner/contracts";
import {
  createDeterministicPlannerMvpService,
  planNextSceneForChronicle
} from "../src/core/planner/services";
import type {
  RuntimeCommitDiagnostics,
  RuntimeScenePlanPayload
} from "../src/core/runtime/contracts";
import { closeDbPool, db } from "../src/data/db/client";
import { createDatabaseRuntimeCommitPipeline } from "../src/data/mutations/runtime";
import { runtimePlanningContextLoader } from "../src/data/queries/runtime";
import {
  arcMilestones,
  bookVersions,
  books,
  canonEntries,
  characters,
  chronicleStates,
  chronicles,
  endingRules,
  factions,
  locations,
  pacingRules,
  perspectives,
  perspectiveRuns,
  revealRules,
  worlds
} from "../src/data/schema";
import {
  DEMO_BOOK,
  DEMO_BOOK_ID,
  DEMO_BOOK_VERSION,
  DEMO_BOOK_VERSION_ID,
  DEMO_CANON_ENTRIES,
  DEMO_CHARACTERS,
  DEMO_CHRONICLE,
  DEMO_CHRONICLE_ID,
  DEMO_CHRONICLE_STATE,
  DEMO_ENDING_RULES,
  DEMO_FACTIONS,
  DEMO_LOCATIONS,
  DEMO_MILESTONES,
  DEMO_PACING_RULES,
  DEMO_PERSPECTIVE_IDS,
  DEMO_PERSPECTIVE_RUN_IDS,
  DEMO_PERSPECTIVE_RUNS,
  DEMO_PERSPECTIVES,
  DEMO_REVEAL_RULES,
  DEMO_SEED_PROFILE,
  DEMO_WORLD
} from "../src/data/seeds";

function formatDiagnostics(diagnostics: RuntimeCommitDiagnostics): string {
  const notes = diagnostics.notes.join(" | ");
  const issueText = diagnostics.issues
    .map((issue) => `${issue.code}: ${issue.message}`)
    .join(" | ");

  return `requestId=${diagnostics.requestId}; notes=${notes}; issues=${issueText}`;
}

function toRuntimeScenePlanPayload(
  plannerOutput: PlanNextSceneOutput
): RuntimeScenePlanPayload {
  if (plannerOutput.status === "failure") {
    const issueText = plannerOutput.diagnostics.issues
      .map((issue) => `${issue.code}: ${issue.message}`)
      .join(" | ");
    throw new Error(
      `Planner failed for demo seed bootstrap. reason=${plannerOutput.reason}; issues=${issueText}`
    );
  }

  const scenePackage =
    plannerOutput.status === "success"
      ? plannerOutput.scenePackage
      : plannerOutput.fallbackScenePackage;

  return {
    plannerStatus: plannerOutput.status === "success" ? "success" : "fallback",
    scenePackage,
    plannerDiagnostics: {
      requestId: plannerOutput.diagnostics.requestId,
      notes: plannerOutput.diagnostics.notes ?? []
    }
  };
}

async function upsertAuthoringDemoPackage(): Promise<void> {
  const now = new Date();

  await db
    .insert(worlds)
    .values(DEMO_WORLD)
    .onConflictDoUpdate({
      target: worlds.id,
      set: {
        ...DEMO_WORLD,
        updatedAt: now
      }
    });

  await db
    .insert(books)
    .values(DEMO_BOOK)
    .onConflictDoUpdate({
      target: books.id,
      set: {
        ...DEMO_BOOK,
        updatedAt: now
      }
    });

  await db
    .update(bookVersions)
    .set({
      isActive: false,
      updatedAt: now
    })
    .where(
      and(
        eq(bookVersions.bookId, DEMO_BOOK_ID),
        ne(bookVersions.id, DEMO_BOOK_VERSION_ID)
      )
    );

  await db
    .insert(bookVersions)
    .values(DEMO_BOOK_VERSION)
    .onConflictDoUpdate({
      target: bookVersions.id,
      set: {
        ...DEMO_BOOK_VERSION,
        updatedAt: now
      }
    });

  for (const character of DEMO_CHARACTERS) {
    await db
      .insert(characters)
      .values(character)
      .onConflictDoUpdate({
        target: characters.id,
        set: {
          ...character,
          updatedAt: now
        }
      });
  }

  for (const location of DEMO_LOCATIONS) {
    await db
      .insert(locations)
      .values(location)
      .onConflictDoUpdate({
        target: locations.id,
        set: {
          ...location,
          updatedAt: now
        }
      });
  }

  for (const faction of DEMO_FACTIONS) {
    await db
      .insert(factions)
      .values(faction)
      .onConflictDoUpdate({
        target: factions.id,
        set: {
          ...faction,
          updatedAt: now
        }
      });
  }

  for (const perspective of DEMO_PERSPECTIVES) {
    await db
      .insert(perspectives)
      .values(perspective)
      .onConflictDoUpdate({
        target: perspectives.id,
        set: {
          ...perspective,
          updatedAt: now
        }
      });
  }

  for (const canonEntry of DEMO_CANON_ENTRIES) {
    await db
      .insert(canonEntries)
      .values(canonEntry)
      .onConflictDoUpdate({
        target: canonEntries.id,
        set: {
          ...canonEntry,
          updatedAt: now
        }
      });
  }

  for (const milestone of DEMO_MILESTONES) {
    await db
      .insert(arcMilestones)
      .values(milestone)
      .onConflictDoUpdate({
        target: arcMilestones.id,
        set: {
          ...milestone,
          updatedAt: now
        }
      });
  }

  for (const revealRule of DEMO_REVEAL_RULES) {
    await db
      .insert(revealRules)
      .values(revealRule)
      .onConflictDoUpdate({
        target: revealRules.id,
        set: {
          ...revealRule,
          updatedAt: now
        }
      });
  }

  for (const pacingRule of DEMO_PACING_RULES) {
    await db
      .insert(pacingRules)
      .values(pacingRule)
      .onConflictDoUpdate({
        target: pacingRules.id,
        set: {
          ...pacingRule,
          updatedAt: now
        }
      });
  }

  for (const endingRule of DEMO_ENDING_RULES) {
    await db
      .insert(endingRules)
      .values(endingRule)
      .onConflictDoUpdate({
        target: endingRules.id,
        set: {
          ...endingRule,
          updatedAt: now
        }
      });
  }
}

async function resetDemoChronicleBaseState(): Promise<void> {
  await db.delete(chronicles).where(eq(chronicles.id, DEMO_CHRONICLE_ID));

  await db.insert(chronicles).values(DEMO_CHRONICLE);

  for (const perspectiveRun of DEMO_PERSPECTIVE_RUNS) {
    await db.insert(perspectiveRuns).values(perspectiveRun);
  }

  await db.insert(chronicleStates).values(DEMO_CHRONICLE_STATE);
}

function pickBootstrapChoice(
  choices: { choiceKey: string; isEnabled: boolean }[]
): {
  choiceKey: string;
} {
  const selected =
    choices.find(
      (choice) =>
        choice.isEnabled && choice.choiceKey === "choice:advance-milestone"
    ) ??
    choices.find(
      (choice) =>
        choice.isEnabled && choice.choiceKey === "choice:surface-reveal"
    ) ??
    choices.find((choice) => choice.isEnabled);

  if (!selected) {
    throw new Error(
      "Demo bootstrap could not find an enabled structural choice to resolve."
    );
  }

  return selected;
}

async function bootstrapDemoChronicle(): Promise<{
  readonly resolvedChoiceKey: string;
  readonly firstSceneInstanceId: string;
  readonly secondSceneInstanceId: string;
}> {
  const planner = createDeterministicPlannerMvpService();
  const runtimePipeline = createDatabaseRuntimeCommitPipeline();

  const planningContext =
    await runtimePlanningContextLoader.loadPlanningContext({
      chronicleId: DEMO_CHRONICLE_ID,
      requestId: "seed-demo:context:1",
      preferredPerspectiveId: DEMO_PERSPECTIVE_IDS.mira
    });

  if (!planningContext) {
    throw new Error(
      "Planning context loader returned null for demo chronicle."
    );
  }

  const firstPlan = await planNextSceneForChronicle(
    planner,
    runtimePlanningContextLoader,
    {
      chronicleId: DEMO_CHRONICLE_ID,
      requestId: "seed-demo:plan:1",
      preferredPerspectiveId: DEMO_PERSPECTIVE_IDS.mira
    }
  );

  const firstInstantiation = await runtimePipeline.instantiateScene({
    requestId: "seed-demo:instantiate:1",
    chronicleId: DEMO_CHRONICLE_ID,
    perspectiveRunId: DEMO_PERSPECTIVE_RUN_IDS.mira,
    plannerResult: toRuntimeScenePlanPayload(firstPlan)
  });

  if (firstInstantiation.status === "failure") {
    throw new Error(
      `Failed to instantiate first demo scene: ${formatDiagnostics(firstInstantiation.diagnostics)}`
    );
  }

  const selectedChoice = pickBootstrapChoice(
    firstInstantiation.data.sceneChoices
  );
  const resolvedChoice = firstInstantiation.data.sceneChoices.find(
    (choice) => choice.choiceKey === selectedChoice.choiceKey
  );

  if (!resolvedChoice) {
    throw new Error(
      `Selected bootstrap choice ${selectedChoice.choiceKey} was not found.`
    );
  }

  const firstResolution = await runtimePipeline.resolveChoice({
    requestId: "seed-demo:resolve:1",
    chronicleId: DEMO_CHRONICLE_ID,
    sceneInstanceId: firstInstantiation.data.sceneInstance.id,
    sceneChoiceId: resolvedChoice.id
  });

  if (firstResolution.status === "failure") {
    throw new Error(
      `Failed to resolve first demo scene: ${formatDiagnostics(firstResolution.diagnostics)}`
    );
  }

  const secondPlan = await planNextSceneForChronicle(
    planner,
    runtimePlanningContextLoader,
    {
      chronicleId: DEMO_CHRONICLE_ID,
      requestId: "seed-demo:plan:2",
      preferredPerspectiveId: DEMO_PERSPECTIVE_IDS.mira
    }
  );

  const secondInstantiation = await runtimePipeline.instantiateScene({
    requestId: "seed-demo:instantiate:2",
    chronicleId: DEMO_CHRONICLE_ID,
    perspectiveRunId: DEMO_PERSPECTIVE_RUN_IDS.mira,
    plannerResult: toRuntimeScenePlanPayload(secondPlan)
  });

  if (secondInstantiation.status === "failure") {
    throw new Error(
      `Failed to instantiate second demo scene: ${formatDiagnostics(secondInstantiation.diagnostics)}`
    );
  }

  return {
    resolvedChoiceKey: resolvedChoice.choiceKey,
    firstSceneInstanceId: firstInstantiation.data.sceneInstance.id,
    secondSceneInstanceId: secondInstantiation.data.sceneInstance.id
  };
}

async function main(): Promise<void> {
  await upsertAuthoringDemoPackage();
  await resetDemoChronicleBaseState();
  const bootstrapped = await bootstrapDemoChronicle();

  console.log("Demo seed complete.");
  console.log(
    `World: ${DEMO_WORLD.slug} | Book: ${DEMO_BOOK.slug} | Version: ${DEMO_BOOK_VERSION.versionLabel}`
  );
  console.log(
    `Chronicle: ${DEMO_CHRONICLE_ID} | Resolved choice: ${bootstrapped.resolvedChoiceKey}`
  );
  console.log(
    `Scene instances: first=${bootstrapped.firstSceneInstanceId} second=${bootstrapped.secondSceneInstanceId}`
  );
  console.log(`Seed profile: ${JSON.stringify(DEMO_SEED_PROFILE)}`);
  console.log(
    `Reader URL: /reader/chronicles/${DEMO_CHRONICLE_ID}/scene | Admin URL: /admin/chronicles/${DEMO_CHRONICLE_ID}`
  );
}

main()
  .catch((error: unknown) => {
    const message =
      error instanceof Error ? error.message : "Unknown demo seed failure.";
    console.error(`Demo seed failed: ${message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeDbPool();
  });
