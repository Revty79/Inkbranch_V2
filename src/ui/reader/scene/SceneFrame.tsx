import { SceneBody, type SceneBodyModel } from "./SceneBody";
import { ChoiceList, type SceneChoiceListItem } from "./ChoiceList";
import { SceneHeader } from "./SceneHeader";
import { SceneMeta } from "./SceneMeta";

interface SceneFrameProps {
  readonly sceneId: string;
  readonly sceneKind: string;
  readonly sceneGoal: string;
  readonly plannerCycle: number;
  readonly sceneStatus: string;
  readonly perspectiveId: string | null;
  readonly perspectiveName: string | null;
  readonly body: SceneBodyModel;
  readonly progressIndex: number | null;
  readonly endingLocked: boolean | null;
  readonly choices: SceneChoiceListItem[];
}

export function SceneFrame({
  sceneId,
  sceneKind,
  sceneGoal,
  plannerCycle,
  sceneStatus,
  perspectiveId,
  perspectiveName,
  body,
  progressIndex,
  endingLocked,
  choices
}: SceneFrameProps) {
  const enabledChoiceCount = choices.filter(
    (choice) => choice.availability === "enabled"
  ).length;

  return (
    <section className="reader-scene-frame">
      <SceneHeader
        sceneKind={sceneKind}
        sceneGoal={sceneGoal}
        sceneStatus={sceneStatus}
        perspectiveId={perspectiveId}
        perspectiveName={perspectiveName}
      />
      <SceneBody body={body} />
      <SceneMeta
        sceneInstanceId={sceneId}
        plannerCycle={plannerCycle}
        progressIndex={progressIndex}
        endingLocked={endingLocked}
        enabledChoiceCount={enabledChoiceCount}
        disabledChoiceCount={choices.length - enabledChoiceCount}
      />
      <ChoiceList choices={choices} />
    </section>
  );
}
