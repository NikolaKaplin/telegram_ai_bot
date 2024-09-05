import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from "path";
import { message } from "telegraf/filters";
import BotRouting, { BotRouter } from "./util/BotRouting";
import { Context, Telegraf } from "telegraf";
import { User } from "telegraf/types";

const folderID = "b1gki1bbuvdqbe8jof25"
const YAindetefecation = "ajehne606j98crni3vs7";
const YAtoken = "AQVN0buMA00oZu8h_4eJD3yWHnNdK4tv47TdKdBl"
const TgToken = "7405090933:AAH-dmLJLZTMiLXAh3IhUMgeCYgbAEO5MRM";
const key = "5DF028B1F9C6E812ACD62162D65DA07C";
const secretKey = 'AEDDB5CAADA9B38F1186608F38AF5EBC';

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
  const token = "7405090933:AAH-dmLJLZTMiLXAh3IhUMgeCYgbAEO5MRM";
  const bot = new Telegraf(token, {
    contextType: CustomContext,
  });

  bot.use((ctx, next) => {
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
    next();
  });

  bot.launch();
  globalThis.bot = bot;
  return bot;
};

const bot = (() => (globalThis.bot as Telegraf<CustomContext>) || startBot())();
export default bot;

routing.initialize(path.join(__dirname, "./bot"));