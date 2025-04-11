import { WaxAgentToolkit } from "../src";
import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as readline from "readline";
import { createWaxTools } from "../src/langchain";
import { Network, NodeType } from "../src/types";

dotenv.config();

/**
 * Validates that all required environment variables are set
 *
 * @function validateEnvironment
 * @throws Error if any required environment variables are missing
 * @returns void
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
 * @function initializeAgent
 * @returns Promise resolving to an object containing:
 *   - agent: The configured LangChain agent
 *   - config: Agent configuration object
 * @throws Error if:
 *   - OpenAI API key is invalid
 *   - WAX agent initialization fails
 *   - Tool creation fails
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
      process.env.NODETYPE as NodeType,
      process.env.NETWORk as Network,
      {
        OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
      },
    );

    const tools = createWaxTools(waxAgent);

    const memory = new MemorySaver();
    const config = { configurable: { thread_id: "Wax Agent Kit!" } };

    const agent = createReactAgent({
      llm,
      tools,
      checkpointSaver: memory,
      messageModifier: `
        You are a helpful agent that can interact onchain using the Wax Agent Tool Kit. You are
        empowered to interact onchain using your tools. If there is a 5XX
        (internal) HTTP error code, ask the user to try again later. If someone asks you to do something you
        can't do with your currently available tools, you must say so, and encourage them to implement. Be
        concise and helpful with your responses. Refrain from restating your tools' descriptions unless it is explicitly requested.
      `,
    });

    return { agent, config };
  } catch (error) {
    console.error("Failed to initialize agent:", error);
    throw error;
  }
}

/**
 * Runs the agent in autonomous mode, executing blockchain actions at regular intervals
 *
 * @function runAutonomousMode
 * @param agent - The LangChain agent instance
 * @param config - Agent configuration object
 * @param interval - Time interval between actions in seconds (default: 10)
 * @returns Promise that resolves when the process is terminated
 * @throws Error if agent execution fails
 */
async function runAutonomousMode(agent: any, config: any, interval = 10) {
  console.log("Starting autonomous mode...");

  while (true) {
    try {
      const thought =
        "Be creative and do something interesting on the blockchain. " +
        "Choose an action or set of actions and execute it that highlights your abilities.";

      const stream = await agent.stream(
        { messages: [new HumanMessage(thought)] },
        config,
      );

      for await (const chunk of stream) {
        if ("agent" in chunk) {
          console.log(chunk.agent.messages[0].content);
        } else if ("tools" in chunk) {
          console.log(chunk.tools.messages[0].content);
        }
        console.log("-------------------");
      }

      await new Promise((resolve) => setTimeout(resolve, interval * 1000));
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error:", error.message);
      }
      process.exit(1);
    }
  }
}

/**
 * Runs the agent in interactive chat mode
 *
 * @function runChatMode
 * @param agent - The LangChain agent instance
 * @param config - Agent configuration object
 * @returns Promise that resolves when the user exits
 * @throws Error if agent execution fails
 */
async function runChatMode(agent: any, config: any) {
  console.log("Starting chat mode... Type 'exit' to end.");

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
        break;
      }

      const stream = await agent.stream(
        { messages: [new HumanMessage(userInput)] },
        config,
      );

      for await (const chunk of stream) {
        if ("agent" in chunk) {
          console.log(chunk.agent.messages[0].content);
        } else if ("tools" in chunk) {
          console.log(chunk.tools.messages[0].content);
        }
        console.log("-------------------");
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    }
    process.exit(1);
  } finally {
    rl.close();
  }
}

/**
 * Prompts the user to choose between chat and autonomous modes
 *
 * @function chooseMode
 * @returns Promise resolving to either "chat" or "auto"
 */
async function chooseMode(): Promise<"chat" | "auto"> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (prompt: string): Promise<string> =>
    new Promise((resolve) => rl.question(prompt, resolve));

  while (true) {
    console.log("\nAvailable modes:");
    console.log("1. chat    - Interactive chat mode");
    console.log("2. auto    - Autonomous action mode");

    const choice = (await question("\nChoose a mode (enter number or name): "))
      .toLowerCase()
      .trim();

    rl.close();

    if (choice === "1" || choice === "chat") {
      return "chat";
    } else if (choice === "2" || choice === "auto") {
      return "auto";
    }
  }
}

/**
 * Main function that initializes and runs the agent
 *
 * @function main
 * @returns Promise that resolves when the program exits
 * @throws Error if initialization or execution fails
 */
async function main() {
  try {
    console.log("Starting Agent...");
    const { agent, config } = await initializeAgent();
    const mode = await chooseMode();

    console.log("mode", mode);
    if (mode === "chat") {
      await runChatMode(agent, config);
    } else {
      await runAutonomousMode(agent, config);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}
