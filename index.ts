import path from "path";
import BotRouting, { BotRouter } from "./util/BotRouting";
import { Context, Telegraf } from "telegraf";
import Express from "express";
import env from "./env";

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

const startBot = () => {
  const token = env.TELEGRAM_BOT_TOKEN;
  const bot = new Telegraf(token, {
    contextType: CustomContext,
  });

  bot.use(async (ctx, next) => {
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
  if (env.NODE_ENV !== "production") app.listen(3000);

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
