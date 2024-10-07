// @ts-nocheck
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();

const env = createEnv({
  server: {
    NODE_ENV: z
      .literal("production")
      .or(z.literal("development"))
      .default("development"),
    TELEGRAM_BOT_TOKEN: z.string(),

    KANDINSKY_KEY: z.string(),
    KANDINSKY_SECRET_KEY: z.string(),

    YA_GPT_TOKEN: z.string(),
    HAND_AI_TOKEN: z.string(),

    X_FOLDER_ID: z.string(),
    WEBHOOK_DOMAIN: z.string().optional(),

    DATABASE_URL: z.string().url(),
  },
  runtimeEnv: process.env,
});

export default env;
