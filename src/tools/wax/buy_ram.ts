import { Asset, Name } from "@wharfkit/antelope";
import { WaxAgentToolkit } from "../../agent";

/**
 * Buy RAM for the agent's account using WAX tokens
 *
 * @param agent - The WaxAgentToolkit instance to use for the transaction
 * @param amount - The amount of WAX tokens to spend on RAM (e.g., "1.0000 WAX")
 * @returns Promise resolving to the transaction result
 * @throws Error if the transaction fails or if the account doesn't have enough WAX
 */
export async function buy_ram(agent: WaxAgentToolkit, amount: Asset) {
  try {
    const account = await agent.get_account(agent.accountName);
    if (!account) {
      throw new Error(`Account ${agent.accountName} not found`);
    }
    return await agent.session.transact({
      action: account.buyRam(amount),
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to buy RAM: ${error.message}`);
    }
    throw new Error("Failed to buy RAM: Unknown error");
  }
}

/**
 * Buy RAM for the agent's account using a specific number of bytes
 *
 * @param agent - The WaxAgentToolkit instance to use for the transaction
 * @param bytes - The number of bytes of RAM to purchase (e.g., 8192 for 8KB)
 * @returns Promise resolving to the transaction result
 * @throws Error if the transaction fails or if the account doesn't have enough WAX
 */
export async function buy_ram_bytes(agent: WaxAgentToolkit, bytes: number) {
  try {
    const account = await agent.get_account(agent.accountName);
    if (!account) {
      throw new Error(`Account ${agent.accountName} not found`);
    }
    return await account.buyRamBytes(bytes);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to buy RAM bytes: ${error.message}`);
    }
    throw new Error("Failed to buy RAM bytes: Unknown error");
  }
}
