import Link from "next/link";

import { InspectorStatusBadge } from "../shared/InspectorStatusBadge";

interface ChronicleCardProps {
  readonly chronicleId: string;
  readonly status: string;
  readonly bookVersionId: string;
  readonly readerId: string | null;
  readonly startedAt: string;
  readonly completedAt: string | null;
  readonly currentSceneInstanceId: string | null;
}

export function ChronicleCard({
  chronicleId,
  status,
  bookVersionId,
  readerId,
  startedAt,
  completedAt,
  currentSceneInstanceId
}: ChronicleCardProps) {
  return (
    <article className="admin-chronicle-card">
      <div className="admin-chronicle-card-top">
        <h3>{chronicleId}</h3>
        <InspectorStatusBadge label={status} tone={status} />
      </div>
      <p>Book version: {bookVersionId}</p>
      <p>Reader: {readerId ?? "unassigned"}</p>
      <p>Started: {startedAt}</p>
      <p>Completed: {completedAt ?? "not completed"}</p>
      <p>Current scene: {currentSceneInstanceId ?? "not set"}</p>
      <div className="admin-inline-links">
        <Link href={`/admin/chronicles/${chronicleId}`}>Inspect chronicle</Link>
      </div>
    </article>
  );
}
