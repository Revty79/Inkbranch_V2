import Link from "next/link";

import { ReaderStatusBadge } from "@/ui/reader/shared/ReaderStatusBadge";

interface ChronicleCardProps {
  readonly chronicleId: string;
  readonly title: string;
  readonly subtitle?: string | null;
  readonly status: string;
  readonly startedAt: string;
  readonly completedAt?: string | null;
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString();
}

export function ChronicleCard({
  chronicleId,
  title,
  subtitle,
  status,
  startedAt,
  completedAt
}: ChronicleCardProps) {
  return (
    <article className="reader-chronicle-card">
      <div className="reader-chronicle-card-top">
        <h3>{title}</h3>
        <ReaderStatusBadge label={status} tone={status} />
      </div>
      {subtitle ? <p>{subtitle}</p> : null}
      <p>
        Began: <strong>{formatDate(startedAt)}</strong>
      </p>
      {completedAt ? (
        <p>
          Finished: <strong>{formatDate(completedAt)}</strong>
        </p>
      ) : null}
      <div className="reader-inline-links">
        <Link href={`/reader/chronicles/${chronicleId}`}>Story so far</Link>
        <Link href={`/reader/chronicles/${chronicleId}/scene`}>
          Continue reading
        </Link>
      </div>
    </article>
  );
}
