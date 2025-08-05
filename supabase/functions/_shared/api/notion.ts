import { NotionService } from "../services/NotionService.ts";
import { UserService } from "../services/UserService.ts";
import { DictionaryResponse } from "../types/dictionary.ts";
import { UserNotionConfig } from "../types/user.ts";

export async function handleNotionRequest(data: DictionaryResponse, userConfig: UserNotionConfig, userId: string) {
  const userService = new UserService();
  const notionService = new NotionService(
    userConfig.apiKey,
    userConfig.pageId,
    userId,
    userService,
    userConfig.originalPageId
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
