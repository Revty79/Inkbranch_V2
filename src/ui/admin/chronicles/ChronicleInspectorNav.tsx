import Link from "next/link";

interface ChronicleInspectorNavProps {
  readonly chronicleId: string;
}

const CHRONICLE_INSPECTOR_LINKS = [
  { suffix: "", label: "Summary" },
  { suffix: "/state", label: "State" },
  { suffix: "/scenes", label: "Scenes" },
  { suffix: "/events", label: "Events" },
  { suffix: "/knowledge", label: "Knowledge" },
  { suffix: "/commits", label: "Commits" },
  { suffix: "/generation", label: "Generation" }
] as const;

export function ChronicleInspectorNav({
  chronicleId
}: ChronicleInspectorNavProps) {
  const basePath = `/admin/chronicles/${chronicleId}`;

  return (
    <nav
      className="admin-inline-nav"
      aria-label="Chronicle inspector navigation"
    >
      {CHRONICLE_INSPECTOR_LINKS.map((link) => (
        <Link key={link.suffix || "summary"} href={`${basePath}${link.suffix}`}>
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
