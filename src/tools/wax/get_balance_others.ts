import { Name, Asset } from "@wharfkit/antelope";
import { WaxAgentToolkit } from "../../agent";

/**
 * Get the balance of WAX or a token for the specified account (other than the agent's account)
 * @param agent - WaxAgentToolkit instance
 * @param account_name - Name of the account to check balance for
 * @param token_contract - Optional token contract name. If not provided, returns WAX balance
 * @param token_symbol - Optional token symbol. Required if token_contract is provided
 * @returns Promise resolving to the balance as a string (e.g., "100.0000 WAX") or "0.0000" if account doesn't exist
 */
export async function get_balance_other(
  agent: WaxAgentToolkit,
  account_name: string,
  token_contract?: string,
  token_symbol?: string,
): Promise<string> {
  try {
    const account = Name.from(account_name);

    // If token contract and symbol are provided, get token balance
    if (token_contract && token_symbol) {
      const balances = await agent.session.client.v1.chain.get_currency_balance(
        Name.from(token_contract),
        account,
        token_symbol,
      );

      return balances[0]?.toString() || "0.0000";
    }

    // Otherwise get WAX balance
    const balances = await agent.session.client.v1.chain.get_currency_balance(
      Name.from("eosio.token"),
      account,
      "WAX",
    );

    return balances[0]?.toString() || "0.0000";
  } catch (error) {
    throw new Error(
      `Error fetching on-chain balance for ${account_name}${token_contract ? ` and token ${token_symbol}@${token_contract}` : ""}: ${error}`,
    );
  }
}
