import { describe, expect, it } from "vitest";

import type { SceneChoiceRecord, SceneInstanceRecord } from "@/data/mappers";
import { mapRuntimeSceneForReader } from "@/data/mappers";

function createScene(renderedProse: string): SceneInstanceRecord {
  return {
    id: "scene-1",
    chronicleId: "chronicle-1",
    perspectiveRunId: "run-1",
    plannerCycle: 4,
    sceneKind: "development",
    sceneGoal: "advance-arc",
    plannerPayload: {},
    generatorPayload: {},
    renderedProse,
    status: "planned",
    createdAt: "2026-04-09T00:00:00.000Z",
    updatedAt: "2026-04-09T00:00:00.000Z"
  };
}

function createChoices(): SceneChoiceRecord[] {
  return [
    {
      id: "choice-1",
      sceneInstanceId: "scene-1",
      choiceKey: "choice:advance",
      label: "Advance",
      intent: "advance-milestone",
      sortOrder: 10,
      plannerEffects: {},
      isEnabled: true,
      createdAt: "2026-04-09T00:00:00.000Z",
      updatedAt: "2026-04-09T00:00:00.000Z"
    },
    {
      id: "choice-2",
      sceneInstanceId: "scene-1",
      choiceKey: "choice:wait",
      label: "Wait",
      intent: "protect-continuity",
      sortOrder: 20,
      plannerEffects: {},
      isEnabled: false,
      createdAt: "2026-04-09T00:00:00.000Z",
      updatedAt: "2026-04-09T00:00:00.000Z"
    }
  ];
}

describe("scene package rendering mapper", () => {
  it("renders committed prose when rendered prose exists", () => {
    const presentation = mapRuntimeSceneForReader({
      scene: createScene("Committed prose body."),
      choices: createChoices(),
      perspectiveId: "perspective-1",
      perspectiveName: "Lead POV",
      progressIndex: 3,
      endingLocked: false
    });

    expect(presentation.body.mode).toBe("prose");

    if (presentation.body.mode !== "prose") {
      throw new Error("Expected prose mode.");
    }

    expect(presentation.body.prose).toContain("Committed prose body.");
  });

  it("renders structural fallback body when prose is absent", () => {
    const presentation = mapRuntimeSceneForReader({
      scene: createScene("   "),
      choices: createChoices(),
      perspectiveId: "perspective-1",
      perspectiveName: "Lead POV",
      progressIndex: 3,
      endingLocked: false
    });

    expect(presentation.body.mode).toBe("fallback");

    if (presentation.body.mode !== "fallback") {
      throw new Error("Expected fallback mode.");
    }

    expect(presentation.body.title).toBe("Scene structure available");
    expect(presentation.body.paragraphs.join(" ")).toContain("development");
  });

  it("maps enabled and disabled choices into reader availability states", () => {
    const presentation = mapRuntimeSceneForReader({
      scene: createScene("Committed prose body."),
      choices: createChoices(),
      perspectiveId: "perspective-1",
      perspectiveName: "Lead POV",
      progressIndex: 3,
      endingLocked: false
    });

    expect(presentation.meta.enabledChoiceCount).toBe(1);
    expect(presentation.meta.disabledChoiceCount).toBe(1);
    expect(
      presentation.choices.find((choice) => choice.choiceId === "choice-1")
        ?.availability
    ).toBe("enabled");
    expect(
      presentation.choices.find((choice) => choice.choiceId === "choice-2")
        ?.availability
    ).toBe("disabled");
  });
});
