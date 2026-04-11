import type { Role } from "@prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import LogoutButton from "./logout-button";

type DashboardCard = {
  key: string;
  title: string;
  subtitle: string;
  description: string;
  roles: Role[];
  styleClass: string;
  href: string;
  isLive: boolean;
};

const dashboardCards: DashboardCard[] = [
  {
    key: "bookstore",
    title: "Bookstore",
    subtitle: "Discover New Worlds",
    description:
      "Browse published story realms, read synopses, and enter an interactive experience.",
    roles: ["READER", "AUTHOR", "ADMIN"],
    styleClass: "book-card-bookstore",
    href: "/dashboard/bookstore",
    isLive: false,
  },
  {
    key: "library",
    title: "Library",
    subtitle: "Your Active Journeys",
    description:
      "Continue stories you have started, revisit branching paths, and track narrative choices.",
    roles: ["READER", "AUTHOR", "ADMIN"],
    styleClass: "book-card-library",
    href: "/dashboard/library",
    isLive: false,
  },
  {
    key: "writing-desk",
    title: "Writing Desk",
    subtitle: "Create and Shape",
    description:
      "Design worlds, define rules, and guide how AI continues each story in your universe.",
    roles: ["AUTHOR", "ADMIN"],
    styleClass: "book-card-desk",
    href: "/dashboard/writing-desk",
    isLive: true,
  },
  {
    key: "admins-office",
    title: "Admins Office",
    subtitle: "Platform Oversight",
    description:
      "Manage system-level settings, moderation tools, and platform operations.",
    roles: ["ADMIN"],
    styleClass: "book-card-admin",
    href: "/dashboard/admin-office",
    isLive: false,
  },
];

function roleLabel(role: Role): string {
  return role.charAt(0) + role.slice(1).toLowerCase();
}

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  const visibleCards = dashboardCards.filter((card) => card.roles.includes(user.role));

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="parchment-surface w-full max-w-6xl rounded-3xl p-6 shadow-2xl backdrop-blur-md md:p-10">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <p className="inline-block rounded-full border border-[var(--parchment-border)] bg-[var(--parchment-soft)] px-3 py-1 text-xs tracking-[0.18em] text-[var(--ink-muted)] uppercase">
              InkBranch Dashboard
            </p>
            <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
              Welcome{user.name ? `, ${user.name}` : ""}
            </h1>
            <p className="text-sm text-[var(--ink-muted)] md:text-base">
              Active role: <span className="font-semibold">{roleLabel(user.role)}</span>
            </p>
          </div>
          <LogoutButton />
        </header>

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {visibleCards.map((card) => (
            <Link
              key={card.key}
              href={card.href}
              className={`book-card ${card.styleClass}`}
            >
              <div>
                <p className="book-card-kicker">{card.subtitle}</p>
                <h2 className="book-card-title">{card.title}</h2>
                <p className="book-card-description">{card.description}</p>
              </div>
              <p className="book-card-status">
                {card.isLive ? "Open module" : "Coming soon"}
              </p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
