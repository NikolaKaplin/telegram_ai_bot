import env from "../env";

function makeModelFunction(model_name: string) {
  return async function (prompt: HandMessage[], retry_times: number = 5) {
    const url = "https://hand.ni-li.com/api/llm-on-lpacpu/generate";
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + env.HAND_AI_TOKEN,
      },
      body: `{"model":"${model_name}","prompt": ${JSON.stringify(prompt)}}`,
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

export type HandMessage = {
  role: "user" | "assistant";
  content: string;
};

export const gemma2_9b_it = makeModelFunction("gemma2-9b-it");
export const llama_70b_versatile = makeModelFunction("llama-3.3-70b-versatile");
export const llama_8b_instant = makeModelFunction("llama-3.1-8b-instant");
export const llama_guard_8b = makeModelFunction("llama-guard-3-8b");
export const qwen_32b = makeModelFunction("qwen-2.5-32b")
export const qwen_coder_32b = makeModelFunction("qwen-2.5-coder-32b")
export const llama3_70b_8192 = makeModelFunction("llama3-70b-8192")
export const llama3_8b_8192 = makeModelFunction("llama3-8b-8192")