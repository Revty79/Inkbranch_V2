import {
  StudioOverviewPanel,
  StudioSectionCard,
  StudioSectionHeader
} from "@/ui/studio";

const STUDIO_SECTIONS = [
  {
    title: "Worlds",
    description:
      "Manage top-level universes that contain books and authoring context.",
    href: "/studio/worlds",
    status: "ready"
  },
  {
    title: "Books",
    description:
      "Manage books inside worlds with core premise and tone direction.",
    href: "/studio/books",
    status: "ready"
  },
  {
    title: "Versions",
    description:
      "Manage draft/test/published version anchors for authored truth.",
    href: "/studio/versions",
    status: "ready"
  },
  {
    title: "Canon",
    description:
      "Manage authored truth entries used as planner input and continuity baseline.",
    href: "/studio/canon",
    status: "ready"
  },
  {
    title: "Entities",
    description: "Manage characters, locations, factions, and perspectives.",
    href: "/studio/entities",
    status: "ready"
  },
  {
    title: "Planning",
    description:
      "Manage milestones, reveal rules, pacing rules, and ending rules.",
    href: "/studio/planning",
    status: "ready"
  }
] as const;

export default function StudioOverviewPage() {
  return (
    <>
      <StudioSectionHeader
        title="Studio Overview"
        description="Studio is the author-facing home for book-bible inputs. It does not contain planner, runtime, or generator engine logic."
      />
      <StudioOverviewPanel>
        {STUDIO_SECTIONS.map((section) => (
          <StudioSectionCard
            key={section.href}
            title={section.title}
            description={section.description}
            href={section.href}
            status={section.status}
          />
        ))}
      </StudioOverviewPanel>
    </>
  );
}
