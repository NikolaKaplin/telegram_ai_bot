import { inlineKeyboard } from "telegraf/markup";
import bot, { CustomContext } from "..";
import route from "./route";

bot.command("start", async (ctx, next) => {
  ctx.reply("Добро пожаловать, я мультимодальный бот-нейросеть")
  ctx.router.redirect("/")
});

