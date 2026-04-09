import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ChronicleInspectorNav,
  ChronicleStatePanel,
  InspectorEmptyState,
  PerspectiveRunList
} from "@/ui/admin";

import { getChronicleInspectorContext } from "../_lib/context";

interface AdminChronicleStatePageProps {
  readonly params: Promise<{
    chronicleId: string;
  }>;
}

export default async function AdminChronicleStatePage({
  params
}: AdminChronicleStatePageProps) {
  const { chronicleId } = await params;
  const context = await getChronicleInspectorContext(chronicleId);

  if (!context) {
    notFound();
  }

  return (
    <section className="admin-route">
      <h2>Chronicle state</h2>
      <ChronicleInspectorNav chronicleId={context.chronicle.id} />
      {context.chronicleState ? (
        <ChronicleStatePanel
          chronicleId={context.chronicleState.chronicleId}
          currentSceneInstanceId={context.chronicleState.currentSceneInstanceId}
          currentPerspectiveId={context.chronicleState.currentPerspectiveId}
          progressIndex={context.chronicleState.progressIndex}
          endingLocked={context.chronicleState.endingLocked}
          summaryJson={context.chronicleState.summary}
          updatedAt={context.chronicleState.updatedAt}
        />
      ) : (
        <InspectorEmptyState
          title="No chronicle state projection"
          message="Chronicle state projection has not been created for this chronicle."
          action={
            <Link href={`/admin/chronicles/${context.chronicle.id}`}>
              Back to summary
            </Link>
          }
        />
      )}
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
