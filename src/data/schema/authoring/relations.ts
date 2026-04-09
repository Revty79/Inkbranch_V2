import { relations } from "drizzle-orm";

import { bookVersions, books } from "./books";
import { canonEntries } from "./canon";
import { characters, factions, locations, perspectives } from "./entities";
import {
  arcMilestones,
  endingRules,
  pacingRules,
  revealRules
} from "./planning-rules";
import { worlds } from "./worlds";

export const worldsRelations = relations(worlds, ({ many }) => ({
  books: many(books)
}));

export const booksRelations = relations(books, ({ one, many }) => ({
  world: one(worlds, {
    fields: [books.worldId],
    references: [worlds.id]
  }),
  versions: many(bookVersions)
}));

export const bookVersionsRelations = relations(
  bookVersions,
  ({ one, many }) => ({
    book: one(books, {
      fields: [bookVersions.bookId],
      references: [books.id]
    }),
    canonEntries: many(canonEntries),
    characters: many(characters),
    locations: many(locations),
    factions: many(factions),
    perspectives: many(perspectives),
    arcMilestones: many(arcMilestones),
    revealRules: many(revealRules),
    pacingRules: many(pacingRules),
    endingRules: many(endingRules)
  })
);

export const canonEntriesRelations = relations(canonEntries, ({ one }) => ({
  bookVersion: one(bookVersions, {
    fields: [canonEntries.bookVersionId],
    references: [bookVersions.id]
  })
}));

export const charactersRelations = relations(characters, ({ one, many }) => ({
  bookVersion: one(bookVersions, {
    fields: [characters.bookVersionId],
    references: [bookVersions.id]
  }),
  perspectives: many(perspectives)
}));

export const locationsRelations = relations(locations, ({ one }) => ({
  bookVersion: one(bookVersions, {
    fields: [locations.bookVersionId],
    references: [bookVersions.id]
  })
}));

export const factionsRelations = relations(factions, ({ one }) => ({
  bookVersion: one(bookVersions, {
    fields: [factions.bookVersionId],
    references: [bookVersions.id]
  })
}));

export const perspectivesRelations = relations(perspectives, ({ one }) => ({
  bookVersion: one(bookVersions, {
    fields: [perspectives.bookVersionId],
    references: [bookVersions.id]
  }),
  character: one(characters, {
    fields: [perspectives.characterId],
    references: [characters.id]
  })
}));

export const arcMilestonesRelations = relations(arcMilestones, ({ one }) => ({
  bookVersion: one(bookVersions, {
    fields: [arcMilestones.bookVersionId],
    references: [bookVersions.id]
  })
}));

export const revealRulesRelations = relations(revealRules, ({ one }) => ({
  bookVersion: one(bookVersions, {
    fields: [revealRules.bookVersionId],
    references: [bookVersions.id]
  })
}));

export const pacingRulesRelations = relations(pacingRules, ({ one }) => ({
  bookVersion: one(bookVersions, {
    fields: [pacingRules.bookVersionId],
    references: [bookVersions.id]
  })
}));

export const endingRulesRelations = relations(endingRules, ({ one }) => ({
  bookVersion: one(bookVersions, {
    fields: [endingRules.bookVersionId],
    references: [bookVersions.id]
  })
}));
