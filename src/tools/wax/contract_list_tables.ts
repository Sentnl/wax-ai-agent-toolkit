import { ABI } from "@wharfkit/antelope";
import { ContractKit, Contract } from "@wharfkit/contract";
import { Session } from "@wharfkit/session";
import { WaxAgentToolkit } from "../../agent";

/**
 * Retrieves the list of table names defined in a smart contract.
 *
 * @function contract_list_tables
 * @param {WaxAgentToolkit} agent - The WaxAgentToolkit instance configured for blockchain interactions
 * @param {string} contract_name - The name of the contract to query (e.g., "eosio.token", "atomicassets")
 * @returns {Promise<string[]>} A promise that resolves to an array of table names defined in the contract
 * @throws {Error} If:
 *   - The contract name is empty or invalid
 *   - The agent is not properly configured
 *   - The contract does not exist on the blockchain
 *   - There are network connectivity issues
 *   - The contract has no tables defined
 * @example
 * ```typescript
 * // Get list of table names for a token contract
 * const tableNames = await contract_list_tables(agent, "eosio.token");
 * console.log(tableNames);
 * // Output: ["accounts", "stat"]
 *
 * // Get list of table names for an NFT contract
 * const nftTableNames = await contract_list_tables(agent, "atomicassets");
 * console.log(nftTableNames);
 * // Output: ["assets", "schemas", "templates", ...]
 * ```
 */

export async function contract_list_tables(
  agent: WaxAgentToolkit,
  contract_name: string,
): Promise<any> {
  if (contract_name.trim() === "") {
    throw new Error("Contract name must be a non-empty string");
  }

  if (!agent) {
    throw new Error("Agent instance is required");
  }

  try {
    const session: Session = await agent.get_session();
    const contractKit: ContractKit = new ContractKit(session);
    const contract: Contract = await contractKit.load(contract_name);

    if (contract.tableNames.length === 0) {
      throw new Error(`Contract ${contract_name} has no tables`);
    }

    return contract.abi.tables;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Failed to fetch contract tables for ${contract_name}: ${error.message}`,
      );
    }
    throw new Error(
      `Failed to fetch contract tables for ${contract_name}: Unknown error occurred`,
    );
  }
}
