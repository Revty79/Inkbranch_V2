import { InspectorMetaTable } from "../shared/InspectorMetaTable";
import { InspectorStatusBadge } from "../shared/InspectorStatusBadge";

interface CanonCommitCardProps {
  readonly commitId: string;
  readonly commitType: string;
  readonly commitKey: string;
  readonly canonEntryId: string | null;
  readonly sourceEventId: string | null;
  readonly commitValue: Record<string, unknown>;
  readonly createdAt: string;
}

export function CanonCommitCard({
  commitId,
  commitType,
  commitKey,
  canonEntryId,
  sourceEventId,
  commitValue,
  createdAt
}: CanonCommitCardProps) {
  return (
    <article className="admin-panel">
      <div className="admin-panel-top">
        <h3>{commitKey}</h3>
        <InspectorStatusBadge label={commitType} tone="resolved" />
      </div>
      <InspectorMetaTable
        rows={[
          { label: "Commit id", value: commitId },
          { label: "Canon entry", value: canonEntryId ?? "not linked" },
          { label: "Source event", value: sourceEventId ?? "not linked" },
          { label: "Created", value: createdAt }
        ]}
      />
      <details className="admin-json-detail">
        <summary>Commit value detail</summary>
        <pre>{JSON.stringify(commitValue, null, 2)}</pre>
      </details>
    </article>
  );
}
