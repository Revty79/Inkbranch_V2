import { notFound } from "next/navigation";

import {
  ChronicleInspectorNav,
  GenerationFallbackPanel,
  GenerationResultPanel
} from "@/ui/admin";
import { getSceneInstancesByChronicleId } from "@/data/queries/runtime";

import { getChronicleInspectorContext } from "../_lib/context";

interface AdminChronicleGenerationPageProps {
  readonly params: Promise<{
    chronicleId: string;
  }>;
}

function readGeneratorMode(payload: Record<string, unknown>): string {
  const mode = payload.mode;
  if (typeof mode === "string" && mode.trim().length > 0) {
    return mode;
  }

  return "unknown";
}

function readGeneratorReason(payload: Record<string, unknown>): string | null {
  const reason = payload.reason;
  if (typeof reason === "string" && reason.trim().length > 0) {
    return reason;
  }

  return null;
}

export default async function AdminChronicleGenerationPage({
  params
}: AdminChronicleGenerationPageProps) {
  const { chronicleId } = await params;
  const context = await getChronicleInspectorContext(chronicleId);

  if (!context) {
    notFound();
  }

  const scenes = await getSceneInstancesByChronicleId(context.chronicle.id);
  const generationItems = scenes.map((scene) => {
    const generatorMode = readGeneratorMode(scene.generatorPayload);
    const generatorReason = readGeneratorReason(scene.generatorPayload);

    return {
      sceneInstanceId: scene.id,
      plannerCycle: scene.plannerCycle,
      sceneKind: scene.sceneKind,
      sceneGoal: scene.sceneGoal,
      hasRenderedProse: Boolean(scene.renderedProse?.trim()),
      generatorMode,
      generatorReason
    };
  });
  const fallbackItems = generationItems
    .filter(
      (item) =>
        item.generatorMode.toLowerCase() === "fallback" ||
        (item.generatorReason?.toLowerCase().includes("fallback") ?? false)
    )
    .map((item) => ({
      sceneInstanceId: item.sceneInstanceId,
      generatorMode: item.generatorMode,
      fallbackReason: item.generatorReason ?? "unspecified"
    }));

  return (
    <section className="admin-route">
      <h2>Generation inspection</h2>
      <ChronicleInspectorNav chronicleId={context.chronicle.id} />
      <p>
        This surface shows generation presence markers from scene runtime
        records. It does not include prompt editing or generation overrides.
      </p>
      <GenerationResultPanel items={generationItems} />
      <GenerationFallbackPanel fallbacks={fallbackItems} />
    </section>
  );
}
