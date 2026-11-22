import { primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const learnerValues = sqliteTable("learner_values", {
  profile: text("profile").notNull(),
  key: text("key").notNull(),
  value: text("value").notNull(),
}, table => [primaryKey({ columns: [table.profile, table.key] })]);
