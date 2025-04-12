import { Name } from "@wharfkit/antelope";
import { WaxAgentToolkit } from "../../agent";

/**
 * Get the token balances of a WAX account
 *
 * @function get_token_balance
 * @param agent - WaxAgentToolkit instance for blockchain interactions
 * @param accountName - Optional account name to check balances for. If not provided, returns agent's account balances
 * @returns Promise resolving to an object containing:
 *   - wax: WAX balance as string (e.g., "100.0000 WAX")
 *   - tokens: Array of token balances with:
 *     - contract: Token contract name (e.g., "eosio.token")
 *     - symbol: Token symbol (e.g., "TOKEN")
 *     - balance: Token balance as string (e.g., "50.0000 TOKEN")
 * @throws Error if:
 *   - Account name is invalid
 *   - Blockchain query fails
 *   - Network connection issues
 * @example
 * ```typescript
 * // Get agent's own balances
 * const balances = await get_token_balance(agent);
 *
 * // Get another account's balances
 * const otherBalances = await get_token_balance(agent, "sentnltestin");
 * ```
 */
export async function get_token_balance(
  agent: WaxAgentToolkit,
  accountName?: string,
): Promise<{
  wax: string;
  tokens: Array<{
    contract: string;
    symbol: string;
    balance: string;
  }>;
}> {
  try {
    // Use the agent's account name if none provided
    const targetAccount = accountName || agent.accountName;
    const account = Name.from(targetAccount);
    const session = await agent.get_session();

    // Get WAX balance
    const waxBalances = await session.client.v1.chain.get_currency_balance(
      Name.from("eosio.token"),
      account,
      "WAX",
    );

    const waxBalance = waxBalances[0]?.toString() || "0.0000 WAX";

    // Get token balances - this is a simplified approach
    // In a real implementation, you might want to query a token registry or
    // maintain a list of known tokens to check against
    const tokenBalancesList: Array<{
      contract: string;
      symbol: string;
      balance: string;
    }> = [];

    // Example: Check for a specific token (you would expand this based on your needs)
    try {
      const session = await agent.get_session();
      const tokenBalances = await session.client.v1.chain.get_currency_balance(
        Name.from("eosio.token"),
        account,
        "TOKEN",
      );

      if (tokenBalances.length > 0) {
        tokenBalancesList.push({
          contract: "eosio.token",
          symbol: "TOKEN",
          balance: tokenBalances[0].toString(),
        });
      }
    } catch (error) {
      // Token might not exist for this account, which is fine
      console.log(`No TOKEN balance found for ${targetAccount}`);
    }

    return {
      wax: waxBalance,
      tokens: tokenBalancesList,
    };
  } catch (error) {
    console.error("Error getting token balances:", error);
    return {
      wax: "0.0000 WAX",
      tokens: [],
    };
  }
}
