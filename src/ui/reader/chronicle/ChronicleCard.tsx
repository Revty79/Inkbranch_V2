import Link from "next/link";

import { ReaderStatusBadge } from "@/ui/reader/shared/ReaderStatusBadge";

interface ChronicleCardProps {
  readonly chronicleId: string;
  readonly status: string;
  readonly startedAt: string;
  readonly completedAt?: string | null;
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString();
}

export function ChronicleCard({
  chronicleId,
  status,
  startedAt,
  completedAt
}: ChronicleCardProps) {
  return (
    <article className="reader-chronicle-card">
      <div className="reader-chronicle-card-top">
        <h3>{chronicleId}</h3>
        <ReaderStatusBadge label={status} tone={status} />
      </div>
      <p>
        Started: <strong>{formatDate(startedAt)}</strong>
      </p>
      {completedAt ? (
        <p>
          Completed: <strong>{formatDate(completedAt)}</strong>
        </p>
      ) : null}
      <div className="reader-inline-links">
        <Link href={`/reader/chronicles/${chronicleId}`}>Open summary</Link>
        <Link href={`/reader/chronicles/${chronicleId}/scene`}>Open scene</Link>
      </div>
    </article>
  );
}
