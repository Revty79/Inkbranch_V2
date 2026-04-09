import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ChronicleSummary, ReaderEmptyState, SceneFrame } from "@/ui/reader";

describe("Reader shell UI", () => {
  it("renders reader empty state content", () => {
    const html = renderToStaticMarkup(
      <ReaderEmptyState title="No chronicle" message="Create a run first." />
    );

    expect(html).toContain("No chronicle");
    expect(html).toContain("Create a run first.");
  });

  it("renders chronicle summary with scene and perspective context", () => {
    const html = renderToStaticMarkup(
      <ChronicleSummary
        chronicleId="chronicle-1"
        status="active"
        startedAt="2026-04-08T00:00:00.000Z"
        currentPerspectiveId="perspective-1"
        currentSceneInstanceId="scene-9"
      />
    );

    expect(html).toContain("chronicle-1");
    expect(html).toContain("scene-9");
    expect(html).toContain("perspective-1");
  });

  it("renders scene placeholder when prose is not yet generated", () => {
    const html = renderToStaticMarkup(
      <SceneFrame
        sceneId="scene-1"
        sceneKind="development"
        sceneGoal="advance-arc"
        plannerCycle={3}
        sceneStatus="planned"
        perspectiveId="perspective-1"
        perspectiveName="Lead POV"
        body={{
          mode: "fallback",
          title: "Scene structure available",
          paragraphs: ["Fallback body for missing prose."]
        }}
        progressIndex={2}
        endingLocked={false}
        choices={[
          {
            choiceId: "choice-1",
            label: "Advance",
            intentLabel: "Advance Milestone",
            availability: "enabled"
          }
        ]}
      />
    );

    expect(html).toContain("Scene structure available");
    expect(html).toContain("Advance");
  });
});
