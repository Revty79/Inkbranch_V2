import Link from "next/link";

import { InspectorEmptyState } from "../shared/InspectorEmptyState";
import { InspectorMetaTable } from "../shared/InspectorMetaTable";
import { InspectorStatusBadge } from "../shared/InspectorStatusBadge";

export interface PerspectiveRunListItem {
  readonly id: string;
  readonly perspectiveId: string;
  readonly perspectiveName: string | null;
  readonly status: string;
  readonly entryCount: number;
  readonly knowledgeScore: number;
  readonly lastSceneInstanceId: string | null;
  readonly updatedAt: string;
}

interface PerspectiveRunListProps {
  readonly chronicleId: string;
  readonly runs: PerspectiveRunListItem[];
}

export function PerspectiveRunList({
  chronicleId,
  runs
}: PerspectiveRunListProps) {
  if (runs.length === 0) {
    return (
      <InspectorEmptyState
        title="No perspective runs"
        message="No perspective runs have been committed for this chronicle yet."
      />
    );
  }

  return (
    <section className="admin-grid">
      {runs.map((run) => (
        <article key={run.id} className="admin-panel">
          <div className="admin-panel-top">
            <h3>{run.perspectiveName ?? run.perspectiveId}</h3>
            <InspectorStatusBadge label={run.status} tone={run.status} />
          </div>
          <InspectorMetaTable
            rows={[
              { label: "Run id", value: run.id },
              { label: "Perspective id", value: run.perspectiveId },
              { label: "Entry count", value: run.entryCount },
              { label: "Knowledge score", value: run.knowledgeScore },
              {
                label: "Last scene",
                value: run.lastSceneInstanceId ?? "not committed"
              },
              { label: "Updated", value: run.updatedAt }
            ]}
          />
          {run.lastSceneInstanceId ? (
            <div className="admin-inline-links">
              <Link
                href={`/admin/chronicles/${chronicleId}/scenes/${run.lastSceneInstanceId}`}
              >
                Inspect last scene
              </Link>
            </div>
          ) : null}
        </article>
      ))}
    </section>
  );
}
