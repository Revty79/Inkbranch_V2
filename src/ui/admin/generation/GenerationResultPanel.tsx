import { InspectorMetaTable } from "../shared/InspectorMetaTable";

export interface GenerationSceneSummaryItem {
  readonly sceneInstanceId: string;
  readonly plannerCycle: number;
  readonly sceneKind: string;
  readonly sceneGoal: string;
  readonly hasRenderedProse: boolean;
  readonly generatorMode: string;
  readonly generatorReason: string | null;
}

interface GenerationResultPanelProps {
  readonly items: GenerationSceneSummaryItem[];
}

export function GenerationResultPanel({ items }: GenerationResultPanelProps) {
  const renderedCount = items.filter((item) => item.hasRenderedProse).length;
  const fallbackCount = items.filter(
    (item) => item.generatorMode.toLowerCase() === "fallback"
  ).length;

  return (
    <section className="admin-panel">
      <h2>Generation summary</h2>
      <InspectorMetaTable
        rows={[
          { label: "Scene instances inspected", value: items.length },
          { label: "Rendered prose present", value: renderedCount },
          { label: "Fallback-marked scenes", value: fallbackCount }
        ]}
      />
      <ul className="admin-generation-list">
        {items.map((item) => (
          <li key={item.sceneInstanceId}>
            <strong>{item.sceneInstanceId}</strong> · cycle {item.plannerCycle}{" "}
            · {item.sceneKind}/{item.sceneGoal} · prose{" "}
            {item.hasRenderedProse ? "present" : "missing"} · mode{" "}
            {item.generatorMode}
            {item.generatorReason ? ` (${item.generatorReason})` : ""}
          </li>
        ))}
      </ul>
    </section>
  );
}
