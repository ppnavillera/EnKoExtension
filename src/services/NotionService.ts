import { DictionaryResponse } from "@/types/dictionary";
import { Client } from "@notionhq/client";
import { CreatePageParameters } from "@notionhq/client/build/src/api-endpoints";
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
    if (data.synonyms !== null) {
      properties.Synonyms = {
        rich_text: [
          {
            text: {
              content: data.synonyms.join(","),
            },
          },
        ],
      };
    }
    if (data.antonyms !== null) {
      properties.Antonyms = {
        rich_text: [
          {
            text: {
              content: data.antonyms.join(","),
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
    });
    console.log(response);
  }
}
