import env from "../env"

export async function GenerativeText(query): Promise<string> {
    const response = await fetch('https://llm.api.cloud.yandex.net/foundationModels/v1/completion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Api-Key ${env.YA_GPT_TOKEN}`,
        'x-folder-id': env.X_FOLDER_ID,
      },
      body: JSON.stringify({
        modelUri: `gpt://${env.X_FOLDER_ID}/yandexgpt-lite`,
        completionOptions: {
          stream: false,
          temperature: 0.5,
          maxTokens: '1000',
        },
        messages: [
          {
            role: 'user',
            text: query,
          },
        ],
      }),
    });
  
    const json = await response.json();
    console.log(json.result.alternatives[0].message.text)
    return json.result.alternatives[0].message.text;
  }