import { InspectorEmptyState } from "../shared/InspectorEmptyState";

import { KnowledgeStateCard } from "./KnowledgeStateCard";

export interface KnowledgeStateListItem {
  readonly knowledgeId: string;
  readonly knowledgeKey: string;
  readonly knowledgeStatus: string;
  readonly perspectiveId: string | null;
  readonly sourceSceneInstanceId: string | null;
  readonly metadata: Record<string, unknown>;
}

interface KnowledgeStateListProps {
  readonly entries: KnowledgeStateListItem[];
}

export function KnowledgeStateList({ entries }: KnowledgeStateListProps) {
  if (entries.length === 0) {
    return (
      <InspectorEmptyState
        title="No knowledge entries"
        message="No knowledge state entries have been committed for this chronicle."
      />
    );
  }

  return (
    <section className="admin-grid">
      {entries.map((entry) => (
        <KnowledgeStateCard
          key={entry.knowledgeId}
          knowledgeId={entry.knowledgeId}
          knowledgeKey={entry.knowledgeKey}
          knowledgeStatus={entry.knowledgeStatus}
          perspectiveId={entry.perspectiveId}
          sourceSceneInstanceId={entry.sourceSceneInstanceId}
          metadata={entry.metadata}
        />
      ))}
    </section>
  );
}
