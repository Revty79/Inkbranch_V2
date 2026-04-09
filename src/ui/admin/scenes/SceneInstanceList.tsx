import { InspectorEmptyState } from "../shared/InspectorEmptyState";

import { SceneInstanceCard } from "./SceneInstanceCard";

export interface SceneInstanceListItem {
  readonly sceneInstanceId: string;
  readonly plannerCycle: number;
  readonly sceneKind: string;
  readonly sceneGoal: string;
  readonly status: string;
  readonly perspectiveRunId: string;
  readonly hasRenderedProse: boolean;
  readonly hasGeneratorPayload: boolean;
}

interface SceneInstanceListProps {
  readonly chronicleId: string;
  readonly scenes: SceneInstanceListItem[];
}

export function SceneInstanceList({
  chronicleId,
  scenes
}: SceneInstanceListProps) {
  if (scenes.length === 0) {
    return (
      <InspectorEmptyState
        title="No scene instances"
        message="The planner has not instantiated any scenes for this chronicle."
      />
    );
  }

  return (
    <section className="admin-grid">
      {scenes.map((scene) => (
        <SceneInstanceCard
          key={scene.sceneInstanceId}
          chronicleId={chronicleId}
          sceneInstanceId={scene.sceneInstanceId}
          plannerCycle={scene.plannerCycle}
          sceneKind={scene.sceneKind}
          sceneGoal={scene.sceneGoal}
          status={scene.status}
          perspectiveRunId={scene.perspectiveRunId}
          hasRenderedProse={scene.hasRenderedProse}
          hasGeneratorPayload={scene.hasGeneratorPayload}
        />
      ))}
    </section>
  );
}
