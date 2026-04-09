interface ProgressPanelProps {
  readonly progressIndex: number;
  readonly endingLocked: boolean;
  readonly currentSceneId?: string | null;
}

export function ProgressPanel({
  progressIndex,
  endingLocked,
  currentSceneId
}: ProgressPanelProps) {
  return (
    <section className="reader-progress-panel">
      <h3>Run Progress</h3>
      <p>
        Progress index: <strong>{progressIndex}</strong>
      </p>
      <p>
        Ending lock: <strong>{endingLocked ? "locked" : "open"}</strong>
      </p>
      <p>
        Current scene: <strong>{currentSceneId ?? "none"}</strong>
      </p>
    </section>
  );
}
