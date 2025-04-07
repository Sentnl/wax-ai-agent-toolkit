import { Asset, Name } from "@wharfkit/antelope";
import { WaxAgentToolkit } from "../../agent";

/**
 * Get the balance of WAX or a token for the agent's account
 * @param agent - WaxAgentToolkit instance
 * @param tokenContract - Optional token contract name. If not provided, returns WAX balance
 * @param tokenSymbol - Optional token symbol. If not provided, returns WAX balance
 * @returns Promise resolving to the balance as a string (e.g., "100.0000 WAX" or "50.0000 TOKEN")
 */
export async function get_balance(
  agent: WaxAgentToolkit,
  tokenContract?: string,
  tokenSymbol?: string,
): Promise<string> {
  try {
    // Get the agent's account name
    const accountName = agent.accountName;

    // Check if we're getting WAX balance or token balance
    if (!tokenContract || !tokenSymbol) {
      // Get WAX balance
      const balances = await agent.session.client.v1.chain.get_currency_balance(
        Name.from("eosio.token"),
        Name.from(accountName),
        "WAX",
      );

      // Return the balance or "0.0000 WAX" if no balance exists
      return balances[0]?.toString() || "0.0000 WAX";
    } else {
      // Get token balance
      const balances = await agent.session.client.v1.chain.get_currency_balance(
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
