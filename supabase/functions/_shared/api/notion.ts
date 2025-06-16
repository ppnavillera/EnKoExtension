import { config } from "./../config/env.ts";

import { NotionService } from "../services/NotionService.ts";
import { DictionaryResponse } from "../types/dictionary.ts";

export async function handleNotionRequest(data: DictionaryResponse) {
  const notionService = new NotionService(
    config.NOTION_API_KEY,
    config.NOTION_DATABASE_ID,
  );

  try {
    const notionResult = await notionService.createPage(data);

    return {
      success: true,
      data: notionResult,
    };
  } catch (error) {
    console.error("Error processing Notion request:", error);
    throw error;
  }
}
