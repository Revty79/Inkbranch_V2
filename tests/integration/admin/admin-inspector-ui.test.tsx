import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  ChronicleSummary,
  EventLogList,
  GenerationFallbackPanel,
  SceneChoiceList,
  SceneInstanceDetail
} from "@/ui/admin";

describe("Admin inspector UI", () => {
  it("renders chronicle summary with projection context", () => {
    const html = renderToStaticMarkup(
      <ChronicleSummary
        chronicleId="chronicle-1"
        status="active"
        bookVersionId="book-version-1"
        readerId={null}
        startedAt="2026-04-08T00:00:00.000Z"
        completedAt={null}
        currentSceneInstanceId="scene-1"
        currentPerspectiveId="perspective-1"
        progressIndex={2}
        endingLocked={false}
      />
    );

    expect(html).toContain("chronicle-1");
    expect(html).toContain("scene-1");
    expect(html).toContain("perspective-1");
  });

  it("renders scene detail and choice resolution state", () => {
    const html = renderToStaticMarkup(
      <div>
        <SceneInstanceDetail
          sceneInstanceId="scene-9"
          chronicleId="chronicle-1"
          perspectiveRunId="run-1"
          plannerCycle={4}
          sceneKind="development"
          sceneGoal="advance-arc"
          status="resolved"
          renderedProse="Committed prose."
          plannerPayload={{ planner: "payload" }}
          generatorPayload={{ mode: "generated" }}
        />
        <SceneChoiceList
          choices={[
            {
              choiceId: "choice-1",
              choiceKey: "choice:advance",
              label: "Advance",
              intent: "advance-milestone",
              sortOrder: 10,
              isEnabled: true,
              resolutionType: "selected",
              resolvedAt: "2026-04-08T00:00:00.000Z"
            }
          ]}
        />
      </div>
    );

    expect(html).toContain("scene-9");
    expect(html).toContain("choice:advance");
    expect(html).toContain("selected");
  });

  it("renders event log entries in readable form", () => {
    const html = renderToStaticMarkup(
      <EventLogList
        entries={[
          {
            eventId: "event-1",
            eventType: "scene_instantiated",
            eventTs: "2026-04-08T00:00:00.000Z",
            causedByType: "planner",
            causedById: "plan-1",
            payload: { sceneInstanceId: "scene-1" }
          }
        ]}
      />
    );

    expect(html).toContain("scene_instantiated");
    expect(html).toContain("event-1");
    expect(html).toContain("plan-1");
  });

  it("renders generation fallback markers and empty fallback state", () => {
    const populated = renderToStaticMarkup(
      <GenerationFallbackPanel
        fallbacks={[
          {
            sceneInstanceId: "scene-2",
            generatorMode: "fallback",
            fallbackReason: "validation-failed"
          }
        ]}
      />
    );
    const empty = renderToStaticMarkup(
      <GenerationFallbackPanel fallbacks={[]} />
    );

    expect(populated).toContain("scene-2");
    expect(populated).toContain("validation-failed");
    expect(empty).toContain("No recorded generation fallbacks");
  });
});
