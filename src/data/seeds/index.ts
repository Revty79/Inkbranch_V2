export * from "./demo-canon";
export * from "./demo-entities";
export * from "./demo-planning";
export * from "./demo-runtime";
export * from "./demo-world";

import { DEMO_CANON_ENTRIES } from "./demo-canon";
import {
  DEMO_CHARACTERS,
  DEMO_FACTIONS,
  DEMO_LOCATIONS,
  DEMO_PERSPECTIVES
} from "./demo-entities";
import {
  DEMO_ENDING_RULES,
  DEMO_MILESTONES,
  DEMO_PACING_RULES,
  DEMO_REVEAL_RULES
} from "./demo-planning";

export const DEMO_SEED_PROFILE = {
  characters: DEMO_CHARACTERS.length,
  locations: DEMO_LOCATIONS.length,
  factions: DEMO_FACTIONS.length,
  perspectives: DEMO_PERSPECTIVES.length,
  canonEntries: DEMO_CANON_ENTRIES.length,
  milestones: DEMO_MILESTONES.length,
  revealRules: DEMO_REVEAL_RULES.length,
  pacingRules: DEMO_PACING_RULES.length,
  endingRules: DEMO_ENDING_RULES.length
} as const;
