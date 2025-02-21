import { NotionService } from "./../services/NotionService";
import { config } from "@/config/env";
import { GeminiService } from "@/services/GeminiService";

export async function handleDictionaryRequest(word: string) {
  const geminiService = new GeminiService(config.GEMINI_API_KEY);
  const notionService = new NotionService(
    config.NOTION_API_KEY,
    config.NOTION_DATABASE_ID
  );

  try {
    const definition = await geminiService.getDefinition(word);
    const notionResult = await notionService.createPage(definition);
    return {
      success: true,
      data: notionResult,
    };
  } catch (error) {
    console.error("Error processing dictionary request:", error);
    throw error;
  }
}
