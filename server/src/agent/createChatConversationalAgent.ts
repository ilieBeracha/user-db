import { ChatOpenAI } from "@langchain/openai";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { createOpenAIFunctionsAgent, AgentExecutor } from "langchain/agents";
import { Tool } from "@langchain/core/tools";
import { ConfigService } from "@nestjs/config";
import { BufferMemory } from "langchain/memory";
import { RunnableSequence } from "@langchain/core/runnables";

const configService = new ConfigService();

export async function createChatConversationalAgent(
  tools: Tool[],
  verbose = false,
  options?: {
    memory?: BufferMemory;
    maxIterations?: number;
    systemMessage?: string;
  },
): Promise<AgentExecutor> {
  const llm = new ChatOpenAI({
    temperature: 0.1,
    modelName: "gpt-4-turbo-preview",
    openAIApiKey: configService.get("OPENAI_API_KEY"),
    streaming: false,
  });

  const systemMessage =
    options?.systemMessage ||
    `You are an expert database assistant that helps users interact with their PostgreSQL database.

CAPABILITIES:
- Generate and execute SQL queries from natural language
- Provide database schema information
- Execute custom SQL queries
- Explain query results and database concepts
- Remember conversation context

GUIDELINES:
- Always be helpful and provide clear explanations
- Use tools to access real database information
- When users ask about data, use the generate_sql tool
- When users ask about database structure, use the get_database_schema tool
- When users provide SQL, use the execute_sql_query tool
- Provide context and explanations with your responses
- Be conversational but professional
- If you're unsure about something, ask for clarification`;

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", systemMessage],
    new MessagesPlaceholder("chat_history"),
    ["human", "{input}"],
    new MessagesPlaceholder("agent_scratchpad"),
  ]);

  const agent = await createOpenAIFunctionsAgent({
    llm,
    tools,
    prompt,
  });

  const executor = new AgentExecutor({
    agent,
    tools,
    verbose,
    maxIterations: options?.maxIterations || 3,
    returnIntermediateSteps: verbose,
    handleParsingErrors: true,
  });

  return executor;
}

export async function createOptimizedAgentChain(
  tools: Tool[],
  systemPrompt?: string,
): Promise<RunnableSequence> {
  const llm = new ChatOpenAI({
    temperature: 0.1,
    modelName: "gpt-4-turbo-preview",
    openAIApiKey: configService.get("OPENAI_API_KEY"),
  });

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt || "You are a helpful database assistant."],
    new MessagesPlaceholder("chat_history"),
    ["human", "{input}"],
  ]);

  return RunnableSequence.from([prompt, llm]);
}
