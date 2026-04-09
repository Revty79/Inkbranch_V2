import {
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar
} from "drizzle-orm/pg-core";

import { chronicles } from "./chronicles";
import { createdAtColumn, objectJsonColumn } from "../shared";

export const eventLog = pgTable(
  "event_log",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    chronicleId: uuid("chronicle_id")
      .notNull()
      .references(() => chronicles.id, { onDelete: "cascade" }),
    eventType: varchar("event_type", { length: 120 }).notNull(),
    eventTs: timestamp("event_ts", { withTimezone: true })
      .notNull()
      .defaultNow(),
    causedByType: varchar("caused_by_type", { length: 80 }),
    causedById: text("caused_by_id"),
    payloadJson: objectJsonColumn("payload_json"),
    createdAt: createdAtColumn()
  },
  (table) => [
    index("event_log_chronicle_id_idx").on(table.chronicleId),
    index("event_log_event_type_idx").on(table.eventType),
    index("event_log_event_ts_idx").on(table.eventTs)
  ]
);
