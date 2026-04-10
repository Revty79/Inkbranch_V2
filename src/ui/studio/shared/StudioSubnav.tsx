"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type StudioSubnavItem = {
  readonly href: string;
  readonly label: string;
};

type StudioSubnavProps = {
  readonly items: readonly StudioSubnavItem[];
};

export function StudioSubnav({ items }: StudioSubnavProps) {
  const pathname = usePathname();

  return (
    <nav className="studio-subnav" aria-label="Section links">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={pathname === getPathname(item.href) ? "is-active" : ""}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function getPathname(href: string): string {
  const [pathname] = href.split("?");
  return pathname;
}
