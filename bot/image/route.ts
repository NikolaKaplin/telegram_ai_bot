import bot, { CustomContext } from "../..";
import { message } from "telegraf/filters";
import { RouteConfig } from "../../util/BotRouting";
import { Generative } from "../../models/kandinsky";

const route = new RouteConfig<CustomContext>({
  async greeting(ctx) {
    const router = ctx.router.validate(route);
    if (!router) return;
    const lastMessageId: number | undefined = (ctx as any)?.callbackQuery?.id;
    if (lastMessageId) {
        ctx.editMessageText(
            "Постараюсь нарисовать картинку по ваему запросу\n Выбор стиля: /anime или /realistic", 
            {reply_markup: { inline_keyboard: [[route.buttons.cancel]] },
          }
        )
    }
  },
});

let style = "";

bot.command("anime", async (ctx, next) => {
  style = "ANIME"
});

bot.command("realistic", async (ctx, next) => {
  style = "DEFAULT"
});

bot.on(message("text"), async (ctx, next) => {
   const router = ctx.router.validate(route);
   if (!router) return next();
    ctx.reply("пагади пока сгенерю")
    let query = ctx.message.text
    console.log(query)
    let image = await Generative(query, style);
    ctx.replyWithPhoto(
        {source: image },
    )
})

export default route;





