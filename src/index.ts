import { Client } from "@notionhq/client";
import dotenv from "dotenv";

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const DB_ID = process.env.NOTION_DATABASE_ID;

if (!DB_ID) {
  throw new Error("NOTION_API_KEY 환경 변수가 설정되지 않았습니다.");
}

// ()();

const createPage = async () => {
  const response = await notion.pages.create({
    parent: {
      type: "database_id",
      database_id: DB_ID,
    },
    properties: {
      Words: {
        title: [
          {
            text: {
              content: "New Media Article",
            },
          },
        ],
      },
      Definition1: {
        rich_text: [
          {
            text: {
              content: "A dark green leafy vegetable",
            },
          },
        ],
      },
      Definition2: {
        rich_text: [
          {
            text: {
              content: "A dark green leafy vegetable",
            },
          },
        ],
      },
      "Example Sentence": {
        rich_text: [
          {
            text: {
              content: "A dark green leafy vegetable",
            },
          },
        ],
      },
    },
    children: [
      {
        object: "block",
        heading_2: {
          rich_text: [
            {
              text: {
                content: "Lacinato kale",
              },
            },
          ],
        },
      },
      {
        object: "block",
        paragraph: {
          rich_text: [
            {
              text: {
                content:
                  "Lacinato kale is a variety of kale with a long tradition in Italian cuisine, especially that of Tuscany. It is also known as Tuscan kale, Italian kale, dinosaur kale, kale, flat back kale, palm tree kale, or black Tuscan palm.",
                link: {
                  url: "https://en.wikipedia.org/wiki/Lacinato_kale",
                },
              },
            },
          ],
          color: "default",
        },
      },
    ],
  });
  console.log(response);
};
