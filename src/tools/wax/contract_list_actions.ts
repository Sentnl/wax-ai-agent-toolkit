import { ABI } from "@wharfkit/antelope";
import { ContractKit, Contract } from "@wharfkit/contract";
import { Session } from "@wharfkit/session";
import { WaxAgentToolkit } from "../../agent";

/**
 * Get the list of actions for a contract
 *
 * @function contract_list_action
 * @param agent - WaxAgentToolkit instance for blockchain interactions
 * @param account_name - Name of the account to check balance for (e.g., "sentnltestin")
 * @returns Promise resolving to the list of actions
 * @throws Error if:
 *   - Account name is invalid
 *   - Blockchain query fails
 *   - Network connection issues
 * @example
 * ```typescript
 * // Get list of actions
 * const actions = await contract_list_action(agent, "eosio.token");
 * ```
 */
export async function contract_list_action(
  agent: WaxAgentToolkit,
  contract_name: string,
): Promise<ABI.Action[]> {
  try {
    const session: Session = await agent.get_session();
    const contractKit: ContractKit = new ContractKit(session);
    const contract: Contract = await contractKit.load(contract_name);
    // If token contract and symbol are provided, get token balance
    return contract.abi.actions;
  } catch (error) {
    throw new Error(
      `Error fetching contract actions for ${contract_name}: ${error}`,
    );
  }
}
