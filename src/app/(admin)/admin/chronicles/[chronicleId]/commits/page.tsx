import { notFound } from "next/navigation";

import { CanonCommitList, ChronicleInspectorNav } from "@/ui/admin";
import { getCanonCommitsByChronicleId } from "@/data/queries/runtime";

import { getChronicleInspectorContext } from "../_lib/context";

interface AdminChronicleCommitsPageProps {
  readonly params: Promise<{
    chronicleId: string;
  }>;
}

export default async function AdminChronicleCommitsPage({
  params
}: AdminChronicleCommitsPageProps) {
  const { chronicleId } = await params;
  const context = await getChronicleInspectorContext(chronicleId);

  if (!context) {
    notFound();
  }

  const commits = await getCanonCommitsByChronicleId(context.chronicle.id);

  return (
    <section className="admin-route">
      <h2>Canon commits</h2>
      <ChronicleInspectorNav chronicleId={context.chronicle.id} />
      <CanonCommitList
        commits={commits.map((commit) => ({
          commitId: commit.id,
          commitType: commit.commitType,
          commitKey: commit.commitKey,
          canonEntryId: commit.canonEntryId,
          sourceEventId: commit.sourceEventId,
          commitValue: commit.commitValue,
          createdAt: commit.createdAt
        }))}
      />
    </section>
  );
}
