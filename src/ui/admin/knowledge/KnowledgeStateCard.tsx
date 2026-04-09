import { InspectorMetaTable } from "../shared/InspectorMetaTable";
import { InspectorStatusBadge } from "../shared/InspectorStatusBadge";

interface KnowledgeStateCardProps {
  readonly knowledgeId: string;
  readonly knowledgeKey: string;
  readonly knowledgeStatus: string;
  readonly perspectiveId: string | null;
  readonly sourceSceneInstanceId: string | null;
  readonly metadata: Record<string, unknown>;
}

export function KnowledgeStateCard({
  knowledgeId,
  knowledgeKey,
  knowledgeStatus,
  perspectiveId,
  sourceSceneInstanceId,
  metadata
}: KnowledgeStateCardProps) {
  return (
    <article className="admin-panel">
      <div className="admin-panel-top">
        <h3>{knowledgeKey}</h3>
        <InspectorStatusBadge label={knowledgeStatus} tone="active" />
      </div>
      <InspectorMetaTable
        rows={[
          { label: "Knowledge id", value: knowledgeId },
          { label: "Perspective scope", value: perspectiveId ?? "global" },
          {
            label: "Source scene",
            value: sourceSceneInstanceId ?? "not linked"
          }
        ]}
      />
      <details className="admin-json-detail">
        <summary>Metadata detail</summary>
        <pre>{JSON.stringify(metadata, null, 2)}</pre>
      </details>
    </article>
  );
}
