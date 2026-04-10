import Link from "next/link";

import { APP_TITLE } from "@/lib/constants";

const PRIMARY_ACTIONS = [
  {
    href: "/reader",
    label: "Start Reading",
    description: "Open the Reader and jump into your first chronicle."
  },
  {
    href: "/reader/chronicles",
    label: "Continue a Chronicle",
    description: "Pick up an existing run from its latest chapter."
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
      <section className="public-home-onboarding">
        <h2>How to begin</h2>
        <ol>
          <li>Open the Reader to browse available chronicles.</li>
          <li>Select a chronicle and check “Story so far.”</li>
          <li>Choose “Continue reading” to enter the active chapter.</li>
        </ol>
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
          No chronicles yet? Start with <Link href="/studio">Studio</Link> to
          create or seed story content.
        </p>
        <p>
          Looking for runtime inspection tools?{" "}
          <Link href="/admin">Admin Inspector</Link> is available for internal
          diagnostics.
        </p>
      </section>
    </main>
  );
}
