import Link from "next/link";

type StudioNavItem = {
  readonly href: string;
  readonly label: string;
};

export const STUDIO_NAV_ITEMS: StudioNavItem[] = [
  { href: "/studio", label: "Overview" },
  { href: "/studio/worlds", label: "Worlds" },
  { href: "/studio/books", label: "Books" },
  { href: "/studio/versions", label: "Versions" },
  { href: "/studio/canon", label: "Canon" },
  { href: "/studio/entities", label: "Entities" },
  { href: "/studio/planning", label: "Planning" }
];

export function StudioNav() {
  return (
    <nav className="studio-nav" aria-label="Studio sections">
      {STUDIO_NAV_ITEMS.map((item) => (
        <Link key={item.href} href={item.href}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
