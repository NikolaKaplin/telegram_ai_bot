import { Config } from "drizzle-kit";
import env from "./env";

export default {
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
} satisfies Config;
