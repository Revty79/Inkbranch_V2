"use client";

import { FormEvent, useMemo, useState } from "react";

type StoryStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

type DeskStory = {
  id: string;
  title: string;
  slug: string;
  status: StoryStatus;
  updatedAt: string;
  spineVersionCount: number;
};

type Message = {
  type: "success" | "error";
  text: string;
};

type Props = {
  initialStories: DeskStory[];
};

function statusLabel(status: StoryStatus) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function relativeDate(value: string): string {
  const date = new Date(value);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default function WritingDeskClient({ initialStories }: Props) {
  const [stories, setStories] = useState<DeskStory[]>(initialStories);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [arcStatement, setArcStatement] = useState("");
  const [toneGuide, setToneGuide] = useState("");
  const [narrativeBoundaries, setNarrativeBoundaries] = useState("");
  const [guardrailInstruction, setGuardrailInstruction] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  const sortedStories = useMemo(
    () => [...stories].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [stories],
  );

  async function handleCreateStory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/author/stories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          slug,
          synopsis,
          arcStatement,
          toneGuide,
          narrativeBoundaries,
          guardrailInstruction,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { story?: DeskStory; error?: string }
        | null;

      if (!response.ok || !payload?.story) {
        throw new Error(payload?.error ?? "Could not create story draft.");
      }

      const createdStory = payload.story;
      setStories((current) => [createdStory, ...current]);
      setTitle("");
      setSlug("");
      setSynopsis("");
      setArcStatement("");
      setToneGuide("");
      setNarrativeBoundaries("");
      setGuardrailInstruction("");
      setMessage({
        type: "success",
        text: `Created draft \"${createdStory.title}\" with spine version 1.`,
      });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Could not create story draft.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="parchment-surface w-full max-w-6xl rounded-3xl p-6 shadow-2xl backdrop-blur-md md:p-10">
        <header className="mb-8 space-y-3">
          <p className="inline-block rounded-full border border-[var(--parchment-border)] bg-[var(--parchment-soft)] px-3 py-1 text-xs tracking-[0.18em] text-[var(--ink-muted)] uppercase">
            Writing Desk
          </p>
          <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
            Authoring Tools (Core Spine First)
          </h1>
          <p className="max-w-3xl text-sm text-[var(--ink-muted)] md:text-base">
            Create a draft story and define its narrative spine. This gives us
            the fixed author truth we need before expanding reader-side runtime
            tools.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="parchment-card rounded-2xl p-5 shadow-lg">
            <h2 className="text-xl font-semibold">Create New Story Draft</h2>
            <form className="mt-4 space-y-3" onSubmit={handleCreateStory}>
              <label className="parchment-label block text-sm font-medium">
                Story Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="The Last Ember Road"
                className="parchment-input w-full rounded-lg px-3 py-2 text-sm outline-none"
                maxLength={120}
                required
              />

              <label className="parchment-label block text-sm font-medium">
                Slug (optional)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
                placeholder="the-last-ember-road"
                className="parchment-input w-full rounded-lg px-3 py-2 text-sm outline-none"
                maxLength={80}
              />

              <label className="parchment-label block text-sm font-medium">
                Synopsis
              </label>
              <textarea
                value={synopsis}
                onChange={(event) => setSynopsis(event.target.value)}
                placeholder="What is this story about at a high level?"
                className="parchment-input min-h-[88px] w-full rounded-lg px-3 py-2 text-sm outline-none"
                maxLength={3000}
              />

              <label className="parchment-label block text-sm font-medium">
                Arc Statement (core)
              </label>
              <textarea
                value={arcStatement}
                onChange={(event) => setArcStatement(event.target.value)}
                placeholder="What major arc must hold true from beginning to end?"
                className="parchment-input min-h-[80px] w-full rounded-lg px-3 py-2 text-sm outline-none"
                maxLength={3000}
              />

              <label className="parchment-label block text-sm font-medium">
                Tone Guide
              </label>
              <textarea
                value={toneGuide}
                onChange={(event) => setToneGuide(event.target.value)}
                placeholder="Voice, genre tone, emotional shape, and language style"
                className="parchment-input min-h-[80px] w-full rounded-lg px-3 py-2 text-sm outline-none"
                maxLength={3000}
              />

              <label className="parchment-label block text-sm font-medium">
                Narrative Boundaries
              </label>
              <textarea
                value={narrativeBoundaries}
                onChange={(event) => setNarrativeBoundaries(event.target.value)}
                placeholder="What readers can influence vs what must remain fixed"
                className="parchment-input min-h-[80px] w-full rounded-lg px-3 py-2 text-sm outline-none"
                maxLength={3000}
              />

              <label className="parchment-label block text-sm font-medium">
                Guardrail Instruction
              </label>
              <textarea
                value={guardrailInstruction}
                onChange={(event) => setGuardrailInstruction(event.target.value)}
                placeholder="When reader input conflicts, bend/redirect while preserving required outcomes"
                className="parchment-input min-h-[80px] w-full rounded-lg px-3 py-2 text-sm outline-none"
                maxLength={3000}
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="parchment-button mt-2 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Creating Draft..." : "Create Story Draft"}
              </button>
            </form>

            {message ? (
              <p
                className={`mt-4 rounded-lg border px-3 py-2 text-sm ${
                  message.type === "success"
                    ? "border-emerald-700/40 bg-emerald-100/70 text-emerald-900"
                    : "border-rose-700/40 bg-rose-100/75 text-rose-900"
                }`}
              >
                {message.text}
              </p>
            ) : null}
          </section>

          <section className="parchment-card rounded-2xl p-5 shadow-lg">
            <h2 className="text-xl font-semibold">Your Story Drafts</h2>
            <p className="mt-2 text-sm text-[var(--ink-muted)]">
              Start from spine first. Later we will add required events, canon
              rules, and character truths editor tools.
            </p>

            <div className="mt-4 space-y-3">
              {sortedStories.length === 0 ? (
                <p className="rounded-lg border border-[var(--parchment-border)] bg-[var(--parchment-soft)] px-3 py-3 text-sm text-[var(--ink-muted)]">
                  No drafts yet. Create your first story above.
                </p>
              ) : (
                sortedStories.map((story) => (
                  <article
                    key={story.id}
                    className="rounded-lg border border-[var(--parchment-border)] bg-[var(--parchment-soft)] px-3 py-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold">{story.title}</h3>
                        <p className="mt-1 text-xs text-[var(--ink-muted)]">
                          /{story.slug}
                        </p>
                      </div>
                      <span className="rounded-full border border-[var(--parchment-border)] bg-white/40 px-2 py-0.5 text-xs text-[var(--ink-muted)]">
                        {statusLabel(story.status)}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-[var(--ink-muted)]">
                      Spine Versions: {story.spineVersionCount} | Updated{" "}
                      {relativeDate(story.updatedAt)}
                    </p>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
