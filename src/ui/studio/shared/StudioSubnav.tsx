import Link from "next/link";

type StudioSubnavItem = {
  readonly href: string;
  readonly label: string;
};

type StudioSubnavProps = {
  readonly items: readonly StudioSubnavItem[];
};

export function StudioSubnav({ items }: StudioSubnavProps) {
  return (
    <nav className="studio-subnav" aria-label="Section links">
      {items.map((item) => (
        <Link key={item.href} href={item.href}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
