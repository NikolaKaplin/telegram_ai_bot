import bot, { CustomContext } from "..";
import { message } from "telegraf/filters";
import { RouteConfig } from "../util/BotRouting";
import { getImage, getImageDescription } from "../models/Runware";
import {
  HandMessage,
  gemma,
  llama_70b,
  llama_8b,
  mixtral,
} from "../models/hand-ai";
import sharp from "sharp";
import { buffer, json } from "stream/consumers";
import { prisma } from "../prisma/prisma-client";
import { Message, Prisma } from "@prisma/client";

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

/*bot.on(message("photo"), async (ctx) => {
  let photo;
  photo = ctx.message.photo.slice(-1)[0].file_id;
  console.log(ctx.message.photo);
  console.log(photo);
  const file = await ctx.telegram.getFile(photo);

  // Get the file path
  const filePath = file.file_path;

  // Download the file
  const response = await fetch(
    `https://api.telegram.org/file/bot${ctx.telegram.token}/${filePath}`
  );
  const fileBuffer = await response.arrayBuffer();
  await ctx.sendChatAction("typing");
  let image = Buffer.from(fileBuffer);
  await ctx.replyWithPhoto({ source: image });
  let content = await getImageDescription(image.toString("base64"));
  // Send the file back to the user
  await ctx.reply(content, {parse_mode: "Markdown"});
});
*/

function dbToHandMessages(messages: Message[]): HandMessage[] {
  return messages.map((message) => {
    return {
      role: message.isBot ? "assistant" : "user",
      content: message.message,
    };
  });
}

function handToDbMessages(
  message: HandMessage
): Prisma.MessageCreateWithoutChatInput {
  return {
    isBot: message.role === "assistant",
    message: message.content,
  };
}

bot.on(message("text"), async (ctx) => {
  let query = ctx.message.text
    .toString()
    .replace(/\s+/g, " ")
    .toString()
    .replace(/"/g, "")
    .slice(0, 4070);
  console.log(query);
  let chat = await prisma.chat.findFirst({
    where: {
      userId: ctx.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  if (!chat) {
    chat = await prisma.chat.create({
      data: {
        userId: ctx.user.id,
      },
    });
  }
  const messageText = await prisma.message.create({
    data: {
      message: query,
      chatId: chat!.id,
      isBot: false,
    },
  });
  let messages = await prisma.message.findMany({
    where: {
      chatId: chat!.id,
    },
    orderBy: {
      id: "asc",
    },
  });
  let response = (await gemma(dbToHandMessages(messages))).toString();
  console.log(response);
  ctx.reply(response, { parse_mode: "Markdown" });

  await prisma.message.create({
    data: {
      message: response,
      chatId: chat!.id,
      isBot: true,
    },
  });
});

export default route;

/*if (response.toLowerCase().includes("text")) {
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
  */
