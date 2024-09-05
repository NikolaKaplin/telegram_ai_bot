import { text } from "stream/consumers";
import bot, { CustomContext } from "..";
import { message } from "telegraf/filters";
import { RouteConfig } from "../util/BotRouting";

const route = new RouteConfig<CustomContext>({
  async greeting(ctx) {
    const router = ctx.router.validate(route);
    if (!router) return;
    const lastMessageId: number | undefined = (ctx as any)?.callbackQuery?.id;
    const ReplyMarkup = {
      inline_keyboard: [
        [route.buttons.forward("Задайте вопрос", "/text")],
        [route.buttons.forward("Генерация изображений", "/image")],
      ],
    };
    if (lastMessageId) {
      try {
        ctx.editMessageText("Выберите нужный инструмент", {
          reply_markup: { inline_keyboard: ReplyMarkup.inline_keyboard },
        });
      } catch (error) {
        ctx.reply("Выберите нужный инструмент", {
          reply_markup: { inline_keyboard: ReplyMarkup.inline_keyboard },
        });
      }
    } else
      ctx.reply("Выберите нужный инструмент", {
        reply_markup: { inline_keyboard: ReplyMarkup.inline_keyboard },
      });
  },
});
export default route;