require("dotenv").config();

export async function mixtral(prompt) {
  const url = "https://hand.ni-li.com/api/llm-on-lpacpu/generate";
  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: process.env.HAND_AI_TOKEN,
    },
    body: `{"model":"mixtral-8x7b-32768","prompt": "${prompt}"}`,
  };

  try {
    const response = await fetch(url, options);
    let data = (await response.json()).choices[0].message.content;
    return data.toString();
  } catch (error) {
    console.log(error);
  }
}
