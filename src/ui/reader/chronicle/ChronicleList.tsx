import { ChronicleCard } from "./ChronicleCard";

export interface ChronicleListItem {
  readonly chronicleId: string;
  readonly status: string;
  readonly startedAt: string;
  readonly completedAt?: string | null;
}

interface ChronicleListProps {
  readonly chronicles: ChronicleListItem[];
}

export function ChronicleList({ chronicles }: ChronicleListProps) {
  return (
    <ul className="reader-chronicle-list">
      {chronicles.map((chronicle) => (
        <li key={chronicle.chronicleId}>
          <ChronicleCard
            chronicleId={chronicle.chronicleId}
            status={chronicle.status}
            startedAt={chronicle.startedAt}
            completedAt={chronicle.completedAt}
          />
        </li>
      ))}
    </ul>
  );
}
