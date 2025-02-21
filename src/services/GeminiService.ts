// // const { GoogleGenerativeAI } = require("@google/generative-ai");
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        responseMimeType: "application/json",
        // responseSchema: schema,
      },
    });
  }

  async getDefinition(word: string) {
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
    const result = await this.model.generateContent(prompt);
    const json = JSON.parse(result.response.text());
    return json;
  }
}
