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
  const featuredChronicle = chronicles[0] ?? null;
  const featuredTitle = featuredChronicle
    ? readChronicleTitle(featuredChronicle.metadata)
    : null;

  if (chronicles.length === 0) {
    return (
      <ReaderEmptyState
        title="No chronicles yet"
        message="Create or seed a chronicle to begin your first reading journey."
        action={
          <div className="reader-inline-links">
            <Link href="/studio">Open Studio</Link>
            <Link href="/">Back to home</Link>
          </div>
        }
      />
    );
  }

  return (
    <section className="reader-route-section">
      <h2>Chronicles</h2>
      <p>
        Discover story runs you can start now or continue from the latest
        chapter.
      </p>
      {featuredChronicle && featuredTitle ? (
        <section className="reader-discovery-panel">
          <h3>Recommended next step</h3>
          <p>
            Continue <strong>{featuredTitle.title}</strong> from where you left
            off.
          </p>
          <div className="reader-inline-links">
            <Link href={`/reader/chronicles/${featuredChronicle.id}`}>
              Story so far
            </Link>
            <Link href={`/reader/chronicles/${featuredChronicle.id}/scene`}>
              Continue reading
            </Link>
          </div>
        </section>
      ) : null}
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
