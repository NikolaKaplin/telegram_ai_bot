function makeModelFunction(model_name: string) {
  return async function (prompt: string, retry_times: number = 5) {
    const url = "https://hand.ni-li.com/api/llm-on-lpacpu/generate";
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + process.env.HAND_AI_TOKEN,
      },
      body: `{"model":"${model_name}","prompt": "${prompt}"}`,
    };

    try {
      const response = await fetch(url, options);
      let data = (await response.json()).choices[0].message.content;
      return data.toString() as string;
    } catch (error) {
      console.log(error);
      if (retry_times > 0)
        return await new Promise<string>((res) => {
          setTimeout(async () => {
            res(await makeModelFunction(model_name)(prompt, retry_times - 1));
          }, 3000);
        });
    }
  };
}

export const llama_70b = makeModelFunction("llama3-70b-8192");
export const mixtral = makeModelFunction("mixtral-8x7b-32768");
export const gemma = makeModelFunction("gemma-7b-it");
export const llama_8b = makeModelFunction("llama3-8b-8192");
