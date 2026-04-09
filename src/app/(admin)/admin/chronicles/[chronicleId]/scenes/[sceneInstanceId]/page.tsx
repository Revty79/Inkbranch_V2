import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ChoiceResolutionPanel,
  ChronicleInspectorNav,
  SceneChoiceList,
  SceneInstanceDetail
} from "@/ui/admin";
import {
  getChoiceResolutionsBySceneInstanceId,
  getSceneChoicesBySceneInstanceId,
  getSceneInstanceById
} from "@/data/queries/runtime";

import { getChronicleInspectorContext } from "../../_lib/context";

interface AdminSceneDetailPageProps {
  readonly params: Promise<{
    chronicleId: string;
    sceneInstanceId: string;
  }>;
}

export default async function AdminSceneDetailPage({
  params
}: AdminSceneDetailPageProps) {
  const { chronicleId, sceneInstanceId } = await params;
  const context = await getChronicleInspectorContext(chronicleId);

  if (!context) {
    notFound();
  }

  const scene = await getSceneInstanceById(sceneInstanceId);

  if (!scene || scene.chronicleId !== context.chronicle.id) {
    notFound();
  }

  const [choices, resolutions] = await Promise.all([
    getSceneChoicesBySceneInstanceId(scene.id),
    getChoiceResolutionsBySceneInstanceId(scene.id)
  ]);
  const resolutionByChoiceId = new Map(
    resolutions.map((resolution) => [resolution.sceneChoiceId, resolution])
  );

  return (
    <section className="admin-route">
      <h2>Scene detail</h2>
      <ChronicleInspectorNav chronicleId={context.chronicle.id} />
      <div className="admin-inline-links">
        <Link href={`/admin/chronicles/${context.chronicle.id}/scenes`}>
          Back to scene list
        </Link>
      </div>
      <SceneInstanceDetail
        sceneInstanceId={scene.id}
        chronicleId={scene.chronicleId}
        perspectiveRunId={scene.perspectiveRunId}
        plannerCycle={scene.plannerCycle}
        sceneKind={scene.sceneKind}
        sceneGoal={scene.sceneGoal}
        status={scene.status}
        renderedProse={scene.renderedProse}
        plannerPayload={scene.plannerPayload}
        generatorPayload={scene.generatorPayload}
      />
      <h3>Scene choices</h3>
      <SceneChoiceList
        choices={choices.map((choice) => ({
          choiceId: choice.id,
          choiceKey: choice.choiceKey,
          label: choice.label,
          intent: choice.intent,
          sortOrder: choice.sortOrder,
          isEnabled: choice.isEnabled,
          resolutionType:
            resolutionByChoiceId.get(choice.id)?.resolutionType ?? null,
          resolvedAt: resolutionByChoiceId.get(choice.id)?.resolvedAt ?? null
        }))}
      />
      <h3>Choice resolutions</h3>
      <ChoiceResolutionPanel
        resolutions={resolutions.map((resolution) => ({
          resolutionId: resolution.id,
          sceneChoiceId: resolution.sceneChoiceId,
          resolutionType: resolution.resolutionType,
          resolvedAt: resolution.resolvedAt,
          resolutionPayload: resolution.resolutionPayload
        }))}
      />
    </section>
  );
}
