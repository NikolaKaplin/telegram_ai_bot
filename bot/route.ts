import bot, { CustomContext } from "..";
import { message } from "telegraf/filters";
import { RouteConfig } from "../util/BotRouting";
import { getImage } from "../models/Runware";
import { mixtral } from "../models/hand-ai/mixtral-8x7b-32768";
import { llama_70b } from "../models/hand-ai/llama3-70b-8192";


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
  let query = ctx.message.text;
  console.log(query);
  let response = (await llama_70b(
    "if the user asks to generate or draw an image, answer picture and nothing else,and if the user asks a question, then output text and nothing else User request:" +
      query
  )).toLowerCase();
  let answer;
  console.log(response);
  if (response == "text") {
    answer = await mixtral(query);
    ctx.reply(answer, { parse_mode: "Markdown" });
  }
  if (response == "picture") {
    answer = await getImage(query);
    ctx.replyWithPhoto({ source: answer });
  }
});

export default route;
