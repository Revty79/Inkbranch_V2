import { ReaderStatusBadge } from "@/ui/reader/shared/ReaderStatusBadge";

interface SceneMetaProps {
  readonly plannerCycle: number;
  readonly progressIndex: number | null;
  readonly endingLocked: boolean | null;
  readonly enabledChoiceCount: number;
  readonly disabledChoiceCount: number;
}

export function SceneMeta({
  plannerCycle,
  progressIndex,
  endingLocked,
  enabledChoiceCount,
  disabledChoiceCount
}: SceneMetaProps) {
  return (
    <header className="reader-scene-meta">
      <h3>Chapter Snapshot</h3>
      <p>
        Chapter in chronicle:{" "}
        <strong>{progressIndex === null ? "unknown" : progressIndex + 1}</strong>
      </p>
      <p>
        Story cycle: <strong>{plannerCycle}</strong>
      </p>
      <p>
        Ending trajectory:{" "}
        <strong>
          {endingLocked === null
            ? "unknown"
            : endingLocked
              ? "locked in"
              : "still open"}
        </strong>
      </p>
      <p>
        Paths available: <strong>{enabledChoiceCount}</strong> open /{" "}
        <strong>{disabledChoiceCount}</strong> locked
      </p>
      <ReaderStatusBadge label="chapter" tone="planned" />
    </header>
  );
}
