export async function GenerativeText(query): Promise<string> {
    const response = await fetch('https://llm.api.cloud.yandex.net/foundationModels/v1/completion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Api-Key AQVN0buMA00oZu8h_4eJD3yWHnNdK4tv47TdKdBl`,
        'x-folder-id': "b1gki1bbuvdqbe8jof25",
      },
      body: JSON.stringify({
        modelUri: `gpt://b1gki1bbuvdqbe8jof25/yandexgpt-lite`,
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