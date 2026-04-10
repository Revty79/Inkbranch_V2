import Link from "next/link";

import { listChronicles } from "@/data/queries/runtime";
import { ChronicleList, ReaderEmptyState } from "@/ui/reader";

function readChronicleTitle(
  metadata: Record<string, unknown>
): { title: string; subtitle: string | null } {
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

export default async function ReaderChroniclesPage() {
  const chronicles = await listChronicles();

  if (chronicles.length === 0) {
    return (
      <ReaderEmptyState
        title="No chronicles yet"
        message="Create or seed a chronicle to begin your first reading journey."
        action={<Link href="/studio">Open Studio</Link>}
      />
    );
  }

  return (
    <section className="reader-route-section">
      <h2>Chronicles</h2>
      <p>Pick a story world and continue from its latest chapter.</p>
      <ChronicleList
        chronicles={chronicles.map((chronicle) => ({
          chronicleId: chronicle.id,
          ...readChronicleTitle(chronicle.metadata),
          status: chronicle.status,
          startedAt: chronicle.startedAt,
          completedAt: chronicle.completedAt
        }))}
      />
    </section>
  );
}
