import { Runware } from "@runware/sdk-js";

const runware = new Runware({ apiKey: "FBMP4fcFJXCy6KTBKbHCeVmVRNtjY1xF" });

export async function getImage(prompt: string) {
    const images = await runware.requestImages({
        positivePrompt: prompt;
        negativePrompt?: string;
        width: number;
        height: number;
        model: string;
        numberResults?: number;
        outputType?: "URL" | "base64Data" | "dataURI";
        outputFormat?: "JPG" | "PNG" | "WEBP";
        uploadEndpoint?: string;
        checkNSFW?: boolean
        seedImage?: File | string;
        maskImage?: File | string;
        strength?: number;
        steps?: number;
        schedular?: string;
        seed?: number;
        CFGScale?: number;
        clipSkip?: number;
        usePromptWeighting?: number;
        controlNet?: IControlNet[];
        lora?: ILora[];
        useCache?: boolean;
        returnBase64Image?: boolean;
        onPartialImages?: (images: IImage[], error: IError) =>  void;
        })
        return interface IImage {
        taskType: ETaskType;
        imageUUID: string;
        inputImageUUID?: string;
        taskUUID: string;
        imageURL?: string;
        imageBase64Data?: string;
        imageDataURI?: string;
        NSFWContent?: boolean;
        cost: number;
        }[]
}

getImage("sexy nude girl")


{
    "model": "llama3-8b-8192" | "llama3-70b-8192" | "mixtral-8x7b-32768" | "gemma-7b-it",
    "prompt": "любой текст"
}


POST https://hand.ni-li.com/api/llm-on-lpacpu/generate
Authorization: Bearer iCeoI6o+4Bv1oV1+IgGbjUD7s+gK2ooj9xdXXHVrfck=;

{
  "model": "llama3-8b-8192" | "llama3-70b-8192" | "mixtral-8x7b-32768" | "gemma-7b-it",
  "prompt": "любой текст"
}
