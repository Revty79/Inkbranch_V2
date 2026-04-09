import { notFound } from "next/navigation";

import { ChronicleInspectorNav, SceneInstanceList } from "@/ui/admin";
import { getSceneInstancesByChronicleId } from "@/data/queries/runtime";

import { getChronicleInspectorContext } from "../_lib/context";

interface AdminChronicleScenesPageProps {
  readonly params: Promise<{
    chronicleId: string;
  }>;
}

export default async function AdminChronicleScenesPage({
  params
}: AdminChronicleScenesPageProps) {
  const { chronicleId } = await params;
  const context = await getChronicleInspectorContext(chronicleId);

  if (!context) {
    notFound();
  }

  const scenes = await getSceneInstancesByChronicleId(context.chronicle.id);

  return (
    <section className="admin-route">
      <h2>Scene instances</h2>
      <ChronicleInspectorNav chronicleId={context.chronicle.id} />
      <SceneInstanceList
        chronicleId={context.chronicle.id}
        scenes={scenes.map((scene) => ({
          sceneInstanceId: scene.id,
          plannerCycle: scene.plannerCycle,
          sceneKind: scene.sceneKind,
          sceneGoal: scene.sceneGoal,
          status: scene.status,
          perspectiveRunId: scene.perspectiveRunId,
          hasRenderedProse: Boolean(scene.renderedProse?.trim()),
          hasGeneratorPayload: Object.keys(scene.generatorPayload).length > 0
        }))}
      />
    </section>
  );
}
