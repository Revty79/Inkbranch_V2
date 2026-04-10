import Link from "next/link";

import { ReaderEmptyState } from "@/ui/reader";

export default function ReaderPage() {
  return (
    <section className="reader-entry">
      <h2>Begin a Chronicle</h2>
      <p>
        Pick a chronicle to continue a story in progress, revisit the latest
        scene, and choose where the narrative goes next.
      </p>
      <p>
        New to Inkbranch? Start in the chronicle list and open the story that
        interests you.
      </p>
      <div className="reader-inline-links">
        <Link href="/reader/chronicles">Browse chronicles</Link>
        <Link href="/">Back to home</Link>
      </div>
      <ReaderEmptyState
        title="No chronicle selected"
        message="Choose a chronicle to jump into its current chapter."
        action={<Link href="/reader/chronicles">Go to chronicles</Link>}
      />
    </section>
  );
}
