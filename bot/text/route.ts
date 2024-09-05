import bot, { CustomContext } from "../..";
import { message } from "telegraf/filters";
import { RouteConfig } from "../../util/BotRouting";
import { GenerativeText } from "../../models/YAgpt";

const route = new RouteConfig<CustomContext>({
  async greeting(ctx) {
    const router = ctx.router.validate(route);
    if (!router) return;
    const lastMessageId: number | undefined = (ctx as any)?.callbackQuery?.id;

    if (lastMessageId) {
        ctx.editMessageText(
            "Я отвечу практически на все ваши вопросы",
            {reply_markup: { inline_keyboard: [[route.buttons.cancel]] },
      })
    }
  },
});

bot.on(message("text"), async (ctx, next) => {
  const router = ctx.router.validate(route);
  if (!router) return next();
  let query = ctx.message.text
  console.log(query)
  let text = await GenerativeText(query);
  return ctx.reply(
    text
  )
})

export default route;
