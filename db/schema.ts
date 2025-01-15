// drizzle my balls
import {
  mysqlTableCreator,
  int,
  varchar,
  bigint,
  datetime,
} from "drizzle-orm/mysql-core";

const table = mysqlTableCreator((n) => "gb_" + n);

export const users = table("user", {
  id: int("id").autoincrement().primaryKey(),
  telegram_id: bigint("telegram_id", { mode: "number" }).notNull(),
  bot_path: varchar("bot_path", { length: 1024 }).default("/").notNull(),
  registered_at: datetime("registered_at")
    .$default(() => new Date())
    .notNull(),
});
