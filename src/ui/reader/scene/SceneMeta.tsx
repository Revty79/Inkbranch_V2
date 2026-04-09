import { ReaderStatusBadge } from "@/ui/reader/shared/ReaderStatusBadge";

interface SceneMetaProps {
  readonly sceneInstanceId: string;
  readonly plannerCycle: number;
  readonly progressIndex: number | null;
  readonly endingLocked: boolean | null;
  readonly enabledChoiceCount: number;
  readonly disabledChoiceCount: number;
}

export function SceneMeta({
  sceneInstanceId,
  plannerCycle,
  progressIndex,
  endingLocked,
  enabledChoiceCount,
  disabledChoiceCount
}: SceneMetaProps) {
  return (
    <header className="reader-scene-meta">
      <h3>Scene Metadata</h3>
      <p>
        <strong>{sceneInstanceId}</strong>
      </p>
      <p>
        Planner cycle: <strong>{plannerCycle}</strong>
      </p>
      <p>
        Progress index: <strong>{progressIndex ?? "unknown"}</strong>
      </p>
      <p>
        Ending lock:{" "}
        <strong>
          {endingLocked === null ? "unknown" : endingLocked ? "locked" : "open"}
        </strong>
      </p>
      <p>
        Choices: <strong>{enabledChoiceCount}</strong> enabled /{" "}
        <strong>{disabledChoiceCount}</strong> disabled
      </p>
      <ReaderStatusBadge label="metadata" tone="planned" />
    </header>
  );
}
