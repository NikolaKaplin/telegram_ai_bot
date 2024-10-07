import bot, { CustomContext } from "..";
import { message } from "telegraf/filters";
import { RouteConfig } from "../util/BotRouting";
import { getImage, getImageDescription } from "../models/Runware";
import { gemma, llama_70b, llama_8b, mixtral } from "../models/hand-ai";
import sharp from "sharp";
import { buffer, json } from "stream/consumers";

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

bot.on(message("photo"), async (ctx) => {
  let photo;
  try {
    photo = ctx.message.photo[3];
    const file = await ctx.telegram.getFile(photo.file_id);

    // Get the file path
    const filePath = file.file_path;

    // Download the file
    const response = await fetch(
      `https://api.telegram.org/file/bot${ctx.telegram.token}/${filePath}`
    );
    const fileBuffer = await response.arrayBuffer();
    await ctx.sendChatAction("typing");
    let image = Buffer.from(fileBuffer);
    let content = await getImageDescription(image.toString("base64"));
    // Send the file back to the user
    await ctx.reply(content);
  } catch (eror) {
    photo = ctx.message.photo[2];
    const file = await ctx.telegram.getFile(photo.file_id);

    // Get the file path
    const filePath = file.file_path;

    // Download the file
    const response = await fetch(
      `https://api.telegram.org/file/bot${ctx.telegram.token}/${filePath}`
    );
    const fileBuffer = await response.arrayBuffer();
    await ctx.sendChatAction("typing");
    let image = Buffer.from(fileBuffer);
    let content = await getImageDescription(image.toString("base64"));
    // Send the file back to the user
    await ctx.reply(content);
  }
  console.log(ctx.message.photo);
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

    let answer = await llama_70b(query);
    await ctx.reply(answer, { parse_mode: "Markdown" });
  }
  if (response.toLowerCase().includes("picture")) {
    await ctx.sendChatAction("upload_photo");
    let image = await getImage(query);
    const isNSFW = response.toLowerCase().includes("nsfw");
    let caption = "";
    if (isNSFW == true)
      caption = "🔞 Осторожно, может содежаться нежелательный контент!!!";
    await ctx.replyWithPhoto(
      { source: image },
      {
        has_spoiler: isNSFW,
        caption: caption,
      }
    );
  }
});

export default route;
