import { Asset, Name, APIClient } from "@wharfkit/antelope";
import { Account } from "@wharfkit/account";
import { WaxAgentToolkit } from "../../agent";

/**
 * Sell RAM from the agent's account
 *
 * @function sell_ram
 * @param agent - The WaxAgentToolkit instance to use for the transaction
 * @param bytes - The number of bytes of RAM to sell (must be a positive integer, e.g., 8192 for 8KB)
 * @returns Promise resolving to the transaction result containing:
 *   - transaction_id: The ID of the transaction
 *   - processed: Transaction processing details
 *   - block_num: Block number where the transaction was included
 * @throws Error if:
 *   - Account not found
 *   - Invalid bytes value (non-positive number)
 *   - Insufficient RAM to sell
 *   - Transaction fails
 *   - Network connection issues
 * @example
 * ```typescript
 * // Sell 8KB of RAM
 * const result = await sell_ram(agent, 8192);
 * ```
 */
export async function sell_ram(agent: WaxAgentToolkit, bytes: number) {
  try {
    const rpc_node = await agent.get_node();
    const apiClient = new APIClient({
      url: rpc_node,
    });
    const accountData = await agent.get_account(agent.accountName);
    const account = new Account({
      data: accountData,
      client: apiClient,
    });
    const session = await agent.get_session();
    if (!account) {
      throw new Error(`Account ${agent.accountName} not found`);
    }
    return await session.transact({
      action: account.sellRam(bytes),
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to sell RAM: ${error.message}`);
    }
    throw new Error("Failed to sell RAM: Unknown error");
  }
}
