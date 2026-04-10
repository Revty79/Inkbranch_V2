import Link from "next/link";

import { APP_TITLE } from "@/lib/constants";

const PRIMARY_ACTIONS = [
  {
    href: "/reader",
    label: "Start Reading",
    description: "Step into a chronicle and continue from the latest scene."
  },
  {
    href: "/reader/chronicles",
    label: "Browse Chronicles",
    description: "Choose a world and point of view to follow."
  },
  {
    href: "/studio",
    label: "Open Studio",
    description: "Build worlds, perspectives, and story rules as an author."
  }
] as const;

export default function HomePage() {
  return (
    <main className="public-home">
      <section className="public-home-hero">
        <p className="public-home-kicker">Interactive fiction, story first.</p>
        <h1>{APP_TITLE}</h1>
        <p>
          Inkbranch is a chronicle reading experience where you move through
          authored worlds, follow shifting perspectives, and choose what happens
          next.
        </p>
      </section>
      <section className="public-home-actions" aria-label="Get started">
        {PRIMARY_ACTIONS.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="public-action-card"
          >
            <h2>{action.label}</h2>
            <p>{action.description}</p>
          </Link>
        ))}
      </section>
      <section className="public-home-note">
        <p>
          Looking for runtime inspection tools?{" "}
          <Link href="/admin">Admin Inspector</Link> is available for internal
          diagnostics.
        </p>
      </section>
    </main>
  );
}
