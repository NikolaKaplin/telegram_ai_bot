import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { Telegraf } from 'telegraf'
import { message } from "telegraf/filters";



const TgToken = "7405090933:AAH-dmLJLZTMiLXAh3IhUMgeCYgbAEO5MRM";
const key = "5DF028B1F9C6E812ACD62162D65DA07C";
const secretKey = 'AEDDB5CAADA9B38F1186608F38AF5EBC';

const bot = new Telegraf(TgToken);
let penis = ""

bot.command('start', (ctx) => ctx.reply('Ку, я был накоден за час, поэтому не гарантирую тебе нормальные картинки на твои запросы, как нибуть попозже меня доделают, а пока просто введи что хочешь получить'))

bot.on(message("text"), async (ctx, next) => {
    ctx.reply("пагади пока сгенерю")
    penis = ctx.message.text
    console.log(penis)
    let image = await Generative();
    ctx.replyWithPhoto(
        {source: image }, 
        {caption: "ну я пытался крч"}
    )
})

class Text2ImageAPI {
    constructor(url, apiKey, secretKey) {
        this.URL = url;
        this.AUTH_HEADERS = {
            'X-Key': `Key ${apiKey}`,
            'X-Secret': `Secret ${secretKey}`,
        };
    }

    async getModels() {
      const response = await axios.get(`${this.URL}key/api/v1/models`, { headers: this.AUTH_HEADERS });
      return response.data[0].id;
    }

    async generate(prompt, model, images = 1, width = 1024, height = 1024, style = 3) {
        const styles = ["KANDINSKY", "UHD", "ANIME", "DEFAULT"];
        const params = {
            type: "GENERATE",
            numImages: images,
            width,
            height,
            style: styles[3],
            generateParams: {
                query: penis
            }
        };

        const formData = new FormData();
        const modelIdData = { value: model, options: { contentType: null } };
        const paramsData = { value: JSON.stringify(params), options: { contentType: 'application/json' } };
        formData.append('model_id', modelIdData.value, modelIdData.options);
        formData.append('params', paramsData.value, paramsData.options);

        const response = await axios.post(`${this.URL}key/api/v1/text2image/run`, formData, {
          headers: {
              ...formData.getHeaders(),
              ...this.AUTH_HEADERS
              
          },
          'Content-Type': 'multipart/form-data'
      });
        const data = response.data;
        return data.uuid;
    }

    async checkGeneration(requestId, attempts = 10, delay = 10) {
      while (attempts > 0) {
        try {
          const response = await axios.get(`${this.URL}key/api/v1/text2image/status/${requestId}`, { headers: this.AUTH_HEADERS });
          const data = response.data;
          if (data.status === 'DONE') {
            return data.images;
          }
        } catch (error) {
          // обрабатываем ошибку
          console.error(error);
        }
        attempts--;
        await new Promise(resolve => setTimeout(resolve, delay * 1000));
      }
    }
    
}

async function Generative() {
    console.log('start generation...')
    const api = new Text2ImageAPI('https://api-key.fusionbrain.ai/', '5DF028B1F9C6E812ACD62162D65DA07C', 'AEDDB5CAADA9B38F1186608F38AF5EBC');
    const modelId = await api.getModels();
    const uuid = await api.generate("Язык программирования JavaScript", modelId, 1, 1024, 1024, 1);
    const images = await api.checkGeneration(uuid);
    const base64String = images[0];  // Получаем код изображения
    // Преобразование строки base64 в бинарные данные
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');

    // Создание буфера из бинарных данных
    const buffer = Buffer.from(base64Data, 'base64');
    console.log(buffer)
    return(buffer);
    // Запись буфера в файл
    /*fs.writeFile('image.jpg', buffer, 'base64', (err) => {
      if (err) throw err;
      console.log('Файл сохранен!');
    }); */
};

bot.launch()