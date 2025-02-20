// // const { GoogleGenerativeAI } = require("@google/generative-ai");
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (GEMINI_API_KEY === undefined) throw new Error("GEMINI_API_KEY is not set");

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig: {
    responseMimeType: "application/json",
    // responseSchema: schema,
  },
});

const word = "sunny";

const prompt = `For the given English word, please provide its Korean meanings and related information following the JSON format below. Fill in each field as accurately as possible. If a field does not apply, use \`null\`.

\`\`\`json
{
  "word": string,
  "definition1": string,
  "definition2": string | null,
  "example": string,
  "synonyms": string[] | null,
  "antonyms": string[] | null
}
\`\`\`

**Instructions:**
1. **word**: The provided English word.
2. **definition1**: The primary meaning of the word, including the part of speech (e.g., "(adj)", "(v)").
3. **definition2**: A secondary meaning (if available); if not, set this to \`null\`.
4. **example**: A sentence demonstrating the usage of the word.
5. **synonyms**: An array of synonyms; if there are none, use \`null\`.
6. **antonyms**: An array of antonyms; if there are none, use \`null\`.

**Example:**

Q: complete
A:
\`\`\`json
{
  "word": "complete",
  "definition1": "(adj) 완전한",
  "definition2": "(v) 완료하다",
  "example": "He completed the project on time.",
  "synonyms": ["entire", "whole", "total"],
  "antonyms": ["incomplete", "partial"]
}
\`\`\`

\`\`\`json
{
    "word": "bruntly",
    "definition1": "(adv) 직설적으로",
    "definition2": null,
    "example": "He told me bluntly that he didn't want to see me again.",
    "synonyms": ["bluntly", "frankly", "directly", "candidly", "brusquely"],
    "antonyms": ["tactfully", "diplomatically", "evasively"]
}
\`\`\`

**Task:**

Now, provide the output for the following word:

Q: ${word}
A:
\`\`\`json
{
  "word": ${word},
  "definition1": ...,
  "definition2": ...,
  "example": ...,
  "synonyms": ...,
  "antonyms": ...
}
\`\`\`
`;

const result = await model.generateContent(prompt);
const json = JSON.parse(result.response.text());
console.log(json.word);
