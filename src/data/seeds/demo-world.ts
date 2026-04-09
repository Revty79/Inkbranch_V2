export const DEMO_WORLD_ID = "0f4f8db6-cfbf-4e61-bdd7-6b930f08de23";
export const DEMO_BOOK_ID = "2e86b78b-5249-40ac-ad4a-4db4a6195f2e";
export const DEMO_BOOK_VERSION_ID = "2f472891-8c09-4d6f-bc14-5f6f87ef2d21";

export const DEMO_WORLD = {
  id: DEMO_WORLD_ID,
  slug: "brinebound-meridian",
  title: "Brinebound Meridian",
  description:
    "A storm-locked harbor city where failing beacon engines and sealed ledgers turn civic duty into a fight over truth itself.",
  status: "active" as const,
  metadataJson: {
    genre: "harbor mystery",
    tags: ["secrets", "loyalty", "infrastructure"]
  }
};

export const DEMO_BOOK = {
  id: DEMO_BOOK_ID,
  worldId: DEMO_WORLD_ID,
  slug: "last-light-at-meridian-gate",
  title: "Last Light at Meridian Gate",
  premise:
    "When the Meridian beacon fails on the eve of evacuation, two investigators with opposing loyalties must decide which truths to expose before the harbor drowns in panic.",
  defaultTone: "tense-inquisitive",
  status: "active" as const,
  metadataJson: {
    audience: "demo",
    emphasis: ["reveal legality", "ending divergence", "perspective contrast"]
  }
};

export const DEMO_BOOK_VERSION = {
  id: DEMO_BOOK_VERSION_ID,
  bookId: DEMO_BOOK_ID,
  versionLabel: "demo-v1",
  status: "test" as const,
  isActive: true,
  notes:
    "Seeded demo package focused on reveal gating, milestone pressure, and planner/runtime continuity inspection."
};
