import bot, { CustomContext } from "..";
import { message } from "telegraf/filters";
import { RouteConfig } from "../util/BotRouting";
import { getImage } from "../models/Runware";
import { gemma, llama_70b, mixtral } from "../models/hand-ai";

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
  let query = ctx.message.text
    .toString()
    .replace(/\s+/g, " ")
    .toString()
    .replace(/"/g, "");
  console.log(query);
  let response = await llama_70b(
    "if the user asks to generate or draw an image, answer picture and nothing else,and if the user asks a question or writing, then output text and nothing else. If an image should contain any nsfw content, reply with picture-nsfw.If User request:" +
      query
  );
  console.log(response);
  if (response.toLowerCase().includes("text")) {
    await ctx.sendChatAction("typing");

    let answer = await gemma(query);
    await ctx.reply(answer, { parse_mode: "Markdown" });
  }
  if (response.toLowerCase().includes("picture")) {
    await ctx.sendChatAction("upload_photo");

    let msg_id = undefined as number;

    await getImage(query, async (img, mtnsfw) => {
      const media = { source: img };
      const isNSFW = mtnsfw || response.toLowerCase().includes("nsfw");
      let caption = "";
      if (isNSFW == true)
        caption = "🔞 Осторожно, может содежаться неприличный контент!!!";
      if (!msg_id)
        await ctx.replyWithPhoto(media, {
          has_spoiler: isNSFW,
          caption: caption,
        });
    });
  }
});

export default route;
