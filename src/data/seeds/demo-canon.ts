import {
  DEMO_CHARACTER_IDS,
  DEMO_FACTION_IDS,
  DEMO_LOCATION_IDS
} from "./demo-entities";
import { DEMO_ENDING_RULE_IDS } from "./demo-planning";
import { DEMO_BOOK_VERSION_ID, DEMO_WORLD_ID } from "./demo-world";

export const DEMO_CANON_ENTRIES = [
  {
    id: "2f3d9ecf-17f0-47c8-90de-e1ec57a4a510",
    bookVersionId: DEMO_BOOK_VERSION_ID,
    entryType: "world-truth",
    subjectType: "world",
    subjectId: DEMO_WORLD_ID,
    canonicalText:
      "Brinebound Meridian depends on a chained beacon network; if Meridian Gate fails, evacuation lanes collapse within two tides.",
    importance: 10,
    visibility: "public" as const,
    tagsJson: { tags: ["world", "infrastructure"] },
    metadataJson: { source: "world-bible" }
  },
  {
    id: "6d206aad-581d-4228-8317-b7620f2f4ea7",
    bookVersionId: DEMO_BOOK_VERSION_ID,
    entryType: "character-truth",
    subjectType: "character",
    subjectId: DEMO_CHARACTER_IDS.miraQuill,
    canonicalText:
      "Mira maintains unofficial evacuation overlays that reveal which districts are quietly deprioritized.",
    importance: 20,
    visibility: "public" as const,
    tagsJson: { tags: ["character", "mira"] },
    metadataJson: { source: "character-bible" }
  },
  {
    id: "4cba7f11-9c75-43ac-a6fc-7e3a36dd72db",
    bookVersionId: DEMO_BOOK_VERSION_ID,
    entryType: "character-truth",
    subjectType: "character",
    subjectId: DEMO_CHARACTER_IDS.jonasVale,
    canonicalText:
      "Jonas is sworn to the Lantern Wardens but has independent authority to investigate sabotage under emergency statutes.",
    importance: 30,
    visibility: "public" as const,
    tagsJson: { tags: ["character", "jonas"] },
    metadataJson: { source: "character-bible" }
  },
  {
    id: "dd40d073-5f98-4f73-8448-63567f65c5e7",
    bookVersionId: DEMO_BOOK_VERSION_ID,
    entryType: "faction-truth",
    subjectType: "faction",
    subjectId: DEMO_FACTION_IDS.tideCompact,
    canonicalText:
      "The Tide Compact controls barge manifests and can move whole neighborhoods faster than the council can issue orders.",
    importance: 40,
    visibility: "public" as const,
    tagsJson: { tags: ["faction", "logistics"] },
    metadataJson: { source: "faction-bible" }
  },
  {
    id: "db4f67eb-6d15-412f-9554-7448c10e59b9",
    bookVersionId: DEMO_BOOK_VERSION_ID,
    entryType: "location-truth",
    subjectType: "location",
    subjectId: DEMO_LOCATION_IDS.signalBastion,
    canonicalText:
      "Signal Bastion can override Meridian Gate output for four minutes before fail-safes trigger.",
    importance: 50,
    visibility: "restricted" as const,
    tagsJson: { tags: ["location", "signal"] },
    metadataJson: { source: "operations-archive" }
  },
  {
    id: "d741cdb9-6475-4995-a21d-eb395a3f8bcc",
    bookVersionId: DEMO_BOOK_VERSION_ID,
    entryType: "relationship-truth",
    subjectType: "character",
    subjectId: DEMO_CHARACTER_IDS.miraQuill,
    canonicalText:
      "Mira and Jonas once coordinated evacuation drills; their current split is over whether controlled concealment can ever be justified.",
    importance: 60,
    visibility: "public" as const,
    tagsJson: { tags: ["relationship", "trust"] },
    metadataJson: { source: "character-bible" }
  },
  {
    id: "1d950f52-777f-4fd5-a18f-0dc7f16f445d",
    bookVersionId: DEMO_BOOK_VERSION_ID,
    entryType: "threat-truth",
    subjectType: "faction",
    subjectId: DEMO_FACTION_IDS.regencyCouncil,
    canonicalText:
      "The Regency Council can suspend district alarms if they classify an incident as morale-sensitive.",
    importance: 70,
    visibility: "restricted" as const,
    tagsJson: { tags: ["threat", "policy"] },
    metadataJson: { source: "policy-ledger" }
  },
  {
    id: "d01713af-6f4b-4d9e-b0fc-41c75903bb09",
    bookVersionId: DEMO_BOOK_VERSION_ID,
    entryType: "hidden-truth",
    subjectType: "character",
    subjectId: DEMO_CHARACTER_IDS.ilyaVoss,
    canonicalText:
      "Regent Voss redirected copper reserves from beacon maintenance into offshore debt settlements.",
    importance: 80,
    visibility: "hidden" as const,
    tagsJson: { tags: ["hidden", "corruption"] },
    metadataJson: { revealKey: "reveal:regent-bargain" }
  },
  {
    id: "d6ae328f-4d0f-43f9-a8d4-ef4cb11382cc",
    bookVersionId: DEMO_BOOK_VERSION_ID,
    entryType: "hidden-truth",
    subjectType: "faction",
    subjectId: DEMO_FACTION_IDS.lanternWardens,
    canonicalText:
      "A Lantern Warden quartermaster authorized false beacon drills to hide missing emergency stock.",
    importance: 90,
    visibility: "hidden" as const,
    tagsJson: { tags: ["hidden", "sabotage"] },
    metadataJson: { revealKey: "reveal:false-beacon-source" }
  },
  {
    id: "ff9cdfdd-554f-4f34-9154-4d79bca94eb6",
    bookVersionId: DEMO_BOOK_VERSION_ID,
    entryType: "hidden-truth",
    subjectType: "location",
    subjectId: DEMO_LOCATION_IDS.drownedArchive,
    canonicalText:
      "The drowned archive contains a sealed ledger proving evacuee priority was sold to private creditors.",
    importance: 100,
    visibility: "hidden" as const,
    tagsJson: { tags: ["hidden", "ledger"] },
    metadataJson: { revealKey: "reveal:sealed-ledger" }
  },
  {
    id: "36a7e718-88e4-40c0-9e2a-fa78b18463be",
    bookVersionId: DEMO_BOOK_VERSION_ID,
    entryType: "ending-truth",
    subjectType: "ending",
    subjectId: DEMO_ENDING_RULE_IDS.sealedCompromise,
    canonicalText:
      "If the council bargain remains hidden, the harbor survives the storm but cedes long-term control to debt cartels.",
    importance: 110,
    visibility: "restricted" as const,
    tagsJson: { tags: ["ending", "compromise"] },
    metadataJson: { endingKey: "sealed-compromise" }
  },
  {
    id: "62a90bfe-b22e-4e96-bb0c-56773a32f4de",
    bookVersionId: DEMO_BOOK_VERSION_ID,
    entryType: "ending-truth",
    subjectType: "ending",
    subjectId: DEMO_ENDING_RULE_IDS.harborRenewal,
    canonicalText:
      "If the full bargain and sabotage chain become public before evacuation closes, reform is possible but immediate unrest is likely.",
    importance: 120,
    visibility: "restricted" as const,
    tagsJson: { tags: ["ending", "reform"] },
    metadataJson: { endingKey: "harbor-renewal" }
  }
];
