import { Asset, Name, APIClient } from "@wharfkit/antelope";
import { WaxAgentToolkit } from "../../agent";
import { Account } from "@wharfkit/account";

/**
 * Buy RAM for the agent's account using WAX tokens
 *
 * @function buy_ram
 * @param agent - The WaxAgentToolkit instance to use for the transaction
 * @param amount - The amount of WAX tokens to spend on RAM (e.g., "1.0000 WAX")
 * @returns Promise resolving to the transaction result containing:
 *   - transaction_id: The ID of the transaction
 *   - processed: Transaction processing details
 *   - block_num: Block number where the transaction was included
 * @throws Error if:
 *   - Account not found
 *   - Insufficient WAX balance
 *   - Transaction fails
 *   - Network connection issues
 * @example
 * ```typescript
 * const result = await buy_ram(agent, Asset.from("1.0000 WAX"));
 * ```
 */
export async function buy_ram(agent: WaxAgentToolkit, amount: Asset) {
  try {
    const rpc_node = await agent.get_node();
    const apiClient = new APIClient({
      url: rpc_node,
    });
    const accountData = await agent.get_account();
    const account = new Account({
      data: accountData,
      client: apiClient,
    });
    const session = await agent.get_session();
    if (!account) {
      throw new Error(`Account ${agent.accountName} not found`);
    }
    return await session.transact({
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
 * @function buy_ram_bytes
 * @param agent - The WaxAgentToolkit instance to use for the transaction
 * @param bytes - The number of bytes of RAM to purchase (must be a positive integer, e.g., 8192 for 8KB)
 * @returns Promise resolving to the transaction result containing:
 *   - transaction_id: The ID of the transaction
 *   - processed: Transaction processing details
 *   - block_num: Block number where the transaction was included
 * @throws Error if:
 *   - Account not found
 *   - Invalid bytes value (non-positive number)
 *   - Insufficient WAX balance
 *   - Transaction fails
 *   - Network connection issues
 * @example
 * ```typescript
 * const result = await buy_ram_bytes(agent, 8192); // Buy 8KB of RAM
 * ```
 */
export async function buy_ram_bytes(agent: WaxAgentToolkit, bytes: number) {
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
    console.log(account.balance());
    if (!account) {
      throw new Error(`Account ${agent.accountName} not found`);
    }
    return await session.transact({
      action: account.buyRamBytes(bytes),
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to buy RAM bytes: ${error.message}`);
    }
    throw new Error("Failed to buy RAM bytes: Unknown error");
  }
}
