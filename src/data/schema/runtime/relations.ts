import { relations } from "drizzle-orm";

import { bookVersions } from "../authoring/books";
import { canonEntries } from "../authoring/canon";
import { perspectives } from "../authoring/entities";
import { chronicles, perspectiveRuns } from "./chronicles";
import { eventLog } from "./events";
import { choiceResolutions, sceneChoices, sceneInstances } from "./scenes";
import { canonCommits, chronicleStates, knowledgeState } from "./state";

export const bookVersionsRuntimeRelations = relations(
  bookVersions,
  ({ many }) => ({
    chronicles: many(chronicles)
  })
);

export const chroniclesRelations = relations(chronicles, ({ one, many }) => ({
  bookVersion: one(bookVersions, {
    fields: [chronicles.bookVersionId],
    references: [bookVersions.id]
  }),
  chronicleState: one(chronicleStates),
  perspectiveRuns: many(perspectiveRuns),
  sceneInstances: many(sceneInstances),
  choiceResolutions: many(choiceResolutions),
  knowledgeState: many(knowledgeState),
  eventLog: many(eventLog),
  canonCommits: many(canonCommits)
}));

export const chronicleStatesRelations = relations(
  chronicleStates,
  ({ one }) => ({
    chronicle: one(chronicles, {
      fields: [chronicleStates.chronicleId],
      references: [chronicles.id]
    }),
    currentPerspective: one(perspectives, {
      fields: [chronicleStates.currentPerspectiveId],
      references: [perspectives.id]
    }),
    currentSceneInstance: one(sceneInstances, {
      fields: [chronicleStates.currentSceneInstanceId],
      references: [sceneInstances.id]
    })
  })
);

export const perspectiveRunsRelations = relations(
  perspectiveRuns,
  ({ one, many }) => ({
    chronicle: one(chronicles, {
      fields: [perspectiveRuns.chronicleId],
      references: [chronicles.id]
    }),
    perspective: one(perspectives, {
      fields: [perspectiveRuns.perspectiveId],
      references: [perspectives.id]
    }),
    sceneInstances: many(sceneInstances)
  })
);

export const sceneInstancesRelations = relations(
  sceneInstances,
  ({ one, many }) => ({
    chronicle: one(chronicles, {
      fields: [sceneInstances.chronicleId],
      references: [chronicles.id]
    }),
    perspectiveRun: one(perspectiveRuns, {
      fields: [sceneInstances.perspectiveRunId],
      references: [perspectiveRuns.id]
    }),
    sceneChoices: many(sceneChoices),
    knowledgeEntries: many(knowledgeState)
  })
);

export const sceneChoicesRelations = relations(
  sceneChoices,
  ({ one, many }) => ({
    sceneInstance: one(sceneInstances, {
      fields: [sceneChoices.sceneInstanceId],
      references: [sceneInstances.id]
    }),
    resolutions: many(choiceResolutions)
  })
);

export const choiceResolutionsRelations = relations(
  choiceResolutions,
  ({ one }) => ({
    sceneChoice: one(sceneChoices, {
      fields: [choiceResolutions.sceneChoiceId],
      references: [sceneChoices.id]
    }),
    chronicle: one(chronicles, {
      fields: [choiceResolutions.chronicleId],
      references: [chronicles.id]
    })
  })
);

export const knowledgeStateRelations = relations(knowledgeState, ({ one }) => ({
  chronicle: one(chronicles, {
    fields: [knowledgeState.chronicleId],
    references: [chronicles.id]
  }),
  perspective: one(perspectives, {
    fields: [knowledgeState.perspectiveId],
    references: [perspectives.id]
  }),
  sourceSceneInstance: one(sceneInstances, {
    fields: [knowledgeState.sourceSceneInstanceId],
    references: [sceneInstances.id]
  })
}));

export const eventLogRelations = relations(eventLog, ({ one, many }) => ({
  chronicle: one(chronicles, {
    fields: [eventLog.chronicleId],
    references: [chronicles.id]
  }),
  canonCommits: many(canonCommits)
}));

export const canonEntriesRuntimeRelations = relations(
  canonEntries,
  ({ many }) => ({
    canonCommits: many(canonCommits)
  })
);

export const canonCommitsRelations = relations(canonCommits, ({ one }) => ({
  chronicle: one(chronicles, {
    fields: [canonCommits.chronicleId],
    references: [chronicles.id]
  }),
  canonEntry: one(canonEntries, {
    fields: [canonCommits.canonEntryId],
    references: [canonEntries.id]
  }),
  sourceEvent: one(eventLog, {
    fields: [canonCommits.sourceEventId],
    references: [eventLog.id]
  })
}));
