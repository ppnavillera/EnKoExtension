import dotenv from "dotenv";

dotenv.config();

interface Config {
  NOTION_API_KEY: string;
  NOTION_DATABASE_ID: string;
  GEMINI_API_KEY: string;
}

export const config: Config = {
  NOTION_API_KEY: process.env.NOTION_API_KEY || "",
  NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID || "",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
};

// 필수 환경변수 검증
Object.entries(config).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`${key} is not set in environment variables`);
  }
});
