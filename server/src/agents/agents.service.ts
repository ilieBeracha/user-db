import { Injectable } from "@nestjs/common";
import { UserDbService } from "src/user-db/user-db.service";
import { ChatOpenAI, convertPromptToOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
@Injectable()
export class AgentsService {
  protected llm: ChatOpenAI;
  protected prompt: ChatPromptTemplate;
  protected systemPrompt: string;
  constructor(private readonly userDbService: UserDbService) {
    this.llm = new ChatOpenAI({
      modelName: "gpt-4o-mini",
      temperature: 0.1,
      maxTokens: 4000,
      apiKey: process.env.OPENAI_API_KEY,
    });

    this.systemPrompt = `
    You are a helpful assistant that can help with database queries.
    You will be given a query and a schema.
    The schema is in the following format: {schema}
    
    IMPORTANT: Do not use markdown formatting in your responses. Return plain text only.`;
  }

  async executeDirectQuery(query: string, userId: string) {
    const schema =
      await this.userDbService.getSchemaExplorerAcrossDatabases(userId);
    this.prompt = ChatPromptTemplate.fromMessages([
      ["system", this.systemPrompt],
      ["user", "{query}"],
    ]);
    const prompt = await this.prompt.format({ query: query, schema: schema });

    const result = await this.llm
      .withStructuredOutput(
        z.object({
          message: z
            .object({
              role: z.literal("assistant").describe("The role of the message"),
              content: z.string().describe("The content of the message"),
            })
            .describe("The message to be returned to the user"),
          query: z.string().describe("The query to be executed"),
          result: z
            .string()
            .describe(
              "The result of the query as a JSON.stringify() format, make sure to return the result in a valid JSON format. Do not use markdown formatting in your responses. Return plain text only. Do not use ```json or ``` in your responses. Do not use ``` in your responses."
            ),
        })
      )
      .invoke(prompt);
    return result;
  }
}
