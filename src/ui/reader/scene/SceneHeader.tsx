import { PerspectiveBadge } from "@/ui/reader/shared/PerspectiveBadge";
import { ReaderStatusBadge } from "@/ui/reader/shared/ReaderStatusBadge";

interface SceneHeaderProps {
  readonly sceneKind: string;
  readonly sceneGoal: string;
  readonly sceneStatus: string;
  readonly perspectiveId: string | null;
  readonly perspectiveName: string | null;
}

function describeSceneKind(sceneKind: string): string {
  if (sceneKind === "opening") {
    return "Opening";
  }

  if (sceneKind === "development") {
    return "Turning point";
  }

  if (sceneKind === "revelation") {
    return "Revelation";
  }

  if (sceneKind === "consequence") {
    return "Aftermath";
  }

  if (sceneKind === "ending") {
    return "Ending";
  }

  return sceneKind;
}

function describeSceneGoal(sceneGoal: string): string {
  if (sceneGoal === "advance-arc") {
    return "Advance the main arc";
  }

  if (sceneGoal === "surface-reveal") {
    return "Uncover a hidden truth";
  }

  if (sceneGoal === "deliver-ending") {
    return "Approach an ending";
  }

  return sceneGoal;
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
        {describeSceneKind(sceneKind)} moment. Focus:{" "}
        <strong>{describeSceneGoal(sceneGoal)}</strong>.
      </p>
      {perspectiveId ? (
        <p>
          <PerspectiveBadge
            perspectiveId={perspectiveId}
            label={perspectiveName ?? "Perspective"}
          />
        </p>
      ) : (
        <p>The point of view is still being selected.</p>
      )}
    </header>
  );
}
