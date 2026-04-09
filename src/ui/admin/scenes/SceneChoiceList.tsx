import { InspectorEmptyState } from "../shared/InspectorEmptyState";
import { InspectorMetaTable } from "../shared/InspectorMetaTable";
import { InspectorStatusBadge } from "../shared/InspectorStatusBadge";

export interface SceneChoiceListItem {
  readonly choiceId: string;
  readonly choiceKey: string;
  readonly label: string;
  readonly intent: string | null;
  readonly sortOrder: number;
  readonly isEnabled: boolean;
  readonly resolutionType: string | null;
  readonly resolvedAt: string | null;
}

interface SceneChoiceListProps {
  readonly choices: SceneChoiceListItem[];
}

export function SceneChoiceList({ choices }: SceneChoiceListProps) {
  if (choices.length === 0) {
    return (
      <InspectorEmptyState
        title="No choices committed"
        message="No structural choices were stored for this scene instance."
      />
    );
  }

  return (
    <section className="admin-grid">
      {choices.map((choice) => (
        <article key={choice.choiceId} className="admin-panel">
          <div className="admin-panel-top">
            <h3>{choice.label}</h3>
            <InspectorStatusBadge
              label={choice.isEnabled ? "enabled" : "disabled"}
              tone={choice.isEnabled ? "active" : "paused"}
            />
          </div>
          <InspectorMetaTable
            rows={[
              { label: "Choice id", value: choice.choiceId },
              { label: "Choice key", value: choice.choiceKey },
              { label: "Intent", value: choice.intent ?? "not specified" },
              { label: "Sort order", value: choice.sortOrder },
              {
                label: "Resolution type",
                value: choice.resolutionType ?? "not resolved"
              },
              {
                label: "Resolved at",
                value: choice.resolvedAt ?? "not resolved"
              }
            ]}
          />
        </article>
      ))}
    </section>
  );
}
