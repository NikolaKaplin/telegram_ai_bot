import { TaskType } from "@google/generative-ai";
import { Runware } from "@runware/sdk-js";

const runware = new Runware({ apiKey: "FBMP4fcFJXCy6KTBKbHCeVmVRNtjY1xF" });

export async function getImage(prompt: string) {
  console.log("start generation");
  const images = await runware.requestImages({
    positivePrompt: prompt,
    height: 1024,
    width: 1024,
    outputType: "base64Data",
    outputFormat: "PNG",
    model: "runware:100@1",
    steps: 25,
    CFGScale: 6.0,
    numberResults: 1,
    includeCost: true,
  });
  console.log(images);
  let base64Data = images[0].imageBase64Data;
  const buffer = Buffer.from(base64Data, "base64");
  console.log(buffer);
  return buffer;
}

("⁡civitai:133005@782002"); // model realistic
("civitai:7371@425083"); // anime model

export async function getImageDescription(image: string) {
  const caption = await runware.requestImageToText({
    inputImage: image,
  });
  console.log(caption);
  return caption.text;
}

export async function upgradePrompt(prompt: string) {
  const upPrompt = await runware.enhancePrompt({
    promptMaxLength: 2048,
    prompt: prompt,
  });
  console.log(upPrompt);
}
