"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type StudioNavItem = {
  readonly href: string;
  readonly label: string;
};

export const STUDIO_NAV_ITEMS: StudioNavItem[] = [
  { href: "/studio", label: "Studio Home" },
  { href: "/studio/worlds", label: "Worlds" },
  { href: "/studio/books", label: "Books" },
  { href: "/studio/versions", label: "Versions" },
  { href: "/studio/canon", label: "Canon" },
  { href: "/studio/entities", label: "Entities" },
  { href: "/studio/planning", label: "Planning" }
];

export function StudioNav() {
  const pathname = usePathname();

  return (
    <nav className="studio-nav" aria-label="Studio sections">
      {STUDIO_NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={isStudioNavItemActive(pathname, item.href) ? "is-active" : ""}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function isStudioNavItemActive(pathname: string, href: string): boolean {
  if (href === "/studio") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
