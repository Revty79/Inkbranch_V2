import { InspectorEmptyState } from "../shared/InspectorEmptyState";

import { CanonCommitCard } from "./CanonCommitCard";

export interface CanonCommitListItem {
  readonly commitId: string;
  readonly commitType: string;
  readonly commitKey: string;
  readonly canonEntryId: string | null;
  readonly sourceEventId: string | null;
  readonly commitValue: Record<string, unknown>;
  readonly createdAt: string;
}

interface CanonCommitListProps {
  readonly commits: CanonCommitListItem[];
}

export function CanonCommitList({ commits }: CanonCommitListProps) {
  if (commits.length === 0) {
    return (
      <InspectorEmptyState
        title="No canon commits"
        message="No canon commits have been written for this chronicle."
      />
    );
  }

  return (
    <section className="admin-grid">
      {commits.map((commit) => (
        <CanonCommitCard
          key={commit.commitId}
          commitId={commit.commitId}
          commitType={commit.commitType}
          commitKey={commit.commitKey}
          canonEntryId={commit.canonEntryId}
          sourceEventId={commit.sourceEventId}
          commitValue={commit.commitValue}
          createdAt={commit.createdAt}
        />
      ))}
    </section>
  );
}
