import { inlineKeyboard } from "telegraf/markup";
import bot, { CustomContext } from "..";
import route from "./route";

bot.command("start", async (ctx, next) => {
  ctx.router.redirect("/")
});

bot.command("menu", async (ctx, next) => {
  ctx.router.redirect("/")
});