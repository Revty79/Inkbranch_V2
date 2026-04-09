import { PerspectiveBadge } from "@/ui/reader/shared/PerspectiveBadge";
import { ReaderStatusBadge } from "@/ui/reader/shared/ReaderStatusBadge";

interface SceneHeaderProps {
  readonly sceneKind: string;
  readonly sceneGoal: string;
  readonly sceneStatus: string;
  readonly perspectiveId: string | null;
  readonly perspectiveName: string | null;
}

export function SceneHeader({
  sceneKind,
  sceneGoal,
  sceneStatus,
  perspectiveId,
  perspectiveName
}: SceneHeaderProps) {
  return (
    <header className="reader-scene-header">
      <div className="reader-scene-header-top">
        <h2>Current Scene</h2>
        <ReaderStatusBadge label={sceneStatus} tone={sceneStatus} />
      </div>
      <p>
        Kind: <strong>{sceneKind}</strong> | Goal: <strong>{sceneGoal}</strong>
      </p>
      {perspectiveId ? (
        <p>
          <PerspectiveBadge
            perspectiveId={perspectiveId}
            label={perspectiveName ?? "Perspective"}
          />
        </p>
      ) : (
        <p>Perspective context is not committed yet.</p>
      )}
    </header>
  );
}
