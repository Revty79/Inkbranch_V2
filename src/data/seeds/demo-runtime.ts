import { DEMO_PERSPECTIVE_IDS } from "./demo-entities";
import { DEMO_BOOK_VERSION_ID } from "./demo-world";

export const DEMO_CHRONICLE_ID = "d2b85a5a-fd5e-4208-8aa1-60162d083f26";
export const DEMO_PERSPECTIVE_RUN_IDS = {
  mira: "0cf73395-5871-4e67-b9d8-bb440eff2b8f",
  jonas: "0f6f9c2a-1672-4fde-816f-7bbfd2f97389"
} as const;

export const DEMO_CHRONICLE = {
  id: DEMO_CHRONICLE_ID,
  bookVersionId: DEMO_BOOK_VERSION_ID,
  readerId: "demo-reader",
  status: "active" as const,
  metadataJson: {
    seedProfile: "demo-v1",
    label: "Demo Chronicle - Meridian Gate"
  }
};

export const DEMO_PERSPECTIVE_RUNS = [
  {
    id: DEMO_PERSPECTIVE_RUN_IDS.mira,
    chronicleId: DEMO_CHRONICLE_ID,
    perspectiveId: DEMO_PERSPECTIVE_IDS.mira,
    status: "active" as const,
    entryCount: 0,
    knowledgeScore: 0,
    lastSceneInstanceId: null,
    metadataJson: {
      role: "primary"
    }
  },
  {
    id: DEMO_PERSPECTIVE_RUN_IDS.jonas,
    chronicleId: DEMO_CHRONICLE_ID,
    perspectiveId: DEMO_PERSPECTIVE_IDS.jonas,
    status: "paused" as const,
    entryCount: 0,
    knowledgeScore: 0,
    lastSceneInstanceId: null,
    metadataJson: {
      role: "secondary"
    }
  }
];

export const DEMO_CHRONICLE_STATE = {
  chronicleId: DEMO_CHRONICLE_ID,
  currentPerspectiveId: DEMO_PERSPECTIVE_IDS.mira,
  currentSceneInstanceId: null,
  progressIndex: 0,
  endingLocked: false,
  summaryJson: {
    completedMilestoneKeys: [],
    revealedKeys: []
  }
};
