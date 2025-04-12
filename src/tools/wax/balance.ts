import { Asset, Name } from "@wharfkit/antelope";
import { WaxAgentToolkit } from "../../agent";

/**
 * Get the balance of WAX or a token for the agent's account
 *
 * @function get_balance
 * @param agent - WaxAgentToolkit instance for blockchain interactions
 * @param tokenContract - Optional token contract name (e.g., "eosio.token"). If not provided, returns WAX balance
 * @param tokenSymbol - Optional token symbol (e.g., "TOKEN"). If not provided, returns WAX balance
 * @returns Promise resolving to the balance as a string (e.g., "100.0000 WAX" or "50.0000 TOKEN")
 * @throws Error if:
 *   - Agent session cannot be created
 *   - Blockchain query fails
 *   - Invalid token contract or symbol provided
 * @example
 * ```typescript
 * // Get WAX balance
 * const waxBalance = await get_balance(agent);
 *
 * // Get token balance
 * const tokenBalance = await get_balance(agent, "eosio.token", "TOKEN");
 * ```
 */
export async function get_balance(
  agent: WaxAgentToolkit,
  tokenContract?: string,
  tokenSymbol?: string,
): Promise<string> {
  try {
    // Get the agent's account name
    const accountName = agent.accountName;
    const session = await agent.get_session();

    // Check if we're getting WAX balance or token balance
    if (!tokenContract || !tokenSymbol) {
      // Get WAX balance
      const balances = await session.client.v1.chain.get_currency_balance(
        Name.from("eosio.token"),
        Name.from(accountName),
        "WAX",
      );

      // Return the balance or "0.0000 WAX" if no balance exists
      return balances[0]?.toString() || "0.00000000 WAX";
    } else {
      // Get token balance
      const balances = await session.client.v1.chain.get_currency_balance(
        Name.from(tokenContract),
        Name.from(accountName),
        tokenSymbol,
      );

      // Return the balance or "0.0000 TOKEN" if no balance exists
      return balances[0]?.toString() || `0.0000 ${tokenSymbol}`;
    }
  } catch (error) {
    console.error("Error getting balance:", error);
    return "0.0000";
  }
}
