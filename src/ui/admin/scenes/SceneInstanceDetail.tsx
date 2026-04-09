import { InspectorMetaTable } from "../shared/InspectorMetaTable";
import { InspectorStatusBadge } from "../shared/InspectorStatusBadge";

interface SceneInstanceDetailProps {
  readonly sceneInstanceId: string;
  readonly chronicleId: string;
  readonly perspectiveRunId: string;
  readonly plannerCycle: number;
  readonly sceneKind: string;
  readonly sceneGoal: string;
  readonly status: string;
  readonly renderedProse: string | null;
  readonly plannerPayload: Record<string, unknown>;
  readonly generatorPayload: Record<string, unknown>;
}

export function SceneInstanceDetail({
  sceneInstanceId,
  chronicleId,
  perspectiveRunId,
  plannerCycle,
  sceneKind,
  sceneGoal,
  status,
  renderedProse,
  plannerPayload,
  generatorPayload
}: SceneInstanceDetailProps) {
  return (
    <section className="admin-panel">
      <div className="admin-panel-top">
        <h2>{sceneInstanceId}</h2>
        <InspectorStatusBadge label={status} tone={status} />
      </div>
      <InspectorMetaTable
        rows={[
          { label: "Chronicle", value: chronicleId },
          { label: "Perspective run", value: perspectiveRunId },
          { label: "Planner cycle", value: plannerCycle },
          { label: "Scene kind", value: sceneKind },
          { label: "Scene goal", value: sceneGoal },
          {
            label: "Rendered prose",
            value: renderedProse?.trim() ? "present" : "not present"
          }
        ]}
      />

      {renderedProse?.trim() ? (
        <details className="admin-json-detail" open>
          <summary>Rendered prose preview</summary>
          <pre>{renderedProse}</pre>
        </details>
      ) : null}

      <details className="admin-json-detail">
        <summary>Planner payload detail</summary>
        <pre>{JSON.stringify(plannerPayload, null, 2)}</pre>
      </details>

      <details className="admin-json-detail">
        <summary>Generator payload detail</summary>
        <pre>{JSON.stringify(generatorPayload, null, 2)}</pre>
      </details>
    </section>
  );
}
