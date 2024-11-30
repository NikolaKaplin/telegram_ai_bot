import HandAI from "./models/HandAI";
import { llama_70b } from "./models/hand-ai";
import { prisma } from "./prisma/prisma-client";
import env from "./env";
llama_70b([
  {
    role: "user",
    content: "Hello world",
  },
]);
