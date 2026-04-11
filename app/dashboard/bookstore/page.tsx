import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";

export default async function BookstorePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="parchment-surface w-full max-w-4xl rounded-3xl p-8 shadow-2xl backdrop-blur-md">
        <p className="inline-block rounded-full border border-[var(--parchment-border)] bg-[var(--parchment-soft)] px-3 py-1 text-xs tracking-[0.18em] text-[var(--ink-muted)] uppercase">
          Bookstore
        </p>
        <h1 className="mt-4 text-3xl font-semibold">Published Works Marketplace</h1>
        <p className="mt-3 max-w-2xl text-sm text-[var(--ink-muted)] md:text-base">
          This is where published worlds will be listed for purchase and access. Next
          step is wiring listings to story publication and purchase entitlements.
        </p>
      </div>
    </main>
  );
}
