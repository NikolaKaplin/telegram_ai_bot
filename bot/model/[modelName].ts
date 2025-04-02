import bot, { CustomContext } from "../..";
import { RouteConfig } from "../../util/BotRouting";

const route = new RouteConfig<CustomContext>({
  async greeting(ctx) {
    if (!ctx.router.validate(route)) return;
    const lastMessageId: number | undefined = (ctx as any)?.callbackQuery?.id;

    const bannerHref = atob(ctx.router.params.modelName);
    if (lastMessageId) {
    } else
      ctx.reply(banner, {
        reply_markup: { inline_keyboard: [[route.buttons.cancel]] },
      });
  },
});

export default route;