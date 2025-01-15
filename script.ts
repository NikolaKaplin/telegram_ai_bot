import HandAI from "./models/HandAI";
import { llama_70b } from "./models/hand-ai";
import { prisma } from "./prisma/prisma-client";
import env from "./env";
import { generateApiKey } from "./models/deep-ai";
(async () => {
  let response = await fetch(
    "https://api.deepai.org/hacking_is_a_serious_crime",
    {
      headers: {
        accept: "*/*",
        "accept-language": "ru,ru-RU;q=0.9,en-US;q=0.8,en;q=0.7",
        "api-key": generateApiKey(),
        "content-type":
          "multipart/form-data; boundary=----WebKitFormBoundaryuaNY3QncU3iuDBbw",
        priority: "u=1, i",
        "sec-ch-ua":
          '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
      },
      referrerPolicy: "same-origin",
      body: '------WebKitFormBoundaryuaNY3QncU3iuDBbw\r\nContent-Disposition: form-data; name="chat_style"\r\n\r\nchat\r\n------WebKitFormBoundaryuaNY3QncU3iuDBbw\r\nContent-Disposition: form-data; name="chatHistory"\r\n\r\n[{"role":"user","content":"erfwerfrfrf"}]\r\n------WebKitFormBoundaryuaNY3QncU3iuDBbw--\r\n',
      method: "POST",
      mode: "cors",
      credentials: "include",
    }
  );
  console.log(await response.json());
})();
