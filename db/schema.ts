import { createId as cuid } from "@paralleldrive/cuid2";
import { boolean, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { message } from "telegraf/filters";

export const userTable = mysqlTable("users", {
    id: varchar("id", {length: 256}).primaryKey().$default(cuid),
    tgId: varchar("tg_id", {length: 128}).notNull(),
    firstName: varchar("first_name", {length: 48}).notNull(),
    lastname: varchar("last_name", {length: 48} ).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    chatId: varchar('chat_id', {length: 256}).references(() => chatTable.id, {
        onDelete: "cascade",
    }),
    model: varchar("model", {length: 16}).notNull()
})

export const chatTable = mysqlTable("chats", {
    id: varchar("id", {length: 256}).primaryKey().$default(cuid),
    userId: varchar("user_id", {length: 256}).references(() => userTable.id, {
        onDelete: "set null"
    }),
    createdAt: timestamp("created_at").defaultNow(),
})

export const messageTable = mysqlTable("messages", {
    id: varchar("id", {length: 256}).primaryKey().$default(cuid),
    chatId: varchar("chat_id", {length: 256}).references(() => chatTable.id, {
        onDelete: "cascade"
    }),
    isBot: boolean("is_bot").notNull(),
    message: varchar("message").notNull()
})
