import Link from "next/link";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

import type { PlanNextSceneOutput } from "@/core/planner/contracts";
import {
  createDeterministicPlannerMvpService,
  planNextSceneForChronicle
} from "@/core/planner/services";
import { createConfiguredGeneratorSceneService } from "@/core/generator/services";
import type { RuntimeScenePlanPayload } from "@/core/runtime/contracts";
import {
  applyGeneratedOutputToReaderPresentation,
  buildGeneratorSceneInputFromRuntime,
  mapRuntimeSceneForReader
} from "@/data/mappers";
import { createDatabaseRuntimeCommitPipeline } from "@/data/mutations/runtime";
import { getPerspectiveById } from "@/data/queries/authoring";
import {
  getChronicleById,
  getChronicleStateByChronicleId,
  getMostRecentSceneInstanceByChronicleId,
  getPerspectiveRunsByChronicleId,
  runtimePlanningContextLoader,
  getSceneChoicesBySceneInstanceId,
  getSceneInstanceById
} from "@/data/queries/runtime";
import { ReaderEmptyState, SceneFrame } from "@/ui/reader";

interface ReaderScenePageProps {
  readonly params: Promise<{
    chronicleId: string;
  }>;
  readonly searchParams?: Promise<{
    notice?: string;
  }>;
}

function toRuntimeScenePlanPayload(
  plannerOutput: PlanNextSceneOutput
): RuntimeScenePlanPayload | null {
  if (plannerOutput.status === "failure") {
    return null;
  }

  return {
    plannerStatus: plannerOutput.status === "success" ? "success" : "fallback",
    scenePackage:
      plannerOutput.status === "success"
        ? plannerOutput.scenePackage
        : plannerOutput.fallbackScenePackage,
    plannerDiagnostics: {
      requestId: plannerOutput.diagnostics.requestId,
      notes: plannerOutput.diagnostics.notes ?? []
    }
  };
}

function readNoticeMessage(notice: string | undefined): string | null {
  if (notice === "continued") {
    return "Your choice is committed. The next chapter is ready.";
  }

  if (notice === "choice-unavailable") {
    return "That path could not be taken. Please choose one of the available options.";
  }

  if (notice === "choice-invalid") {
    return "Could not read your selection. Please try again.";
  }

  return null;
}

export default async function ReaderScenePage({
  params,
  searchParams
}: ReaderScenePageProps) {
  const { chronicleId } = await params;
  const query = searchParams ? await searchParams : {};
  const chronicle = await getChronicleById(chronicleId);

  if (!chronicle) {
    notFound();
  }
  const activeChronicle = chronicle;

  const chronicleState = await getChronicleStateByChronicleId(
    activeChronicle.id
  );
  const currentFromState = chronicleState?.currentSceneInstanceId
    ? await getSceneInstanceById(chronicleState.currentSceneInstanceId)
    : null;
  const currentScene = currentFromState
    ? currentFromState
    : await getMostRecentSceneInstanceByChronicleId(activeChronicle.id);

  if (!currentScene) {
    return (
      <ReaderEmptyState
        title="No chapter is ready yet"
        message="This chronicle does not yet have a chapter ready to read."
        action={
          <Link href={`/reader/chronicles/${activeChronicle.id}`}>
            Story so far
          </Link>
        }
      />
    );
  }
  const activeScene = currentScene;

  async function chooseAndContinueAction(formData: FormData) {
    "use server";

    const selectedChoiceId = formData.get("sceneChoiceId");
    const selectedSceneInstanceId = formData.get("sceneInstanceId");

    if (
      typeof selectedChoiceId !== "string" ||
      selectedChoiceId.length === 0 ||
      typeof selectedSceneInstanceId !== "string" ||
      selectedSceneInstanceId.length === 0
    ) {
      redirect(
        `/reader/chronicles/${activeChronicle.id}/scene?notice=choice-invalid`
      );
    }

    if (selectedSceneInstanceId !== activeScene.id) {
      redirect(
        `/reader/chronicles/${activeChronicle.id}/scene?notice=choice-unavailable`
      );
    }

    const runtimePipeline = createDatabaseRuntimeCommitPipeline();
    const resolutionResult = await runtimePipeline.resolveChoice({
      requestId: `reader:resolve:${activeChronicle.id}:${selectedChoiceId}`,
      chronicleId: activeChronicle.id,
      sceneInstanceId: selectedSceneInstanceId,
      sceneChoiceId: selectedChoiceId
    });

    if (resolutionResult.status === "failure") {
      redirect(
        `/reader/chronicles/${activeChronicle.id}/scene?notice=choice-unavailable`
      );
    }

    const updatedChronicleState = await getChronicleStateByChronicleId(
      activeChronicle.id
    );
    const preferredPerspectiveId =
      updatedChronicleState?.currentPerspectiveId ?? undefined;

    const planner = createDeterministicPlannerMvpService();
    const plannerResult = await planNextSceneForChronicle(
      planner,
      runtimePlanningContextLoader,
      {
        chronicleId: activeChronicle.id,
        requestId: `reader:plan:${activeChronicle.id}:${selectedChoiceId}`,
        preferredPerspectiveId
      }
    );
    const runtimePlannerPayload = toRuntimeScenePlanPayload(plannerResult);

    if (!runtimePlannerPayload) {
      redirect(
        `/reader/chronicles/${activeChronicle.id}?notice=choice-saved-awaiting-next-chapter`
      );
    }

    const perspectiveRuns = await getPerspectiveRunsByChronicleId(
      activeChronicle.id
    );
    const preferredRun = preferredPerspectiveId
      ? perspectiveRuns
          .filter((run) => run.perspectiveId === preferredPerspectiveId)
          .at(-1)
      : null;
    const selectedPerspectiveRunId =
      preferredRun?.id ?? resolutionResult.data.perspectiveRun.id;

    const instantiationResult = await runtimePipeline.instantiateScene({
      requestId: `reader:instantiate:${activeChronicle.id}:${selectedChoiceId}`,
      chronicleId: activeChronicle.id,
      perspectiveRunId: selectedPerspectiveRunId,
      plannerResult: runtimePlannerPayload
    });

    if (instantiationResult.status === "failure") {
      redirect(
        `/reader/chronicles/${activeChronicle.id}?notice=choice-saved-awaiting-next-chapter`
      );
    }

    revalidatePath(`/reader/chronicles/${activeChronicle.id}`);
    revalidatePath(`/reader/chronicles/${activeChronicle.id}/scene`);
    redirect(`/reader/chronicles/${activeChronicle.id}/scene?notice=continued`);
  }

  const sceneChoices = await getSceneChoicesBySceneInstanceId(activeScene.id);
  const perspectiveId = chronicleState?.currentPerspectiveId ?? null;
  const perspective = perspectiveId
    ? await getPerspectiveById(perspectiveId)
    : null;
  const basePresentation = mapRuntimeSceneForReader({
    scene: activeScene,
    choices: sceneChoices,
    perspectiveId,
    perspectiveName: perspective?.name ?? null,
    progressIndex: chronicleState?.progressIndex ?? null,
    endingLocked: chronicleState?.endingLocked ?? null
  });
  const shouldGenerateLivePresentation =
    (activeScene.renderedProse?.trim().length ?? 0) === 0;
  const presentation = shouldGenerateLivePresentation
      ? await (async () => {
        const generatorInput = buildGeneratorSceneInputFromRuntime({
          scene: activeScene,
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
  const noticeMessage = readNoticeMessage(query.notice);

  return (
    <section className="reader-route-section">
      <div className="reader-inline-links">
        <Link href={`/reader/chronicles/${activeChronicle.id}`}>
          Story so far
        </Link>
        <Link href="/reader/chronicles">All chronicles</Link>
      </div>
      {noticeMessage ? <p className="reader-flow-note">{noticeMessage}</p> : null}
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
        onSelectChoice={chooseAndContinueAction}
      />
    </section>
  );
}
