import { Client } from "npm:@notionhq/client";
import {
  CreatePageParameters,
  PageObjectResponse,
} from "npm:@notionhq/client/build/src/api-endpoints";
import { DictionaryResponse } from "../types/dictionary.ts";
// import { PageObjectResponse } from "npm:@notionhq/client";

interface NotionProperties {
  Words: {
    title: Array<{
      text: {
        content: string;
      };
    }>;
  };
  Definition1: {
    rich_text: Array<{
      text: {
        content: string;
      };
    }>;
  };
  Definition2?: {
    // optional property로 정의
    rich_text: Array<{
      text: {
        content: string;
      };
    }>;
  };
  "Example Sentence": {
    rich_text: Array<{
      text: {
        content: string;
      };
    }>;
  };
}
export class NotionService {
  private notion: Client;
  private dbId: string;

  constructor(apiKey: string, dbId: string) {
    this.notion = new Client({ auth: apiKey });
    this.dbId = dbId;
  }

  async createPage(data: DictionaryResponse) {
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
    };

    console.log(result);
    return result;
  }
}
