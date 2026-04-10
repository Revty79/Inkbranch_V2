import { PerspectiveBadge } from "@/ui/reader/shared/PerspectiveBadge";
import { ReaderStatusBadge } from "@/ui/reader/shared/ReaderStatusBadge";

interface ChronicleSummaryProps {
  readonly title: string;
  readonly subtitle?: string | null;
  readonly status: string;
  readonly startedAt: string;
  readonly latestMomentAt?: string | null;
  readonly currentPerspectiveId?: string | null;
  readonly hasCurrentScene: boolean;
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString();
}

export function ChronicleSummary({
  title,
  subtitle,
  status,
  startedAt,
  latestMomentAt,
  currentPerspectiveId,
  hasCurrentScene
}: ChronicleSummaryProps) {
  return (
    <section className="reader-chronicle-summary">
      <div className="reader-chronicle-summary-top">
        <h2>{title}</h2>
        <ReaderStatusBadge label={status} tone={status} />
      </div>
      {subtitle ? <p>{subtitle}</p> : null}
      <p>
        Chronicle started: <strong>{formatDate(startedAt)}</strong>
      </p>
      {latestMomentAt ? (
        <p>
          Latest chapter update: <strong>{formatDate(latestMomentAt)}</strong>
        </p>
      ) : null}
      <p>
        Current chapter: <strong>{hasCurrentScene ? "ready to read" : "not ready yet"}</strong>
      </p>
      <p>
        Reader action:{" "}
        <strong>{hasCurrentScene ? "continue reading now" : "check back soon"}</strong>
      </p>
      {currentPerspectiveId ? (
        <p>
          <PerspectiveBadge perspectiveId={currentPerspectiveId} />
        </p>
      ) : (
        <p>The current perspective is still being prepared.</p>
      )}
    </section>
  );
}
