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
  readonly searchParams?: Promise<{
    notice?: string;
  }>;
}

function readChronicleTitle(metadata: Record<string, unknown>): {
  title: string;
  subtitle: string | null;
} {
  const label = metadata.label;
  const seedProfile = metadata.seedProfile;

  if (typeof label === "string" && label.trim().length > 0) {
    return {
      title: label,
      subtitle:
        typeof seedProfile === "string" && seedProfile.trim().length > 0
          ? `Profile: ${seedProfile}`
          : null
    };
  }

  return {
    title: "Untitled Chronicle",
    subtitle: null
  };
}

function readNoticeMessage(notice: string | undefined): string | null {
  if (notice === "choice-saved-awaiting-next-chapter") {
    return "Your choice was recorded. The next chapter is still being prepared.";
  }

  return null;
}

export default async function ReaderChroniclePage({
  params,
  searchParams
}: ReaderChroniclePageProps) {
  const { chronicleId } = await params;
  const query = searchParams ? await searchParams : {};
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
  const chronicleTitle = readChronicleTitle(chronicle.metadata);
  const noticeMessage = readNoticeMessage(query.notice);

  return (
    <section className="reader-route-section">
      <div className="reader-chronicle-overview-top">
        <h2>Story So Far</h2>
        <ReaderStatusBadge label={chronicle.status} tone={chronicle.status} />
      </div>
      <p>
        This chronicle tracks one ongoing run through the world. Review the
        current state, then continue into the latest chapter.
      </p>
      {noticeMessage ? <p className="reader-flow-note">{noticeMessage}</p> : null}
      <ChronicleSummary
        title={chronicleTitle.title}
        subtitle={chronicleTitle.subtitle}
        status={chronicle.status}
        startedAt={chronicle.startedAt}
        latestMomentAt={mostRecentScene?.updatedAt ?? null}
        currentPerspectiveId={currentPerspectiveId}
        hasCurrentScene={Boolean(mostRecentScene)}
      />
      <ProgressPanel
        progressIndex={chronicleState?.progressIndex ?? 0}
        endingLocked={chronicleState?.endingLocked ?? false}
        hasCurrentScene={Boolean(mostRecentScene)}
      />
      {mostRecentScene ? (
        <div className="reader-inline-links">
          <Link href={`/reader/chronicles/${chronicle.id}/scene`}>
            Continue reading
          </Link>
          <Link href="/reader/chronicles">Browse other chronicles</Link>
        </div>
      ) : (
        <ReaderEmptyState
          title="No chapter is ready yet"
          message="This chronicle has not produced its first readable chapter yet. Choose another chronicle or return after new story content is generated."
          action={
            <div className="reader-inline-links">
              <Link href="/reader/chronicles">Browse chronicles</Link>
              <Link href="/reader">Reader home</Link>
            </div>
          }
        />
      )}
    </section>
  );
}
