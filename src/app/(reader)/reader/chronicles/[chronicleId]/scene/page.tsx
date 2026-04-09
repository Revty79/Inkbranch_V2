import Link from "next/link";
import { notFound } from "next/navigation";

import { createConfiguredGeneratorSceneService } from "@/core/generator/services";
import {
  applyGeneratedOutputToReaderPresentation,
  buildGeneratorSceneInputFromRuntime,
  mapRuntimeSceneForReader
} from "@/data/mappers";
import { getPerspectiveById } from "@/data/queries/authoring";
import {
  getChronicleById,
  getChronicleStateByChronicleId,
  getMostRecentSceneInstanceByChronicleId,
  getSceneChoicesBySceneInstanceId,
  getSceneInstanceById
} from "@/data/queries/runtime";
import { ReaderEmptyState, SceneFrame } from "@/ui/reader";

interface ReaderScenePageProps {
  readonly params: Promise<{
    chronicleId: string;
  }>;
}

export default async function ReaderScenePage({
  params
}: ReaderScenePageProps) {
  const { chronicleId } = await params;
  const chronicle = await getChronicleById(chronicleId);

  if (!chronicle) {
    notFound();
  }

  const chronicleState = await getChronicleStateByChronicleId(chronicle.id);
  const currentFromState = chronicleState?.currentSceneInstanceId
    ? await getSceneInstanceById(chronicleState.currentSceneInstanceId)
    : null;
  const currentScene = currentFromState
    ? currentFromState
    : await getMostRecentSceneInstanceByChronicleId(chronicle.id);

  if (!currentScene) {
    return (
      <ReaderEmptyState
        title="No current scene available"
        message="This chronicle does not yet have a committed current scene."
        action={
          <Link href={`/reader/chronicles/${chronicle.id}`}>Open summary</Link>
        }
      />
    );
  }

  const sceneChoices = await getSceneChoicesBySceneInstanceId(currentScene.id);
  const perspectiveId = chronicleState?.currentPerspectiveId ?? null;
  const perspective = perspectiveId
    ? await getPerspectiveById(perspectiveId)
    : null;
  const basePresentation = mapRuntimeSceneForReader({
    scene: currentScene,
    choices: sceneChoices,
    perspectiveId,
    perspectiveName: perspective?.name ?? null,
    progressIndex: chronicleState?.progressIndex ?? null,
    endingLocked: chronicleState?.endingLocked ?? null
  });
  const shouldGenerateLivePresentation =
    (currentScene.renderedProse?.trim().length ?? 0) === 0;
  const presentation = shouldGenerateLivePresentation
    ? await (async () => {
        const generatorInput = buildGeneratorSceneInputFromRuntime({
          scene: currentScene,
          choices: sceneChoices,
          perspectiveId,
          perspectiveName: perspective?.name ?? null,
          presentation: basePresentation
        });
        const configuredGenerator = createConfiguredGeneratorSceneService();
        const generationResult =
          await configuredGenerator.service.generateScene({
            input: generatorInput,
            options: {
              generationEnabled: configuredGenerator.runtime.generationEnabled,
              timeoutMs: 12_000
            }
          });

        if (generationResult.status === "failure") {
          return basePresentation;
        }

        return applyGeneratedOutputToReaderPresentation({
          presentation: basePresentation,
          generatedOutput: generationResult.output
        });
      })()
    : basePresentation;

  return (
    <section className="reader-route-section">
      <div className="reader-inline-links">
        <Link href={`/reader/chronicles/${chronicle.id}`}>Back to summary</Link>
      </div>
      <SceneFrame
        sceneId={presentation.sceneId}
        sceneKind={presentation.sceneKind}
        sceneGoal={presentation.sceneGoal}
        plannerCycle={presentation.plannerCycle}
        sceneStatus={presentation.sceneStatus}
        perspectiveId={presentation.perspectiveId}
        perspectiveName={presentation.perspectiveName}
        body={presentation.body}
        progressIndex={presentation.meta.progressIndex}
        endingLocked={presentation.meta.endingLocked}
        choices={presentation.choices.map((choice) => ({
          choiceId: choice.choiceId,
          label: choice.label,
          intentLabel: choice.intentLabel,
          availability: choice.availability
        }))}
      />
    </section>
  );
}
