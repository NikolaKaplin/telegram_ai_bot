import bot, { CustomContext } from "../..";
import { models } from "../../constants";
import { RouteConfig } from "../../util/BotRouting";

const route = new RouteConfig<CustomContext>({
  async greeting(ctx) {
    if (!ctx.router.validate(route)) return;
    const lastMessageId: number | undefined = (ctx as any)?.callbackQuery?.id;

    let modelsArr = models;

    const replyMarkup = {
      inline_keyboard: [
        ...modelsArr.map((b) => [route.buttons.forward(b.model, b.href)]),
        [route.buttons.cancel],
      ],
    };

    const text = "Выберите баннер:";

    if (lastMessageId) {
      ctx.editMessageText(text, {
        reply_markup: {
          inline_keyboard: replyMarkup.inline_keyboard,
        },
      });
    } else ctx.reply(text, { reply_markup: replyMarkup });
  },
});

export default route;