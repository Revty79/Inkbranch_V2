import Link from "next/link";

import { listChronicles } from "@/data/queries/runtime";
import { ChronicleList, ReaderEmptyState } from "@/ui/reader";

export default async function ReaderChroniclesPage() {
  const chronicles = await listChronicles();

  if (chronicles.length === 0) {
    return (
      <ReaderEmptyState
        title="No chronicles available"
        message="Create or seed a chronicle to begin reading committed runtime scenes."
        action={<Link href="/studio">Open Studio</Link>}
      />
    );
  }

  return (
    <section className="reader-route-section">
      <h2>Chronicles</h2>
      <p>Select a chronicle to view run status and open its current scene.</p>
      <ChronicleList
        chronicles={chronicles.map((chronicle) => ({
          chronicleId: chronicle.id,
          status: chronicle.status,
          startedAt: chronicle.startedAt,
          completedAt: chronicle.completedAt
        }))}
      />
    </section>
  );
}
