import bot, { CustomContext } from "..";
import { message } from "telegraf/filters";
import { RouteConfig } from "../util/BotRouting";
import { getImage, getImageDescription } from "../models/Runware";
import {
  HandMessage,
  gemma2_9b_it,
  llama3_70b_8192,
  llama3_8b_8192,
  llama_70b_versatile,
  llama_8b_instant,
  llama_guard_8b,
  qwen_32b,
  qwen_coder_32b
} from "../models/hand-ai";
import { db } from "../db";
import { chatTable, messageTable } from "../db/schema";
import { asc, desc, eq } from "drizzle-orm";

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

function dbToHandMessages(messages: Message[]): HandMessage[] {
  return messages.map((message) => {
    return {
      role: message.isBot ? "assistant" : "user",
      content: message.message,
    };
  });
}



bot.on(message("text"), async (ctx) => {
  let query = ctx.message.text
    .toString()
    .replace(/\s+/g, " ")
    .toString()
    .replace(/"/g, "")
    .slice(0, 4070);
  console.log(query);
  let [chat] = await db.select().from(chatTable).where(eq(chatTable.userId, ctx.user.id)).orderBy(desc(chatTable.createdAt));
  if (!chat) {
    chat = await db.insert(chatTable).values({
      userId: ctx.user.id
    })
  }

  const messageText = await db.insert(messageTable).values({
    message: query,
    chatId: chat.id,
    isBot: false
  });

  let messages = await db.select().from(messageTable).where(eq(messageTable.chatId, chat.id)).orderBy(asc(messageTable.id));
  let response = (await llama3_70b_8192(dbToHandMessages(messages))).toString();
  console.log(response);
  ctx.reply(response, { parse_mode: "Markdown" });

  await db.insert(messageTable).values({
    message: response,
    
  })
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
