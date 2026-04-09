import Link from "next/link";

import { InspectorMetaTable } from "../shared/InspectorMetaTable";
import { InspectorStatusBadge } from "../shared/InspectorStatusBadge";

interface SceneInstanceCardProps {
  readonly chronicleId: string;
  readonly sceneInstanceId: string;
  readonly plannerCycle: number;
  readonly sceneKind: string;
  readonly sceneGoal: string;
  readonly status: string;
  readonly perspectiveRunId: string;
  readonly hasRenderedProse: boolean;
  readonly hasGeneratorPayload: boolean;
}

export function SceneInstanceCard({
  chronicleId,
  sceneInstanceId,
  plannerCycle,
  sceneKind,
  sceneGoal,
  status,
  perspectiveRunId,
  hasRenderedProse,
  hasGeneratorPayload
}: SceneInstanceCardProps) {
  return (
    <article className="admin-panel">
      <div className="admin-panel-top">
        <h3>{sceneInstanceId}</h3>
        <InspectorStatusBadge label={status} tone={status} />
      </div>
      <InspectorMetaTable
        rows={[
          { label: "Planner cycle", value: plannerCycle },
          { label: "Scene kind", value: sceneKind },
          { label: "Scene goal", value: sceneGoal },
          { label: "Perspective run", value: perspectiveRunId },
          { label: "Rendered prose", value: hasRenderedProse ? "yes" : "no" },
          {
            label: "Generator payload",
            value: hasGeneratorPayload ? "present" : "empty"
          }
        ]}
      />
      <div className="admin-inline-links">
        <Link
          href={`/admin/chronicles/${chronicleId}/scenes/${sceneInstanceId}`}
        >
          Inspect scene
        </Link>
      </div>
    </article>
  );
}
