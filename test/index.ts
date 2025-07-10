import { WaxAgentToolkit } from "../src";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as readline from "readline";
import { createWaxTools } from "../src/langchain";
import { Network, NodeType } from "../src/types";
import stateManager from "./stateManager";
import chalk from "pretty-chalk";

dotenv.config();

/**
 * Validates that all required environment variables are set and have valid values
 *
 * @throws {Error} If any required environment variables are missing or invalid
 */
function validateEnvironment(): void {
  const missingVars: string[] = [];
  const requiredVars = [
    "OPENAI_API_KEY",
    "RPC_URL",
    "PRIVATE_KEY",
    "ACCOUNT_NAME",
    "CHAIN_ID",
  ];

  requiredVars.forEach((varName) => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    console.error("Error: Required environment variables are not set");
    missingVars.forEach((varName) => {
      console.error(`${varName}=your_${varName.toLowerCase()}_here`);
    });
    process.exit(1);
  }
}

validateEnvironment();

/**
 * Initializes the WAX agent with necessary configurations
 *
 * @returns {Promise<{agent: any, config: AgentConfig}>} The initialized agent and its configuration
 * @throws {Error} If initialization fails
 */
async function initializeAgent() {
  try {
    const llm = new ChatOpenAI({
      modelName: "gpt-4o-mini",
      temperature: 0.3,
    });

    const waxAgent = new WaxAgentToolkit(
      process.env.PRIVATE_KEY!,
      process.env.ACCOUNT_NAME!,
      process.env.CHAIN_ID!,
      (process.env.NODETYPE as NodeType) || "mainnet",
      (process.env.NETWORK as Network) || "wax",
      {
        OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
      },
    );

    const tools = createWaxTools(waxAgent);

    const memory = new MemorySaver();
    const config = {
      configurable: { thread_id: "Wax Agent Kit!" },
      recursionLimit: 100,
    };

    const agent = createReactAgent({
      llm,
      tools,
      checkpointSaver: memory,
      messageModifier: new SystemMessage(`
        You are a helpful agent that can interact onchain using the Wax Agent Tool Kit. You are
        empowered to interact onchain using your tools. Analyze the user's choice, select the appropriate tool, extract the parameters.
        If the user's choice is not clear, ask for more information. Once the user's choice is clear, select the appropriate tool, extract the parameters,then execute the tool and return the result.
        Here's the available tools: balance, transfer, buy_ram, sell_ram, get_account_info, execute_action, list_actions, list_table, read_table
      `),
    });

    return { agent, config };
  } catch (error) {
    console.error("Failed to initialize agent:", error);
    throw new Error(
      `Agent initialization failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Runs the agent in interactive chat mode
 *
 * @param agent - The LangChain agent instance
 * @param config - Agent configuration object
 * @returns Promise that resolves when the user exits
 */
async function runChatMode(agent: any, config: any) {

  chalk.green("Starting chat mode... Type 'exit' to end.");
  console.log(
    "Available commands: balance, transfer, buy_ram, sell_ram, get_account_info, execute_action, list_actions, list_table, read_table", "alcorswap",
  );

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (prompt: string): Promise<string> =>
    new Promise((resolve) => rl.question(prompt, resolve));

  try {
    while (true) {
      const userInput = await question("\nPrompt: ");

      if (userInput.toLowerCase() === "exit") {
        console.log("Exiting chat mode...");
        break;
      }

      const response = await await agent.invoke(
        {
          messages: [new HumanMessage(userInput)],
        },
        config,
      );

      const lastMessage = response.messages[response.messages.length - 1];
      console.log("\nChatbot:", lastMessage.content);

      // Display summary if a tool was successfully executed
      const userChoices = stateManager.getUserChoices();
      if (
        userChoices.action &&
        lastMessage.content.includes("Successfully processed")
      ) {
        console.log(lastMessage.content);
        // Clear choices for the next interaction
        stateManager.clearUserChoices();
      }
    }
  } catch (error) {
    console.error(
      "Error in chat mode:",
      error instanceof Error ? error.message : "Unknown error",
    );
    process.exit(1);
  } finally {
    rl.close();
  }
}

/**
 * Main function that initializes and runs the agent
 *
 * @throws {Error} If initialization or execution fails
 */
async function main() {
  try {
    console.log("Starting Agent...");
    const { agent, config } = await initializeAgent();
    await runChatMode(agent, config);
  } catch (error) {
    console.error(
      "Fatal error:",
      error instanceof Error ? error.message : "Unknown error",
    );
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error(
      "Fatal error:",
      error instanceof Error ? error.message : "Unknown error",
    );
    process.exit(1);
  });
}
