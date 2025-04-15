import { ABI } from "@wharfkit/antelope";
import { ContractKit, Contract } from "@wharfkit/contract";
import { Session } from "@wharfkit/session";
import { WaxAgentToolkit } from "../../agent";

/**
 * Reads data from a specific table in a smart contract on the WAX blockchain.
 *
 * This function allows querying and retrieving data from a specific table within a smart contract.
 * It's particularly useful for:
 * - Reading contract state
 * - Querying specific data entries
 * - Debugging and development purposes
 *
 * @function contract_read_table
 * @param {WaxAgentToolkit} agent - The WaxAgentToolkit instance configured for blockchain interactions
 * @param {string} contract_name - The name of the contract to query (e.g., "eosio.token", "atomicassets")
 * @param {string} table_name - The name of the table to read from
 * @returns {Promise<any>} A promise that resolves to the table data. The structure of the returned data
 *                        depends on the contract's table definition and can include various types of data.
 * @throws {Error} If:
 *   - The contract name is empty
 *   - The table name is empty
 *   - The contract does not exist on the blockchain
 *   - The table does not exist in the contract
 *   - There are network connectivity issues
 * @example
 * ```typescript
 * // Read the accounts table from eosio.token contract
 * const accountData = await contract_read_table(agent, "eosio.token", "accounts");
 * console.log(accountData);
 * // Output: Array of account objects with balances
 *
 * // Read the assets table from atomicassets contract
 * const nftData = await contract_read_table(agent, "atomicassets", "assets");
 * console.log(nftData);
 * // Output: Array of NFT asset objects
 * ```
 */
export async function contract_read_table(
  agent: WaxAgentToolkit,
  contract_name: string,
  table_name: string,
): Promise<any> {
  if (contract_name.trim() === "") {
    throw new Error("Contract name must be a non-empty string");
  }
  if (table_name.trim() === "") {
    throw new Error("Table name must be a non-empty string");
  }

  try {
    const session: Session = await agent.get_session();
    const contractKit: ContractKit = new ContractKit(session);
    const contract: Contract = await contractKit.load(contract_name);

    // Verify the table exists in the contract before attempting to read it
    if (!contract.hasTable(table_name)) {
      throw new Error(
        `Table "${table_name}" not found in contract "${contract_name}"`,
      );
    }

    return contract.table(table_name).all();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Failed to read table "${table_name}" from contract "${contract_name}": ${error.message}`,
      );
    }
    throw new Error(
      `Failed to read table "${table_name}" from contract "${contract_name}": Unknown error occurred`,
    );
  }
}
