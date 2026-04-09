import Link from "next/link";

import { APP_TITLE, CORE_LOOP, PLATFORM_POSTURE } from "@/lib/constants";

const ROUTES = [
  { href: "/reader", label: "Reader" },
  { href: "/studio", label: "Studio" },
  { href: "/admin", label: "Admin" }
] as const;

export default function HomePage() {
  return (
    <main className="page-shell">
      <h1>{APP_TITLE}</h1>
      <p>{PLATFORM_POSTURE}</p>
      <p>Core loop: {CORE_LOOP.join(" -> ")}</p>
      <nav className="route-nav" aria-label="Primary surfaces">
        {ROUTES.map((route) => (
          <Link key={route.href} href={route.href}>
            {route.label}
          </Link>
        ))}
      </nav>
    </main>
  );
}
