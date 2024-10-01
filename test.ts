import { Telegraf } from "telegraf"

(async () => {
    const bot = new Telegraf("7405090933:AAH-dmLJLZTMiLXAh3IhUMgeCYgbAEO5MRM");
    await bot.createWebhook({
        domain: "functions.yandexcloud.net/d4e46cg61q6ki5tb74qo",
        path: "/"
    })
    console.log("aboba")
})()