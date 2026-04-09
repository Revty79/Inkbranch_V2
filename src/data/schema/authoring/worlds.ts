import {
  index,
  pgTable,
  text,
  uniqueIndex,
  varchar
} from "drizzle-orm/pg-core";

import {
  createdAtColumn,
  idColumn,
  lifecycleStatusEnum,
  metadataJsonColumn,
  updatedAtColumn
} from "../shared";

export const worlds = pgTable(
  "worlds",
  {
    id: idColumn(),
    slug: varchar("slug", { length: 120 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    status: lifecycleStatusEnum("status").notNull().default("draft"),
    metadataJson: metadataJsonColumn(),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn()
  },
  (table) => [
    uniqueIndex("worlds_slug_unique_idx").on(table.slug),
    index("worlds_status_idx").on(table.status)
  ]
);
