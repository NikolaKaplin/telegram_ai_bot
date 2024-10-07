import path from "path";
import { User } from "telegraf/types";
import BotRouting, { BotRouter } from "./util/BotRouting";
import { Context, Telegraf } from "telegraf";
import Express from "express";
import env from "./env";
import { users } from "./db/shema";
import db from "./db";
import { eq } from "drizzle-orm";
import test from "node:test";

type UserData = {
  selectedCharacterId?: string;
  currentBotPath: string;
};
const usersData: Map<number, UserData> = new Map<number, UserData>();

const routing = new BotRouting();

export class CustomContext extends Context {
  getUserData(): UserData {
    if (!usersData.has(this.from.id))
      usersData.set(this.from.id, { currentBotPath: "/" });
    return usersData.get(this.from.id);
  }
  router = new BotRouter(this, routing, "/", () => {});
}

/*async function getDBUser(tg_user: User) {
  const user = (
    await db
      .select()
      .from(users)
      .where(eq(users.telegram_id, tg_user.id))
      .execute()
  )[0];
  if (!user) {
    await db
      .insert(users)
      .values({
        telegram_id: tg_user.id,
        telegram_username: tg_user.username,
      })
      .execute();
    //return getDBUser(tg_user);
  }
  return user;
}*/

const startBot = () => {
  const token = env.TELEGRAM_BOT_TOKEN;
  const bot = new Telegraf(token, {
    contextType: CustomContext,
  });

  bot.use(async (ctx, next) => {
    //let user = await getDBUser(ctx.from);
    ctx.router = new BotRouter(
      ctx,
      routing,
      ctx.getUserData().currentBotPath,
      (path) => {
        ctx.getUserData().currentBotPath = path;
      }
    );
    let lastRoute =
      "User:" +
      ctx.from.username +
      "\n" +
      "id:" +
      ctx.from.id +
      "\n" +
      "route:" +
      ctx.getUserData().currentBotPath;
    console.log(lastRoute);
    await next();
  });

  globalThis.bot = bot;
  return bot;
};

const bot = (() => (globalThis.bot as Telegraf<CustomContext>) || startBot())();
export default bot;

const routingInitializing = routing.initialize(path.join(__dirname, "./bot"));

async function getApp() {
  await routingInitializing;
  const app = Express();

  app.use(
    "*",
    await bot.createWebhook({
      domain: env.WEBHOOK_DOMAIN,
      path: "/",
    })
  );

  if (env.NODE_ENV !== "production") {
    app.listen(3000);
    bot.launch(() => console.log(`signed in as ${bot.botInfo?.username}`));
  }

  return app;
}

if (env.NODE_ENV !== "production") getApp();

export async function handler(event: any, context: any) {
  let message: any = undefined;
  try {
    message = JSON.parse(event.body);
    await routingInitializing;
  } catch {
    if (env.WEBHOOK_DOMAIN) await bot.telegram.setWebhook(env.WEBHOOK_DOMAIN);
    return {
      statusCode: 400,
      body:
        "This is not a Telegram update." +
        (env.WEBHOOK_DOMAIN ? " Webhook was registered." : ""),
    };
  }

  if (message) await bot.handleUpdate(message);

  return {
    status: 200,
  };
}
