import { ABI, Action } from "@wharfkit/antelope";
import { Contract, ContractKit } from "@wharfkit/contract";
import { Session, TransactResult } from "@wharfkit/session";
import { WaxAgentToolkit } from "../../agent";

/**
 * Executes an action on a smart contract on the WAX blockchain
 *
 * @function contract_execute_action
 * @param {WaxAgentToolkit} agent - The WAX agent toolkit instance for blockchain interactions
 * @param {string} contract_name - The name of the smart contract (e.g., "eosio.token")
 * @param {string} action_name - The name of the action to execute (e.g., "transfer")
 * @param {Record<string, any>} data - The action parameters as a key-value object
 * @returns {Promise<TransactResult>} A promise that resolves to the transaction result
 * @throws {Error} When:
 *   - The action name is not found in the contract
 *   - The contract cannot be loaded
 *   - The transaction fails
 *   - Network connectivity issues occur
 * @example
 * ```typescript
 * // Transfer WAX tokens
 * const result = await contract_execute_action(agent, "eosio.token", "transfer", {
 *   from: "eosio.token",
 *   to: "sentnltestin",
 *   quantity: "1.0000 WAX",
 *   memo: "test transfer"
 * });
 * ```
 */
export async function contract_execute_action(
  agent: WaxAgentToolkit,
  contract_name: string,
  action_name: string,
  data: any,
): Promise<TransactResult> {
  try {
    const session: Session = await agent.get_session();
    const contractKit: ContractKit = new ContractKit(session);
    const contract: Contract = await contractKit.load(contract_name);

    if (!contract.hasAction(action_name)) {
      throw new Error(
        `Action "${action_name}" not found in contract "${contract_name}"`,
      );
    }

    const action: Action = contract.action(action_name, data, {
      authorization: [
        {
          actor: agent.accountName,
          permission: "active", // Changed from "asset_id" to "active" which is the standard permission level
        },
      ],
    });
    console.log(JSON.stringify(action));
    return await session.transact({ action });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Failed to execute action "${action_name}" on contract "${contract_name}": ${error.message}`,
      );
    }
    throw new Error(
      `Unexpected error while executing action "${action_name}" on contract "${contract_name}"`,
    );
  }
}
