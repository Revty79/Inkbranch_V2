import Link from "next/link";

import {
  StudioOverviewPanel,
  StudioSectionCard,
  StudioSectionHeader
} from "@/ui/studio";

const STUDIO_SECTIONS = [
  {
    title: "Worlds",
    description:
      "Start with the story universe that will hold one or more books.",
    href: "/studio/worlds",
    status: "ready",
    actionLabel: "Set up worlds"
  },
  {
    title: "Books",
    description:
      "Create books inside a world with a premise, tone, and story promise.",
    href: "/studio/books",
    status: "ready",
    actionLabel: "Manage books"
  },
  {
    title: "Versions",
    description:
      "Create draft, test, and published versions for each book.",
    href: "/studio/versions",
    status: "ready",
    actionLabel: "Choose versions"
  },
  {
    title: "Canon",
    description:
      "Write the facts this version must stay true to during story progression.",
    href: "/studio/canon",
    status: "ready",
    actionLabel: "Write canon"
  },
  {
    title: "Entities",
    description:
      "Define the cast, locations, factions, and perspectives readers follow.",
    href: "/studio/entities",
    status: "ready",
    actionLabel: "Build entities"
  },
  {
    title: "Planning",
    description:
      "Shape milestones, reveals, pacing, and ending paths for this version.",
    href: "/studio/planning",
    status: "ready",
    actionLabel: "Set planning rules"
  }
] as const;

export default function StudioOverviewPage() {
  return (
    <>
      <StudioSectionHeader
        title="Studio Overview"
        description="Build your story foundation in order: world -> book -> version -> canon, entities, and planning."
      />
      <section className="studio-flow-note">
        <h3>Suggested setup order</h3>
        <ol>
          <li>
            <Link href="/studio/worlds">Create a world</Link> to define your
            story universe.
          </li>
          <li>
            <Link href="/studio/books">Add a book</Link> with premise and tone.
          </li>
          <li>
            <Link href="/studio/versions">Create a version</Link> so you can
            author safely in draft or test mode.
          </li>
          <li>
            Fill that version with <Link href="/studio/canon">Canon</Link>,{" "}
            <Link href="/studio/entities">Entities</Link>, and{" "}
            <Link href="/studio/planning">Planning</Link> inputs.
          </li>
        </ol>
      </section>
      <StudioOverviewPanel>
        {STUDIO_SECTIONS.map((section) => (
          <StudioSectionCard
            key={section.href}
            title={section.title}
            description={section.description}
            href={section.href}
            status={section.status}
            actionLabel={section.actionLabel}
          />
        ))}
      </StudioOverviewPanel>
    </>
  );
}
