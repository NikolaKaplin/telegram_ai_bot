import bot, { CustomContext } from "..";
import { message } from "telegraf/filters";
import { RouteConfig } from "../util/BotRouting";
import { getImage } from "../models/Runware";
import { llama_70b, mixtral } from "../models/hand-ai";

const route = new RouteConfig<CustomContext>({
  async greeting(ctx) {
    const router = ctx.router.validate(route);
    if (!router) return;
    const lastMessageId: number | undefined = (ctx as any)?.callbackQuery?.id;
    if (lastMessageId) {
    } else {
    }
  },
});

bot.on(message("text"), async (ctx) => {
  let query = (ctx.message.text).toString().replace(/\s+/g, ' ');
  console.log(query);
  let response = (await llama_70b(
    "if the user asks to generate or draw an image, answer picture and nothing else,and if the user asks a question, then output text and nothing else User request:" +
      query
  ));
  console.log(response);
  if (response.toLowerCase().includes("text")) {
    let answer = await mixtral(query);
    await ctx.reply(answer, { parse_mode: "Markdown" });
  }
  if (response.toLowerCase().includes("picture")) {
    let answer = await getImage(query);
    await ctx.replyWithPhoto({ source: answer });
  }
});

export default route;
