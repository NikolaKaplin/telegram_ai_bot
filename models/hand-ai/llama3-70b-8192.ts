require("dotenv").config();

export async function llama_70b(prompt) {
  const url = "https://hand.ni-li.com/api/llm-on-lpacpu/generate";
  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: process.env.HAND_AI_TOKEN,
    },
    body: `{"model":"llama3-70b-8192","prompt": "${prompt}"}`,
  };

  try {
    const response = await fetch(url, options);
    let data = (await response.json()).choices[0].message.content;
    return data.toString();
  } catch (error) {
    console.log(error);
  }
}

llama_70b("в каком году была вторая мировая?")