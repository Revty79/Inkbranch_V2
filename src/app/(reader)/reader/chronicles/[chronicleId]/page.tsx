import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getChronicleById,
  getChronicleStateByChronicleId,
  getMostRecentSceneInstanceByChronicleId,
  getPerspectiveRunsByChronicleId,
  getSceneInstanceById
} from "@/data/queries/runtime";
import {
  ChronicleSummary,
  ProgressPanel,
  ReaderEmptyState,
  ReaderStatusBadge
} from "@/ui/reader";

interface ReaderChroniclePageProps {
  readonly params: Promise<{
    chronicleId: string;
  }>;
}

export default async function ReaderChroniclePage({
  params
}: ReaderChroniclePageProps) {
  const { chronicleId } = await params;
  const chronicle = await getChronicleById(chronicleId);

  if (!chronicle) {
    notFound();
  }

  const [chronicleState, perspectiveRuns] = await Promise.all([
    getChronicleStateByChronicleId(chronicle.id),
    getPerspectiveRunsByChronicleId(chronicle.id)
  ]);

  const currentSceneFromState = chronicleState?.currentSceneInstanceId
    ? await getSceneInstanceById(chronicleState.currentSceneInstanceId)
    : null;
  const mostRecentScene = currentSceneFromState
    ? currentSceneFromState
    : await getMostRecentSceneInstanceByChronicleId(chronicle.id);
  const currentPerspectiveId =
    chronicleState?.currentPerspectiveId ??
    perspectiveRuns.at(-1)?.perspectiveId ??
    null;

  return (
    <section className="reader-route-section">
      <div className="reader-chronicle-overview-top">
        <h2>Chronicle Summary</h2>
        <ReaderStatusBadge label={chronicle.status} tone={chronicle.status} />
      </div>
      <ChronicleSummary
        chronicleId={chronicle.id}
        status={chronicle.status}
        startedAt={chronicle.startedAt}
        currentPerspectiveId={currentPerspectiveId}
        currentSceneInstanceId={mostRecentScene?.id ?? null}
      />
      <ProgressPanel
        progressIndex={chronicleState?.progressIndex ?? 0}
        endingLocked={chronicleState?.endingLocked ?? false}
        currentSceneId={mostRecentScene?.id ?? null}
      />
      {mostRecentScene ? (
        <div className="reader-inline-links">
          <Link href={`/reader/chronicles/${chronicle.id}/scene`}>
            Open current scene
          </Link>
        </div>
      ) : (
        <ReaderEmptyState
          title="No scene instance yet"
          message="This chronicle has no committed scene instance yet. Run planning + runtime commit to produce a readable scene."
          action={<Link href="/reader/chronicles">Back to chronicles</Link>}
        />
      )}
    </section>
  );
}
