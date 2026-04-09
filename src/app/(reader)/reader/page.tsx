import Link from "next/link";

import { ReaderEmptyState } from "@/ui/reader";

export default function ReaderPage() {
  return (
    <section className="reader-entry">
      <h2>Reader Home</h2>
      <p>
        Reader routes present chronicle progress, committed scene instances, and
        currently available choices.
      </p>
      <p>
        Runtime commit and planner logic remain outside this UI shell. The
        reader only displays committed state.
      </p>
      <div className="reader-inline-links">
        <Link href="/reader/chronicles">Browse chronicles</Link>
      </div>
      <ReaderEmptyState
        title="No chronicle selected"
        message="Open a chronicle from the list to view its summary and current scene."
        action={<Link href="/reader/chronicles">Go to chronicles</Link>}
      />
    </section>
  );
}
