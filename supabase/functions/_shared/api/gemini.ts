import { config } from "./../config/env.ts";

import { GeminiService } from "../services/GeminiService.ts";

export async function handleGeminiRequest(word: string) {
  const geminiService = new GeminiService(config.GEMINI_API_KEY);

  try {
    const definition = await geminiService.getDefinition(word);
    console.log(`definition: ${definition}`);
    console.log(`definition[0]: ${definition[0]}`);
    let geminiResult;
    if (definition[0] === undefined) {
      geminiResult = definition;
    } else {
      geminiResult = definition[0];
    }

    return {
      success: true,
      data: geminiResult,
    };
  } catch (error) {
    console.error("Error processing dictionary request:", error);
    throw error;
  }
}
