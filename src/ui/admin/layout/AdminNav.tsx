import Link from "next/link";

export const ADMIN_NAV_ITEMS = [
  {
    href: "/admin",
    label: "Inspector Home"
  },
  {
    href: "/admin/chronicles",
    label: "Chronicles"
  }
] as const;

export function AdminNav() {
  return (
    <nav className="admin-nav" aria-label="Admin navigation">
      {ADMIN_NAV_ITEMS.map((item) => (
        <Link key={item.href} href={item.href}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
