import { notFound } from "next/navigation";

import { ChronicleInspectorNav, KnowledgeStateList } from "@/ui/admin";
import { getKnowledgeStateByChronicleId } from "@/data/queries/runtime";

import { getChronicleInspectorContext } from "../_lib/context";

interface AdminChronicleKnowledgePageProps {
  readonly params: Promise<{
    chronicleId: string;
  }>;
}

export default async function AdminChronicleKnowledgePage({
  params
}: AdminChronicleKnowledgePageProps) {
  const { chronicleId } = await params;
  const context = await getChronicleInspectorContext(chronicleId);

  if (!context) {
    notFound();
  }

  const knowledgeEntries = await getKnowledgeStateByChronicleId(
    context.chronicle.id
  );

  return (
    <section className="admin-route">
      <h2>Knowledge state</h2>
      <ChronicleInspectorNav chronicleId={context.chronicle.id} />
      <KnowledgeStateList
        entries={knowledgeEntries.map((entry) => ({
          knowledgeId: entry.id,
          knowledgeKey: entry.knowledgeKey,
          knowledgeStatus: entry.knowledgeStatus,
          perspectiveId: entry.perspectiveId,
          sourceSceneInstanceId: entry.sourceSceneInstanceId,
          metadata: entry.metadata
        }))}
      />
    </section>
  );
}
