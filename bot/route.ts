import bot, { CustomContext } from "..";
import { message } from "telegraf/filters";
import { RouteConfig } from "../util/BotRouting";
import axios from "axios";
import FormData = require("form-data");
import {
  HandMessage,
  gemma,
  llama_70b,
  llama_8b,
  mixtral,
} from "../models/hand-ai";
import { generateApiKey } from "../models/deep-ai";

const route = new RouteConfig<CustomContext>({
  async greeting(ctx) {
    const router = ctx.router.validate(route);
    if (!router) return;
    const lastMessageId: number | undefined = (ctx as any)?.callbackQuery?.id;
    if (lastMessageId) {
    } else {
      bot.on(message("text"), async () => {});
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

async function generateText(text: string, message_id, ctx) {
  let lang = ctx.from.language_code;
  let userAgent =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0";
  const apiKey = generateApiKey();
  const url = "https://api.deepai.org/hacking_is_a_serious_crime";
  // Create a FormData instance
  const form = new FormData();
  form.append("chat_style", "free-chatgpt");
  form.append(
    "chatHistory",
    `[{"role":"user","content":"Language response: ${lang}, Prompt: ${text
      .toString()
      .replace(/"/g, '\\"')}"}]`.replace(/\n/g, "")
  ); // Ensure it's a string
  try {
    const response = await axios.post(url, form, {
      headers: {
        ...form.getHeaders(), // Important: include the form headers
        "api-key": apiKey,
        Accept: "*/*",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Accept-Language": "ru,en;q=0.9,en-GB;q=0.8,en-US;q=0.7",
        "User-Agent": userAgent,
      },
      responseType: "stream",
    });
    let answer = "";
    let endAnswer = "";
    let lastEditTime = Date.now();
    response.data.on("data", (chunk) => {
      endAnswer += chunk.toString();
      answer += chunk.toString().replace(/[~`!@#$%^&*()_+=|\/.,<>№;:?]/g, "");
      if (Date.now() - lastEditTime > 600) {
        ctx.telegram.editMessageText(
          ctx.chat.id,
          message_id,
          undefined,
          answer
        );
        lastEditTime = Date.now();
      }
    });
    response.data.on("end", () => {
      ctx.telegram.editMessageText(
        ctx.chat.id,
        message_id,
        undefined,
        endAnswer,
        { parse_mode: "Markdown" }
      );
      console.log("Stream finished.");
    });
  } catch (error) {
    ctx.telegram.editMessageText(
      ctx.chat.id,
      message_id,
      undefined,
      "Произошла непридвиденная ошибка"
    );
  }
}

async function getImage(text: string) {
  let userAgent =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0";
  const apiKey = generateApiKey();
  const url = "https://api.deepai.org/api/text2img";
  // Create a FormData instance
  const form = new FormData();
  form.append("text", text);
  form.append("width", "576");
  form.append("height", "768");
  form.append("image_generator_version", "hd");
  form.append("use_old_model", "false");
  form.append("quality", "true");
  form.append("genius_preference", "classic");
  try {
    const response = await axios.post(url, form, {
      headers: {
        ...form.getHeaders(), // Important: include the form headers
        "api-key": apiKey,
        Accept: "*/*",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Accept-Language": "ru,en;q=0.9,en-GB;q=0.8,en-US;q=0.7",
        "User-Agent": userAgent,
      },
      responseType: "json",
    });
    console.log(response.data);
    return response.data.share_url;
  } catch (error) {
    console.log(error);
  }
}

async function getDescriptionImage(image: Buffer) {
  const url = "https://docsbot.ai/api/tools/image-prompter";
  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "*/*",
      "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
      origin: "https://docsbot.ai",
      priority: "u=1, i",
      referer: "https://docsbot.ai/tools/image/description-generator",
      "sec-fetch-site": "same-origin",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    },
    body: `{"type":"description","image":"${image.toString("base64")}"}`,
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
}

async function customTask(text: string) {
  let userAgent =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0";
  const apiKey = generateApiKey();
  const url = "https://api.deepai.org/hacking_is_a_serious_crime";
  // Create a FormData instance
  const form = new FormData();
  form.append("chat_style", "free-chatgpt");
  form.append(
    "chatHistory",
    `[{"role":"user","content":"${text
      .toString()
      .replace(/"/g, '\\"')}"}]`.replace(/\n/g, "")
  ); // Ensure it's a string
  try {
    const response = await axios.post(url, form, {
      headers: {
        ...form.getHeaders(), // Important: include the form headers
        "api-key": apiKey,
        Accept: "*/*",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Accept-Language": "ru,en;q=0.9,en-GB;q=0.8,en-US;q=0.7",
        "User-Agent": userAgent,
      },
      responseType: "text",
    });
    ``;
    return await response.data;
  } catch (err) {
    console.log(err);
  }
}

// function dbToHandMessages(messages: Message[]): HandMessage[] {
//   return messages.map((message) => {
//     return {
//       role: message.isBot ? "assistant" : "user",
//       content: message.message,
//     };
//   });
// }

// function handToDbMessages(
//   message: HandMessage
// ): Prisma.MessageCreateWithoutChatInput {
//   return {
//     isBot: message.role === "assistant",
//     message: message.content,
//   };
// }

bot.on(message("photo"), async (ctx) => {
  const file = await ctx.telegram.getFile(
    ctx.message.photo![ctx.message.photo!.length - 1].file_id
  );
  const fileLink = await ctx.telegram.getFileLink(file.file_id);

  const response = await axios.get(fileLink.toString(), {
    responseType: "arraybuffer",
  });
  const imageBuffer = response.data;
  console.log(imageBuffer);
  let descriptionEnglish = await getDescriptionImage(imageBuffer);
  let description = await customTask(
    "Translate to russian: " + descriptionEnglish
  );
  ctx.reply(description);
});

bot.on(message("text"), async (ctx) => {
  let message = ctx.message.text;
  let type = await customTask(
    "If the user needs a picture, answer image and nothing else, if a text answer, then answer text and nothing more. Use only english. There’s no other way to answer: " +
      message
  );
  console.log(type);
  if (
    type.toLowerCase() == "text" ||
    type.toLowerCase().includes("understood")
  ) {
    const { message_id } = await ctx.reply("🚀");
    await generateText(message, message_id, ctx);
  }
  if (type.toLowerCase() == "image") {
    let translate = await customTask("Translate user promp to english: " + message)
    console.log(translate)
    let image = await getImage(await translate);
    ctx.sendChatAction("upload_photo");
    ctx.replyWithPhoto({ url: image });
  }
  // await ctx.telegram.editMessageText(
  //   ctx.chat.id,
  //   message_id,
  //   undefined,
  //   "new text"
  // );

  // let query = ctx.message.text
  //   .toString()
  //   .replace(/\s+/g, " ")
  //   .toString()
  //   .replace(/"/g, "")
  //   .slice(0, 4070);
  // console.log(query);
  // let chat = await prisma.chat.findFirst({
  //   where: {
  //     userId: ctx.user.id,
  //   },
  //   orderBy: {
  //     createdAt: "desc",
  //   },
  // });
  // if (!chat) {
  //   chat = await prisma.chat.create({
  //     data: {
  //       userId: ctx.user.id,
  //     },
  //   });
  // }
  // const messageText = await prisma.message.create({
  //   data: {
  //     message: query,
  //     chatId: chat!.id,
  //     isBot: false,
  //   },
  // });
  // let messages = await prisma.message.findMany({
  //   where: {
  //     chatId: chat!.id,
  //   },
  //   orderBy: {
  //     id: "asc",
  //   },
  // });
  // let response = (await gemma(dbToHandMessages(messages))).toString();
  // // .replace(/\s+/g, "");
  // console.log(response);
  // try {
  //   ctx.reply(response);
  //   await prisma.message.create({
  //     data: {
  //       message: response,
  //       chatId: chat!.id,
  //       isBot: true,
  //     },
  //   });
  // } catch (error) {
  //   ctx.reply("Что-то пошло не так, попробуйте ещё раз");
  // }
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
