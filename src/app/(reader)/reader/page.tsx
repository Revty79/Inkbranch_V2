import Link from "next/link";

import { listChronicles } from "@/data/queries/runtime";
import { ReaderEmptyState } from "@/ui/reader";

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

export default async function ReaderPage() {
  const chronicles = await listChronicles();
  const featuredChronicle = chronicles[0] ?? null;
  const featuredTitle = featuredChronicle
    ? readChronicleTitle(featuredChronicle.metadata)
    : null;

  return (
    <section className="reader-entry">
      <h2>Welcome to the Reader</h2>
      <p>
        A chronicle is your active run through a story world. Choose one to
        start fresh or continue from the latest chapter.
      </p>
      {featuredChronicle && featuredTitle ? (
        <section className="reader-discovery-panel">
          <h3>Pick up where you left off</h3>
          <p>
            <strong>{featuredTitle.title}</strong>
            {featuredTitle.subtitle ? ` - ${featuredTitle.subtitle}` : null}
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
      ) : (
        <ReaderEmptyState
          title="No chronicles available yet"
          message="Create or seed a chronicle first, then return here to begin reading."
          action={
            <div className="reader-inline-links">
              <Link href="/studio">Open Studio</Link>
              <Link href="/">Back to home</Link>
            </div>
          }
        />
      )}
      <div className="reader-inline-links">
        <Link href="/reader/chronicles">Browse all chronicles</Link>
        <Link href="/">Back to home</Link>
      </div>
    </section>
  );
}
