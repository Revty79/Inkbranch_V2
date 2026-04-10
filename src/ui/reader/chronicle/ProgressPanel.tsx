interface ProgressPanelProps {
  readonly progressIndex: number;
  readonly endingLocked: boolean;
  readonly hasCurrentScene: boolean;
}

export function ProgressPanel({
  progressIndex,
  endingLocked,
  hasCurrentScene
}: ProgressPanelProps) {
  return (
    <section className="reader-progress-panel">
      <h3>Reading Progress</h3>
      <p>
        Chapters progressed: <strong>{progressIndex}</strong>
      </p>
      <p>
        Ending path: <strong>{endingLocked ? "locked in" : "still open"}</strong>
      </p>
      <p>
        Next chapter: <strong>{hasCurrentScene ? "ready now" : "not available yet"}</strong>
      </p>
    </section>
  );
}
