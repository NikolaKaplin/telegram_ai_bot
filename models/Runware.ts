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
    model: "⁡civitai:133005@782002",
    steps: 25,
    CFGScale: 7.0,
    numberResults: 1,
  });
  let base64Data = images[0].imageBase64Data;
  const buffer = Buffer.from(base64Data, "base64");
  console.log(buffer);
  return buffer;
}
