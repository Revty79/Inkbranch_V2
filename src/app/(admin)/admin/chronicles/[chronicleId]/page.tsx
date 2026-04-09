import { notFound } from "next/navigation";

import {
  ChronicleInspectorNav,
  ChronicleSummary,
  PerspectiveRunList
} from "@/ui/admin";

import { getChronicleInspectorContext } from "./_lib/context";

interface AdminChronicleSummaryPageProps {
  readonly params: Promise<{
    chronicleId: string;
  }>;
}

export default async function AdminChronicleSummaryPage({
  params
}: AdminChronicleSummaryPageProps) {
  const { chronicleId } = await params;
  const context = await getChronicleInspectorContext(chronicleId);

  if (!context) {
    notFound();
  }

  return (
    <section className="admin-route">
      <h2>Chronicle inspector hub</h2>
      <ChronicleInspectorNav chronicleId={context.chronicle.id} />
      <ChronicleSummary
        chronicleId={context.chronicle.id}
        status={context.chronicle.status}
        bookVersionId={context.chronicle.bookVersionId}
        readerId={context.chronicle.readerId}
        startedAt={context.chronicle.startedAt}
        completedAt={context.chronicle.completedAt}
        currentSceneInstanceId={
          context.chronicleState?.currentSceneInstanceId ?? null
        }
        currentPerspectiveId={
          context.chronicleState?.currentPerspectiveId ?? null
        }
        progressIndex={context.chronicleState?.progressIndex ?? null}
        endingLocked={context.chronicleState?.endingLocked ?? null}
      />
      <PerspectiveRunList
        chronicleId={context.chronicle.id}
        runs={context.perspectiveRuns.map((run) => ({
          id: run.id,
          perspectiveId: run.perspectiveId,
          perspectiveName:
            context.perspectiveNameById.get(run.perspectiveId) ?? null,
          status: run.status,
          entryCount: run.entryCount,
          knowledgeScore: run.knowledgeScore,
          lastSceneInstanceId: run.lastSceneInstanceId,
          updatedAt: run.updatedAt
        }))}
      />
    </section>
  );
}
