import { InspectorEmptyState } from "../shared/InspectorEmptyState";
import { InspectorMetaTable } from "../shared/InspectorMetaTable";
import { InspectorStatusBadge } from "../shared/InspectorStatusBadge";

export interface ChoiceResolutionListItem {
  readonly resolutionId: string;
  readonly sceneChoiceId: string;
  readonly resolutionType: string;
  readonly resolvedAt: string;
  readonly resolutionPayload: Record<string, unknown>;
}

interface ChoiceResolutionPanelProps {
  readonly resolutions: ChoiceResolutionListItem[];
}

export function ChoiceResolutionPanel({
  resolutions
}: ChoiceResolutionPanelProps) {
  if (resolutions.length === 0) {
    return (
      <InspectorEmptyState
        title="No choice resolutions"
        message="No reader choice resolutions have been committed for this scope."
      />
    );
  }

  return (
    <section className="admin-grid">
      {resolutions.map((resolution) => (
        <article key={resolution.resolutionId} className="admin-panel">
          <div className="admin-panel-top">
            <h3>{resolution.resolutionId}</h3>
            <InspectorStatusBadge
              label={resolution.resolutionType}
              tone={
                resolution.resolutionType === "selected"
                  ? "resolved"
                  : "planned"
              }
            />
          </div>
          <InspectorMetaTable
            rows={[
              { label: "Scene choice id", value: resolution.sceneChoiceId },
              { label: "Resolution type", value: resolution.resolutionType },
              { label: "Resolved at", value: resolution.resolvedAt }
            ]}
          />
          <details className="admin-json-detail">
            <summary>Resolution payload</summary>
            <pre>{JSON.stringify(resolution.resolutionPayload, null, 2)}</pre>
          </details>
        </article>
      ))}
    </section>
  );
}
