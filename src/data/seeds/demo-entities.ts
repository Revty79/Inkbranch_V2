import { DEMO_BOOK_VERSION_ID } from "./demo-world";

export const DEMO_CHARACTER_IDS = {
  miraQuill: "ce2d84e1-a6d0-4de8-b7e3-3f6f7f6765c8",
  jonasVale: "63ac18bd-e01c-4e89-b8f2-9cad9cb8fe1a",
  elowenKade: "f65e3b6f-7e83-4e3f-98c7-95aa73792539",
  rafeDain: "fcf3ba56-95ab-48f0-ad16-bf7f66f9240e",
  ilyaVoss: "11398d76-6d5b-4d42-a1f1-91ea54f7d3fc"
} as const;

export const DEMO_LOCATION_IDS = {
  meridianGate: "fe89343f-b393-4307-afaf-c43f7dabedfd",
  drownedArchive: "8bd7c04b-329e-4f06-a132-c56cd2b53cb4",
  signalBastion: "f95c9196-cdfd-4cf7-824f-166e5f247e4b",
  tideMarket: "11ce2e86-fb63-4a4d-a52f-3d87f4cedeb2"
} as const;

export const DEMO_FACTION_IDS = {
  lanternWardens: "84180f38-4278-4558-a6c3-d48b6101983e",
  tideCompact: "f4de2110-f05a-4cbf-9373-3fca2e922313",
  regencyCouncil: "c42bc225-74ec-4990-b9d6-02ac942810f5"
} as const;

export const DEMO_PERSPECTIVE_IDS = {
  mira: "513d0dca-9f8e-47ac-b8d2-0a6f0c0f6654",
  jonas: "216912eb-8ad9-4fec-badf-df46408dfabf"
} as const;

export const DEMO_CHARACTERS = [
  {
    id: DEMO_CHARACTER_IDS.miraQuill,
    bookVersionId: DEMO_BOOK_VERSION_ID,
    slug: "mira-quill",
    name: "Mira Quill",
    summary:
      "A harbor cartographer who tracks evacuation routes and sees patterns in what officials refuse to map.",
    status: "active" as const,
    metadataJson: {
      role: "primary-investigator",
      loyalties: ["civilians", "archive-truth"]
    }
  },
  {
    id: DEMO_CHARACTER_IDS.jonasVale,
    bookVersionId: DEMO_BOOK_VERSION_ID,
    slug: "jonas-vale",
    name: "Jonas Vale",
    summary:
      "A civic investigator tied to the Lantern Wardens, tasked with keeping order while quietly hunting sabotage.",
    status: "active" as const,
    metadataJson: {
      role: "secondary-investigator",
      loyalties: ["wardens", "public-order"]
    }
  },
  {
    id: DEMO_CHARACTER_IDS.elowenKade,
    bookVersionId: DEMO_BOOK_VERSION_ID,
    slug: "mother-elowen-kade",
    name: "Mother Elowen Kade",
    summary:
      "Archivist of the drowned abbey vaults and keeper of forbidden storm ledgers.",
    status: "active" as const,
    metadataJson: {
      role: "truth-keeper"
    }
  },
  {
    id: DEMO_CHARACTER_IDS.rafeDain,
    bookVersionId: DEMO_BOOK_VERSION_ID,
    slug: "rafe-dain",
    name: "Rafe Dain",
    summary:
      "Dock union foreman caught between protecting workers and exposing who diverted rescue materials.",
    status: "active" as const,
    metadataJson: {
      role: "labor-leader"
    }
  },
  {
    id: DEMO_CHARACTER_IDS.ilyaVoss,
    bookVersionId: DEMO_BOOK_VERSION_ID,
    slug: "regent-ilya-voss",
    name: "Regent Ilya Voss",
    summary:
      "Council regent directing evacuation policy while hiding the political costs of beacon failure.",
    status: "active" as const,
    metadataJson: {
      role: "political-antagonist"
    }
  }
];

export const DEMO_LOCATIONS = [
  {
    id: DEMO_LOCATION_IDS.meridianGate,
    bookVersionId: DEMO_BOOK_VERSION_ID,
    slug: "meridian-gate",
    name: "Meridian Gate",
    summary:
      "The central storm beacon where evacuation routes are signaled across the harbor tiers.",
    status: "active" as const,
    metadataJson: {
      role: "start"
    }
  },
  {
    id: DEMO_LOCATION_IDS.drownedArchive,
    bookVersionId: DEMO_BOOK_VERSION_ID,
    slug: "drowned-archive",
    name: "Drowned Archive",
    summary:
      "Flooded vault beneath the old abbey that stores sealed shipping manifests and debt ledgers.",
    status: "active" as const,
    metadataJson: {
      role: "reveal-site"
    }
  },
  {
    id: DEMO_LOCATION_IDS.signalBastion,
    bookVersionId: DEMO_BOOK_VERSION_ID,
    slug: "signal-bastion",
    name: "Signal Bastion",
    summary:
      "A pressure-heavy relay tower where false beacon signals can trigger harbor-wide panic.",
    status: "active" as const,
    metadataJson: {
      role: "escalation-site"
    }
  },
  {
    id: DEMO_LOCATION_IDS.tideMarket,
    bookVersionId: DEMO_BOOK_VERSION_ID,
    slug: "tide-market",
    name: "Tide Market",
    summary:
      "A crowded market district where evacuee rumors spread faster than official orders.",
    status: "active" as const,
    metadataJson: {
      role: "pressure-surface"
    }
  }
];

export const DEMO_FACTIONS = [
  {
    id: DEMO_FACTION_IDS.lanternWardens,
    bookVersionId: DEMO_BOOK_VERSION_ID,
    slug: "lantern-wardens",
    name: "Lantern Wardens",
    summary:
      "Signal engineers and patrol officers responsible for beacon integrity and crowd control.",
    status: "active" as const,
    metadataJson: {
      alignment: "official"
    }
  },
  {
    id: DEMO_FACTION_IDS.tideCompact,
    bookVersionId: DEMO_BOOK_VERSION_ID,
    slug: "tide-compact",
    name: "Tide Compact",
    summary:
      "Dock guild alliance managing labor, supply contracts, and evacuation transport manifests.",
    status: "active" as const,
    metadataJson: {
      alignment: "civic-labor"
    }
  },
  {
    id: DEMO_FACTION_IDS.regencyCouncil,
    bookVersionId: DEMO_BOOK_VERSION_ID,
    slug: "regency-council",
    name: "Regency Council",
    summary:
      "Emergency governing body balancing public calm against politically costly truths.",
    status: "active" as const,
    metadataJson: {
      alignment: "political"
    }
  }
];

export const DEMO_PERSPECTIVES = [
  {
    id: DEMO_PERSPECTIVE_IDS.mira,
    bookVersionId: DEMO_BOOK_VERSION_ID,
    characterId: DEMO_CHARACTER_IDS.miraQuill,
    slug: "mira-mapmaker",
    name: "Mira Mapmaker",
    summary:
      "Prioritizes civilian safety and pattern recognition, with low trust in official narratives.",
    voiceGuide:
      "Observational, precise, and empathetic. Notices logistics details and hidden patterns before political motives.",
    knowledgeBaselineJson: {
      knownKeys: ["route:evacuation-grid", "faction:tide-compact"],
      assumptions: ["The beacon failure was engineered, not accidental."]
    },
    eligibilityRulesJson: {
      preferredArcKeys: ["stability", "truth"],
      revealSensitivity: "high"
    },
    status: "active" as const
  },
  {
    id: DEMO_PERSPECTIVE_IDS.jonas,
    bookVersionId: DEMO_BOOK_VERSION_ID,
    characterId: DEMO_CHARACTER_IDS.jonasVale,
    slug: "jonas-watchman",
    name: "Jonas Watchman",
    summary:
      "Prioritizes order and procedural evidence, with high exposure to Warden command pressure.",
    voiceGuide:
      "Measured, procedural, and skeptical. Tracks accountability chains and the cost of public disorder.",
    knowledgeBaselineJson: {
      knownKeys: ["faction:lantern-wardens", "location:signal-bastion"],
      assumptions: [
        "A public panic could kill more people than a delayed truth."
      ]
    },
    eligibilityRulesJson: {
      preferredArcKeys: ["stability", "endgame"],
      revealSensitivity: "moderate"
    },
    status: "active" as const
  }
];
