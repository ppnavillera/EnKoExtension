import { Client } from "npm:@notionhq/client";
import type {
  CreatePageParameters,
  PageObjectResponse,
} from "npm:@notionhq/client/build/src/api-endpoints";
import { DictionaryResponse } from "../types/dictionary.ts";

export class NotionService {
  private notion: Client;
  private dbId: string;
  private userId?: string;
  private userService?: any;
  private originalPageId?: string;

  constructor(apiKey: string, dbId: string, userId?: string, userService?: any, originalPageId?: string) {
    this.notion = new Client({ auth: apiKey });
    this.dbId = dbId;
    this.userId = userId;
    this.userService = userService;
    this.originalPageId = originalPageId;
  }

  async checkPageOrDatabase(
    id: string,
  ): Promise<"page" | "database" | "not_found"> {
    try {
      // 먼저 데이터베이스로 시도
      await this.notion.databases.retrieve({ database_id: id });
      return "database";
    } catch (_dbError) {
      try {
        // 데이터베이스가 아니면 페이지로 시도
        await this.notion.pages.retrieve({ page_id: id });
        return "page";
      } catch (pageError) {
        console.error("ID not found as page or database:", id, pageError);
        return "not_found";
      }
    }
  }

  async createDatabase(parentPageId: string): Promise<string> {
    try {
      const response = await this.notion.databases.create({
        parent: {
          type: "page_id",
          page_id: parentPageId,
        },
        title: [
          {
            type: "text",
            text: {
              content: "단어장",
            },
          },
        ],
        properties: {
          Words: {
            title: {},
          },
          Definition1: {
            rich_text: {},
          },
          Definition2: {
            rich_text: {},
          },
          "Example Sentence": {
            rich_text: {},
          },
          Synonyms: {
            rich_text: {},
          },
          Antonyms: {
            rich_text: {},
          },
        },
      });

      return response.id;
    } catch (error) {
      console.error("Error creating database:", error);
      throw new Error(
        `Failed to create database in page ${parentPageId}: ${error}`,
      );
    }
  }

  async ensureDatabaseExists(): Promise<string> {
    const idType = await this.checkPageOrDatabase(this.dbId);
    
    switch (idType) {
      case "database": {
        // 이미 데이터베이스가 존재함
        return this.dbId;
      }

      case "page": {
        // 페이지에 새 데이터베이스 생성
        console.log(`Creating new database in page: ${this.dbId}`);
        const newDbId = await this.createDatabase(this.dbId);
        
        // Supabase에 새로 생성된 데이터베이스 ID 저장
        if (this.userId && this.userService) {
          try {
            await this.userService.updateDatabaseId(this.userId, newDbId);
            console.log(`Saved database ID to Supabase for user ${this.userId}: ${newDbId}`);
          } catch (error) {
            console.error("Failed to save database ID to Supabase:", error);
            // 저장 실패해도 계속 진행 (데이터베이스는 생성됨)
          }
        }
        
        // 새로 생성된 데이터베이스 ID로 업데이트
        this.dbId = newDbId;
        return newDbId;
      }

      case "not_found": {
        // 자동 복구 로직: originalPageId가 있으면 복구 시도
        if (this.originalPageId && this.originalPageId !== this.dbId) {
          console.log(`Database ${this.dbId} not found. Attempting recovery with original page ID: ${this.originalPageId}`);
          
          const originalPageType = await this.checkPageOrDatabase(this.originalPageId);
          
          if (originalPageType === "page") {
            // 원래 페이지에 새 데이터베이스 생성
            console.log(`Creating new database in original page: ${this.originalPageId}`);
            const newDbId = await this.createDatabase(this.originalPageId);
            
            // Supabase에 새로 생성된 데이터베이스 ID 저장
            if (this.userId && this.userService) {
              try {
                await this.userService.updateDatabaseId(this.userId, newDbId);
                console.log(`Database recovery successful. Saved new database ID to Supabase for user ${this.userId}: ${newDbId}`);
              } catch (error) {
                console.error("Failed to save recovered database ID to Supabase:", error);
                // 저장 실패해도 계속 진행 (데이터베이스는 생성됨)
              }
            }
            
            // 새로 생성된 데이터베이스 ID로 업데이트
            this.dbId = newDbId;
            return newDbId;
          } else {
            console.error(`Original page ${this.originalPageId} not found or not accessible for recovery`);
          }
        }
        
        throw new Error(
          `Page or database not found with ID: ${this.dbId}. Please check the ID and permissions.`,
        );
      }

      default: {
        throw new Error(`Unexpected ID type for ${this.dbId}`);
      }
    }
  }

  async createPage(data: DictionaryResponse) {
    // 데이터베이스 존재 여부 확인 및 필요시 생성
    await this.ensureDatabaseExists();

    // const properties = {
    //   Words: {
    //     title: [
    //       {
    //         text: {
    //           content: data.word,
    //         },
    //       },
    //     ],
    //   },
    //   Definition1: {
    //     rich_text: [
    //       {
    //         text: {
    //           content: data.definition1,
    //         },
    //       },
    //     ],
    //   },
    //   "Example Sentence": {
    //     rich_text: [
    //       {
    //         text: {
    //           content: data.example,
    //         },
    //       },
    //     ],
    //   },
    //   // Definition2는 선택적이므로, data.definition2가 존재할 때만 추가합니다.
    //   ...(data.definition2 && {
    //     Definition2: {
    //       rich_text: [
    //         {
    //           text: {
    //             content: data.definition2,
    //           },
    //         },
    //       ],
    //     },
    //   }),
    //   ...(data.synonyms && {
    //     synonyms: {
    //       rich_text: data.synonyms.map((synonym) => ({
    //         text: {
    //           content: synonym,
    //         },
    //       })),
    //     },
    //   }),
    //   ...(data.antonyms && {
    //     antonyms: {
    //       rich_text: data.antonyms.map((antonym) => ({
    //         text: {
    //           content: antonym,
    //         },
    //       })),
    //     },
    //   }),
    // };
    // properties 객체를 먼저 생성
    const properties: CreatePageParameters["properties"] = {
      Words: {
        title: [
          {
            text: {
              content: data.word,
            },
          },
        ],
      },
      Definition1: {
        rich_text: [
          {
            text: {
              content: data.definition1,
            },
          },
        ],
      },
      "Example Sentence": {
        rich_text: [
          {
            text: {
              content: data.example,
            },
          },
        ],
      },
    };

    // definition2가 null이 아닐 때만 추가
    if (data.definition2 !== null) {
      properties.Definition2 = {
        rich_text: [
          {
            text: {
              content: data.definition2,
            },
          },
        ],
      };
    }
    if (data.synonyms != null) {
      properties.Synonyms = {
        rich_text: [
          {
            text: {
              content: data.synonyms.join(", "),
            },
          },
        ],
      };
    }
    if (data.antonyms != null) {
      properties.Antonyms = {
        rich_text: [
          {
            text: {
              content: data.antonyms.join(", "),
            },
          },
        ],
      };
    }
    const response = await this.notion.pages.create({
      parent: {
        type: "database_id",
        database_id: this.dbId,
      },
      properties: properties,
    }) as PageObjectResponse;
    type NotionProperty = {
      type: "title" | "rich_text";
      title?: Array<{ text: { content: string } }>;
      rich_text?: Array<{ text: { content: string } }>;
    };

    // 헬퍼 함수 생성
    const getPropertyContent = (property: NotionProperty): string | null => {
      if (
        property.type === "title" && property.title && property.title.length > 0
      ) {
        return property.title[0].text.content;
      }
      if (
        property.type === "rich_text" && property.rich_text &&
        property.rich_text.length > 0
      ) {
        return property.rich_text[0].text.content;
      }
      return null;
    };

    // 데이터 할당
    const result = {
      word: getPropertyContent(response.properties.Words as NotionProperty),
      definition1: getPropertyContent(
        response.properties.Definition1 as NotionProperty,
      ),
      definition2: getPropertyContent(
        response.properties.Definition2 as NotionProperty,
      ),
      example: getPropertyContent(
        response.properties["Example Sentence"] as NotionProperty,
      ),
      synonyms: getPropertyContent(
        response.properties.Synonyms as NotionProperty,
      ),
      antonyms: getPropertyContent(
        response.properties.Antonyms as NotionProperty,
      ),
      url: response.url,
    };

    console.log(result);
    return result;
  }
}
