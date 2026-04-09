import {
  DEMO_CHARACTER_IDS,
  DEMO_FACTION_IDS,
  DEMO_LOCATION_IDS
} from "./demo-entities";
import { DEMO_BOOK_VERSION_ID } from "./demo-world";

export const DEMO_MILESTONES = [
  {
    id: "6cdb9fd4-3f63-4930-8f1a-ebf739704fd7",
    bookVersionId: DEMO_BOOK_VERSION_ID,
    arcKey: "stability",
    milestoneKey: "secure-evacuation-ledgers",
    title: "Secure Evacuation Ledgers",
    description:
      "Obtain trustworthy manifests so evacuation routes can be validated.",
    priority: 100,
    required: true,
    sequenceHint: 0,
    eligibilityRulesJson: {},
    completionRulesJson: {
      commitKey: "milestone:secure-evacuation-ledgers"
    }
  },
  {
    id: "9474a5bb-76e6-44e8-92c5-7e4559662d03",
    bookVersionId: DEMO_BOOK_VERSION_ID,
    arcKey: "truth",
    milestoneKey: "identify-false-beacon-source",
    title: "Identify False Beacon Source",
    description:
      "Confirm where and by whom false beacon drills are being triggered.",
    priority: 90,
    required: true,
    sequenceHint: 1,
    eligibilityRulesJson: {
      requiredMilestoneKeys: ["secure-evacuation-ledgers"]
    },
    completionRulesJson: {
      commitKey: "milestone:identify-false-beacon-source"
    }
  },
  {
    id: "1ab565a3-7eeb-46ec-9e2b-f407868d8cc7",
    bookVersionId: DEMO_BOOK_VERSION_ID,
    arcKey: "truth",
    milestoneKey: "recover-abbey-ledger",
    title: "Recover Abbey Ledger",
    description:
      "Retrieve the drowned archive ledger that links policy decisions to debt contracts.",
    priority: 80,
    required: false,
    sequenceHint: 2,
    eligibilityRulesJson: {
      requiredMilestoneKeys: ["secure-evacuation-ledgers"]
    },
    completionRulesJson: {
      commitKey: "milestone:recover-abbey-ledger"
    }
  },
  {
    id: "81b6f615-d991-41a2-82dd-cf0c59e8c48f",
    bookVersionId: DEMO_BOOK_VERSION_ID,
    arcKey: "stability",
    milestoneKey: "stabilize-signal-bastion",
    title: "Stabilize Signal Bastion",
    description:
      "Prevent further false beacon pulses so evacuation lanes remain coherent.",
    priority: 85,
    required: true,
    sequenceHint: 3,
    eligibilityRulesJson: {
      requiredMilestoneKeys: ["identify-false-beacon-source"]
    },
    completionRulesJson: {
      commitKey: "milestone:stabilize-signal-bastion"
    }
  },
  {
    id: "5af09d39-a641-4bc3-8a8b-a4d944fce073",
    bookVersionId: DEMO_BOOK_VERSION_ID,
    arcKey: "endgame",
    milestoneKey: "expose-council-bargain",
    title: "Expose Council Bargain",
    description:
      "Assemble evidence proving the regency sold evacuation priority.",
    priority: 70,
    required: false,
    sequenceHint: 4,
    eligibilityRulesJson: {
      requiredMilestoneKeys: [
        "identify-false-beacon-source",
        "recover-abbey-ledger"
      ]
    },
    completionRulesJson: {
      commitKey: "milestone:expose-council-bargain"
    }
  },
  {
    id: "d2eebf90-d0f6-48c4-8e4c-3dcf31c0383f",
    bookVersionId: DEMO_BOOK_VERSION_ID,
    arcKey: "endgame",
    milestoneKey: "choose-harbor-fate",
    title: "Choose Harbor Fate",
    description:
      "Commit to either immediate public truth or controlled concealment before final evacuation.",
    priority: 95,
    required: true,
    sequenceHint: 5,
    eligibilityRulesJson: {
      requiredMilestoneKeys: ["stabilize-signal-bastion"]
    },
    completionRulesJson: {
      commitKey: "milestone:choose-harbor-fate"
    }
  }
];

export const DEMO_REVEAL_RULES = [
  {
    id: "6453d973-daee-4827-89cf-5949e674b2e0",
    bookVersionId: DEMO_BOOK_VERSION_ID,
    revealKey: "reveal:sealed-ledger",
    subjectType: "location",
    subjectId: DEMO_LOCATION_IDS.drownedArchive,
    gatingRulesJson: {
      requiredMilestoneKeys: ["secure-evacuation-ledgers"]
    },
    exposureEffectsJson: {
      knowledgeKey: "reveal:sealed-ledger",
      canonCommitKey: "reveal:sealed-ledger"
    }
  },
  {
    id: "8cb45f29-b25b-412e-ac3e-fba785243342",
    bookVersionId: DEMO_BOOK_VERSION_ID,
    revealKey: "reveal:false-beacon-source",
    subjectType: "faction",
    subjectId: DEMO_FACTION_IDS.lanternWardens,
    gatingRulesJson: {
      requiredMilestoneKeys: ["identify-false-beacon-source"]
    },
    exposureEffectsJson: {
      knowledgeKey: "reveal:false-beacon-source",
      canonCommitKey: "reveal:false-beacon-source"
    }
  },
  {
    id: "83ca3cd6-98cd-4c5f-8158-4e77ef97c830",
    bookVersionId: DEMO_BOOK_VERSION_ID,
    revealKey: "reveal:regent-bargain",
    subjectType: "character",
    subjectId: DEMO_CHARACTER_IDS.ilyaVoss,
    gatingRulesJson: {
      requiredMilestoneKeys: [
        "identify-false-beacon-source",
        "recover-abbey-ledger"
      ]
    },
    exposureEffectsJson: {
      knowledgeKey: "reveal:regent-bargain",
      canonCommitKey: "reveal:regent-bargain"
    }
  },
  {
    id: "8f980c5f-c8ef-4717-9ad6-a042d9581222",
    bookVersionId: DEMO_BOOK_VERSION_ID,
    revealKey: "reveal:compact-deal",
    subjectType: "faction",
    subjectId: DEMO_FACTION_IDS.tideCompact,
    gatingRulesJson: {
      requiredMilestoneKeys: ["expose-council-bargain"]
    },
    exposureEffectsJson: {
      knowledgeKey: "reveal:compact-deal",
      canonCommitKey: "reveal:compact-deal"
    }
  }
];

export const DEMO_PACING_RULES = [
  {
    id: "dbb44ce9-0078-4747-a6ca-b1237f33c4e1",
    bookVersionId: DEMO_BOOK_VERSION_ID,
    scope: "chronicle",
    ruleType: "avoid-reveal-clustering",
    ruleConfigJson: {
      pressureLevel: ["moderate"],
      targetWindowScenes: 2,
      maxMajorRevealsInWindow: 1
    }
  },
  {
    id: "f5f6d4cb-5da6-456f-a14c-d27167a44797",
    bookVersionId: DEMO_BOOK_VERSION_ID,
    scope: "stability-arc",
    ruleType: "escalate-after-first-cycle",
    ruleConfigJson: {
      pressureLevel: ["high"],
      targetWindowScenes: 3,
      triggerAfterProgressIndex: 1
    }
  },
  {
    id: "d37b47cb-c95c-43eb-ae97-a5c713ad4cca",
    bookVersionId: DEMO_BOOK_VERSION_ID,
    scope: "ending-window",
    ruleType: "delay-ending-before-readiness",
    ruleConfigJson: {
      pressureLevel: ["critical"],
      minSceneCountForEnding: 4
    }
  },
  {
    id: "3154b10a-b3cf-4a91-b857-29e4f74f5f4f",
    bookVersionId: DEMO_BOOK_VERSION_ID,
    scope: "perspective:jonas-watchman",
    ruleType: "force-consequence-after-public-reveal",
    ruleConfigJson: {
      pressureLevel: ["high"],
      targetWindowScenes: 2,
      followupSceneKind: "consequence"
    }
  }
];

export const DEMO_ENDING_RULE_IDS = {
  harborRenewal: "20ccd4f7-95f5-4f4b-8ba8-4fd5e7513577",
  sealedCompromise: "9f7b3dbb-2d9f-4437-a4db-34618a67f217",
  blackwaterFall: "6aa13f28-ad65-40bd-a044-818ad6be3595"
} as const;

export const DEMO_ENDING_RULES = [
  {
    id: DEMO_ENDING_RULE_IDS.harborRenewal,
    bookVersionId: DEMO_BOOK_VERSION_ID,
    endingKey: "harbor-renewal",
    title: "Harbor Renewal",
    endingType: "positive",
    eligibilityRulesJson: {
      requiredMilestoneKeys: ["choose-harbor-fate", "expose-council-bargain"],
      requiredRevealKeys: ["reveal:regent-bargain"]
    },
    priorityRulesJson: {
      priority: 100
    },
    resolutionTemplateJson: {
      tone: "hard-won-hope",
      outcome: "Public truth triggers reform and shared governance."
    }
  },
  {
    id: DEMO_ENDING_RULE_IDS.sealedCompromise,
    bookVersionId: DEMO_BOOK_VERSION_ID,
    endingKey: "sealed-compromise",
    title: "Sealed Compromise",
    endingType: "bittersweet",
    eligibilityRulesJson: {
      requiredMilestoneKeys: ["choose-harbor-fate", "stabilize-signal-bastion"],
      requiredRevealKeys: ["reveal:false-beacon-source"]
    },
    priorityRulesJson: {
      priority: 70
    },
    resolutionTemplateJson: {
      tone: "somber-stability",
      outcome:
        "The harbor survives, but political debt hardens into long-term control."
    }
  },
  {
    id: DEMO_ENDING_RULE_IDS.blackwaterFall,
    bookVersionId: DEMO_BOOK_VERSION_ID,
    endingKey: "blackwater-fall",
    title: "Blackwater Fall",
    endingType: "negative",
    eligibilityRulesJson: {
      requiredMilestoneKeys: ["stabilize-signal-bastion"],
      requiredRevealKeys: []
    },
    priorityRulesJson: {
      priority: 40
    },
    resolutionTemplateJson: {
      tone: "tragic-collapse",
      outcome:
        "Signal failure and withheld truth fracture evacuation and sink whole districts."
    }
  }
];
