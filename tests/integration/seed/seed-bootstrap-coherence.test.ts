import { describe, expect, it } from "vitest";

import {
  DEMO_BOOK_VERSION,
  DEMO_CHRONICLE,
  DEMO_CHRONICLE_ID,
  DEMO_CHRONICLE_STATE,
  DEMO_PERSPECTIVE_IDS,
  DEMO_PERSPECTIVE_RUN_IDS,
  DEMO_PERSPECTIVE_RUNS,
  DEMO_PERSPECTIVES
} from "@/data/seeds";

describe("seed bootstrap coherence", () => {
  it("keeps runtime demo chronicle pinned to the active demo version", () => {
    expect(DEMO_CHRONICLE.bookVersionId).toBe(DEMO_BOOK_VERSION.id);
    expect(DEMO_CHRONICLE.id).toBe(DEMO_CHRONICLE_ID);
  });

  it("ensures seeded runtime perspective runs map to authored demo perspectives", () => {
    const seededPerspectiveIds = new Set(DEMO_PERSPECTIVES.map((p) => p.id));
    const runPerspectiveIds = DEMO_PERSPECTIVE_RUNS.map(
      (run) => run.perspectiveId
    );

    for (const perspectiveId of runPerspectiveIds) {
      expect(seededPerspectiveIds.has(perspectiveId)).toBe(true);
    }

    expect(DEMO_PERSPECTIVE_RUN_IDS.mira).toBe(
      DEMO_PERSPECTIVE_RUNS.find(
        (run) => run.perspectiveId === DEMO_PERSPECTIVE_IDS.mira
      )?.id
    );
  });

  it("starts the seeded chronicle state in a planner-runnable baseline", () => {
    expect(DEMO_CHRONICLE_STATE.chronicleId).toBe(DEMO_CHRONICLE_ID);
    expect(DEMO_CHRONICLE_STATE.currentPerspectiveId).toBe(
      DEMO_PERSPECTIVE_IDS.mira
    );
    expect(DEMO_CHRONICLE_STATE.currentSceneInstanceId).toBeNull();
    expect(DEMO_CHRONICLE_STATE.progressIndex).toBe(0);
    expect(DEMO_CHRONICLE_STATE.endingLocked).toBe(false);
  });
});
