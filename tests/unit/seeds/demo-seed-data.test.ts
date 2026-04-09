import { describe, expect, it } from "vitest";

import {
  DEMO_BOOK,
  DEMO_BOOK_VERSION,
  DEMO_CANON_ENTRIES,
  DEMO_CHARACTERS,
  DEMO_ENDING_RULES,
  DEMO_FACTIONS,
  DEMO_LOCATIONS,
  DEMO_MILESTONES,
  DEMO_PACING_RULES,
  DEMO_PERSPECTIVES,
  DEMO_REVEAL_RULES,
  DEMO_SEED_PROFILE,
  DEMO_WORLD
} from "@/data/seeds";

describe("demo seed data package", () => {
  it("defines one coherent world/book/version chain", () => {
    expect(DEMO_WORLD.slug).toBe("brinebound-meridian");
    expect(DEMO_BOOK.worldId).toBe(DEMO_WORLD.id);
    expect(DEMO_BOOK_VERSION.bookId).toBe(DEMO_BOOK.id);
    expect(DEMO_BOOK_VERSION.isActive).toBe(true);
  });

  it("includes meaningful perspective-aware entity coverage", () => {
    expect(DEMO_CHARACTERS.length).toBeGreaterThanOrEqual(5);
    expect(DEMO_LOCATIONS.length).toBeGreaterThanOrEqual(3);
    expect(DEMO_FACTIONS.length).toBeGreaterThanOrEqual(2);
    expect(DEMO_PERSPECTIVES.length).toBeGreaterThanOrEqual(2);

    const distinctPerspectiveCharacters = new Set(
      DEMO_PERSPECTIVES.map((perspective) => perspective.characterId)
    );
    expect(distinctPerspectiveCharacters.size).toBeGreaterThanOrEqual(2);
  });

  it("includes milestones, reveals, pacing, and endings for planner pressure", () => {
    expect(DEMO_MILESTONES.length).toBeGreaterThanOrEqual(4);
    expect(DEMO_REVEAL_RULES.length).toBeGreaterThanOrEqual(3);
    expect(DEMO_PACING_RULES.length).toBeGreaterThanOrEqual(2);
    expect(DEMO_ENDING_RULES.length).toBeGreaterThanOrEqual(2);

    expect(
      DEMO_REVEAL_RULES.some(
        (rule) =>
          Array.isArray(rule.gatingRulesJson.requiredMilestoneKeys) &&
          rule.gatingRulesJson.requiredMilestoneKeys.length > 0
      )
    ).toBe(true);

    expect(
      DEMO_ENDING_RULES.some(
        (rule) =>
          Array.isArray(rule.eligibilityRulesJson.requiredMilestoneKeys) &&
          rule.eligibilityRulesJson.requiredMilestoneKeys.length > 0
      )
    ).toBe(true);
  });

  it("includes hidden canon truth required for reveal gating and ending divergence", () => {
    expect(DEMO_CANON_ENTRIES.length).toBeGreaterThanOrEqual(8);
    expect(
      DEMO_CANON_ENTRIES.some((entry) => entry.visibility === "hidden")
    ).toBe(true);
    expect(
      DEMO_CANON_ENTRIES.some((entry) => entry.entryType === "ending-truth")
    ).toBe(true);
  });

  it("publishes an accurate seed profile summary", () => {
    expect(DEMO_SEED_PROFILE.characters).toBe(DEMO_CHARACTERS.length);
    expect(DEMO_SEED_PROFILE.locations).toBe(DEMO_LOCATIONS.length);
    expect(DEMO_SEED_PROFILE.factions).toBe(DEMO_FACTIONS.length);
    expect(DEMO_SEED_PROFILE.perspectives).toBe(DEMO_PERSPECTIVES.length);
    expect(DEMO_SEED_PROFILE.canonEntries).toBe(DEMO_CANON_ENTRIES.length);
    expect(DEMO_SEED_PROFILE.milestones).toBe(DEMO_MILESTONES.length);
    expect(DEMO_SEED_PROFILE.revealRules).toBe(DEMO_REVEAL_RULES.length);
    expect(DEMO_SEED_PROFILE.pacingRules).toBe(DEMO_PACING_RULES.length);
    expect(DEMO_SEED_PROFILE.endingRules).toBe(DEMO_ENDING_RULES.length);
  });
});
