import { InspectorMetaTable } from "../shared/InspectorMetaTable";
import { InspectorStatusBadge } from "../shared/InspectorStatusBadge";

interface ChronicleSummaryProps {
  readonly chronicleId: string;
  readonly status: string;
  readonly bookVersionId: string;
  readonly readerId: string | null;
  readonly startedAt: string;
  readonly completedAt: string | null;
  readonly currentSceneInstanceId: string | null;
  readonly currentPerspectiveId: string | null;
  readonly progressIndex: number | null;
  readonly endingLocked: boolean | null;
}

export function ChronicleSummary({
  chronicleId,
  status,
  bookVersionId,
  readerId,
  startedAt,
  completedAt,
  currentSceneInstanceId,
  currentPerspectiveId,
  progressIndex,
  endingLocked
}: ChronicleSummaryProps) {
  return (
    <section className="admin-panel">
      <div className="admin-panel-top">
        <h2>{chronicleId}</h2>
        <InspectorStatusBadge label={status} tone={status} />
      </div>
      <InspectorMetaTable
        rows={[
          { label: "Book version", value: bookVersionId },
          { label: "Reader", value: readerId ?? "unassigned" },
          { label: "Started", value: startedAt },
          { label: "Completed", value: completedAt ?? "not completed" },
          {
            label: "Current scene",
            value: currentSceneInstanceId ?? "not committed"
          },
          {
            label: "Current perspective",
            value: currentPerspectiveId ?? "not committed"
          },
          { label: "Progress index", value: progressIndex ?? "unknown" },
          { label: "Ending locked", value: endingLocked ? "yes" : "no" }
        ]}
      />
    </section>
  );
}
