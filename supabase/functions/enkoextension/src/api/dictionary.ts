import { config } from "./../config/env.ts";

import { GeminiService } from "../services/GeminiService.ts";
import { NotionService } from "../services/NotionService.ts";

export async function handleDictionaryRequest(word: string) {
  const geminiService = new GeminiService(config.GEMINI_API_KEY);
  const notionService = new NotionService(
    config.NOTION_API_KEY,
    config.NOTION_DATABASE_ID,
  );

  try {
    const definition = await geminiService.getDefinition(word);
    console.log(`definition: ${definition}`);
    console.log(`definition[0]: ${definition[0]}`);
    let notionResult;
    if (definition[0] === undefined) {
      notionResult = await notionService.createPage(definition);
    } else {
      notionResult = await notionService.createPage(definition[0]);
    }

    return {
      success: true,
      data: notionResult,
    };
  } catch (error) {
    console.error("Error processing dictionary request:", error);
    throw error;
  }
}
