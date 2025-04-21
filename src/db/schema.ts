import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: uuid().primaryKey().defaultRandom(),
    created_at: timestamp().notNull().defaultNow(),
    name: text(),
    email: text().unique(),
    email_verified: timestamp(),
    password_hash: text(),
});
