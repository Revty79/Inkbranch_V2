import { InspectorMetaTable } from "../shared/InspectorMetaTable";

interface ChronicleStatePanelProps {
  readonly chronicleId: string;
  readonly currentSceneInstanceId: string | null;
  readonly currentPerspectiveId: string | null;
  readonly progressIndex: number;
  readonly endingLocked: boolean;
  readonly summaryJson: Record<string, unknown>;
  readonly updatedAt: string;
}

function summarizeJson(value: Record<string, unknown>): string {
  const keys = Object.keys(value);
  if (keys.length === 0) {
    return "empty";
  }

  return keys.join(", ");
}

export function ChronicleStatePanel({
  chronicleId,
  currentSceneInstanceId,
  currentPerspectiveId,
  progressIndex,
  endingLocked,
  summaryJson,
  updatedAt
}: ChronicleStatePanelProps) {
  return (
    <section className="admin-panel">
      <h2>Chronicle state projection</h2>
      <InspectorMetaTable
        rows={[
          { label: "Chronicle", value: chronicleId },
          {
            label: "Current scene instance",
            value: currentSceneInstanceId ?? "not set"
          },
          {
            label: "Current perspective",
            value: currentPerspectiveId ?? "not set"
          },
          { label: "Progress index", value: progressIndex },
          { label: "Ending locked", value: endingLocked ? "yes" : "no" },
          {
            label: "Projection summary keys",
            value: summarizeJson(summaryJson)
          },
          { label: "Updated", value: updatedAt }
        ]}
      />
      <details className="admin-json-detail">
        <summary>Projection summary JSON</summary>
        <pre>{JSON.stringify(summaryJson, null, 2)}</pre>
      </details>
    </section>
  );
}
