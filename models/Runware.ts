import { Runware } from "@runware/sdk-js";

const runware = new Runware({ apiKey: "FBMP4fcFJXCy6KTBKbHCeVmVRNtjY1xF" });

export async function getImage(
  prompt: string,
  onPart?: (img: Buffer, isNSFW: boolean) => any
) {
  console.log("start generation");
  const images = await runware.requestImages({
    positivePrompt: prompt,
    height: 1024,
    width: 1024,
    outputType: "base64Data",
    outputFormat: "PNG",
    model: "civitai:139562@344487",
    steps: 25,
    CFGScale: 5.5,
    numberResults: 1,
    onPartialImages(images, error) {
      if (onPart)
        onPart(
          Buffer.from(images[0].imageBase64Data, "base64"),
          images[0].NSFWContent
        );
    },
  });
  let base64Data = images[0].imageBase64Data;
  const buffer = Buffer.from(base64Data, "base64");
  console.log(buffer);
  return buffer;
}

("⁡civitai:133005@782002"); // model realistic
("civitai:7371@425083"); // anime model
