import { inlineKeyboard } from "telegraf/markup";
import bot, { CustomContext } from "..";
import route from "./route";
import { models } from "../constants";

bot.command("start", async (ctx, next) => {
  ctx.reply("Добро пожаловать, я мультимодальный бот-нейросеть")
  ctx.router.redirect("/")
});

bot.command("models", async (ctx, next) => {
  const replyMarkup = {
    inline_keyboard: [
      ...models.map((b) => [route.buttons.forward(b.model, b.href)]),
      [route.buttons.cancel],
    ],
  };
  ctx.reply("Добро пожаловать, я мультимодальный бот-нейросеть",{
    reply_markup: {
      inline_keyboard: replyMarkup.inline_keyboard,
    }})
  ctx.router.redirect("/")
});

