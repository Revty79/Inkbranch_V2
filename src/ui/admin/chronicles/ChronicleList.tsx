import { InspectorEmptyState } from "../shared/InspectorEmptyState";

import { ChronicleCard } from "./ChronicleCard";

export interface ChronicleListItem {
  readonly chronicleId: string;
  readonly status: string;
  readonly bookVersionId: string;
  readonly readerId: string | null;
  readonly startedAt: string;
  readonly completedAt: string | null;
  readonly currentSceneInstanceId: string | null;
}

interface ChronicleListProps {
  readonly chronicles: ChronicleListItem[];
}

export function ChronicleList({ chronicles }: ChronicleListProps) {
  if (chronicles.length === 0) {
    return (
      <InspectorEmptyState
        title="No chronicles available"
        message="Runtime chronicle records have not been committed yet."
      />
    );
  }

  return (
    <section className="admin-chronicle-list">
      {chronicles.map((chronicle) => (
        <ChronicleCard
          key={chronicle.chronicleId}
          chronicleId={chronicle.chronicleId}
          status={chronicle.status}
          bookVersionId={chronicle.bookVersionId}
          readerId={chronicle.readerId}
          startedAt={chronicle.startedAt}
          completedAt={chronicle.completedAt}
          currentSceneInstanceId={chronicle.currentSceneInstanceId}
        />
      ))}
    </section>
  );
}
