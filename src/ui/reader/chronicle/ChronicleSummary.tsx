import { PerspectiveBadge } from "@/ui/reader/shared/PerspectiveBadge";
import { ReaderStatusBadge } from "@/ui/reader/shared/ReaderStatusBadge";

interface ChronicleSummaryProps {
  readonly chronicleId: string;
  readonly status: string;
  readonly startedAt: string;
  readonly currentPerspectiveId?: string | null;
  readonly currentSceneInstanceId?: string | null;
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString();
}

export function ChronicleSummary({
  chronicleId,
  status,
  startedAt,
  currentPerspectiveId,
  currentSceneInstanceId
}: ChronicleSummaryProps) {
  return (
    <section className="reader-chronicle-summary">
      <div className="reader-chronicle-summary-top">
        <h2>{chronicleId}</h2>
        <ReaderStatusBadge label={status} tone={status} />
      </div>
      <p>
        Started: <strong>{formatDate(startedAt)}</strong>
      </p>
      <p>
        Current scene: <strong>{currentSceneInstanceId ?? "none"}</strong>
      </p>
      {currentPerspectiveId ? (
        <p>
          <PerspectiveBadge perspectiveId={currentPerspectiveId} />
        </p>
      ) : (
        <p>No active perspective selected yet.</p>
      )}
    </section>
  );
}
