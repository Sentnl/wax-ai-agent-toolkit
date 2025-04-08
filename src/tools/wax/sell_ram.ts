import { Asset, Name } from "@wharfkit/antelope";
import { WaxAgentToolkit } from "../../agent";

/**
 * Sell RAM from the agent's account
 *
 * @param agent - The WaxAgentToolkit instance to use for the transaction
 * @param bytes - The number of bytes of RAM to sell (e.g., 8192 for 8KB)
 * @returns Promise resolving to the transaction result
 * @throws Error if:
 *   - The account doesn't exist
 *   - The account doesn't have enough RAM to sell
 *   - The transaction fails
 *   - The RPC request fails
 */
export async function sell_ram(agent: WaxAgentToolkit, bytes: number) {
  try {
    const account = await agent.get_account(agent.accountName);
    if (!account) {
      throw new Error(`Account ${agent.accountName} not found`);
    }
    return await agent.session.transact({
      action: account.sellRam(bytes),
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to sell RAM: ${error.message}`);
    }
    throw new Error("Failed to sell RAM: Unknown error");
  }
}
