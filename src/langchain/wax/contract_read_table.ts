import { Tool } from "langchain/tools";
import { WaxAgentToolkit } from "../../agent";
import { contract_list_tables } from "../../tools/wax";

/**
 * Tool for listing all available tables of a smart contract on the WAX blockchain
 *
 * This tool allows users to query and retrieve all available tables that can be accessed
 * on a specific smart contract. It's particularly useful for:
 * - Discovering available contract functionality
 * - Understanding contract capabilities
 * - Debugging and development purposes
 *
 * @class WaxContractListTablesTool
 * @extends Tool
 * @property {string} name - Tool identifier
 * @property {string} description - Detailed description of the tool's functionality
 * @property {WaxAgentToolkit} waxToolKit - Instance of WaxAgentToolkit for blockchain interactions
 */
export class WaxContractListTablesTool extends Tool {
  /** Tool identifier */
  name = "wax_contract_list_tables";

  /** Detailed description of the tool's functionality */
  description = `List all available tables of a smart contract on the WAX blockchain.
  
    This tool should be used when you need to:
    - View all available tables of a contract
    - Understand what operations a contract supports
    - Debug contract interactions
    
    Input format:
    {
      "contract_name": "string"  // The name of the contract to query (e.g., "eosio.token")
    }
    
    Examples:
    1. List tables of eosio.token contract:
       {"contract_name":"eosio.token"}
    
    2. List tables of a custom contract:
       {"contract_name":"mycontract"}`;

  /**
   * Creates a new instance of WaxContractListTablesTool
   * @param waxToolKit - Instance of WaxAgentToolkit for blockchain interactions
   */
  constructor(private waxToolKit: WaxAgentToolkit) {
    super();
  }

  /**
   * Executes the list tables operation for a specified contract
   * @param input - JSON string containing:
   *   - contract_name: Name of the contract to list tables for (required)
   * @returns Promise resolving to a JSON string containing:
   *   - status: "success" or "error"
   *   - message: Success or error message
   *   - tables: Array of contract tables with their details
   *   - code: Error code (if error occurred)
   * @throws Error if:
   *   - Input JSON parsing fails
   *   - Required contract_name parameter is missing
   *   - Contract name is invalid or not found
   *   - Network or blockchain interaction fails
   */
  protected async _call(input: string): Promise<string> {
    try {
      const params = JSON.parse(input);

      if (!params.contract_name) {
        throw new Error(
          "Missing required parameter: contract_name. Please provide the name of the contract to query.",
        );
      }

      if (typeof params.contract_name !== "string") {
        throw new Error("Invalid contract_name parameter. Must be a string.");
      }

      const result = await contract_list_tables(
        this.waxToolKit,
        params.contract_name,
      );

      if (!result || result.length === 0) {
        return JSON.stringify({
          status: "success",
          message: `No tables found for contract ${params.contract_name}`,
          tables: [],
        });
      }

      return JSON.stringify({
        status: "success",
        message: `Successfully retrieved ${result.length} tables for contract ${params.contract_name}`,
        tables: result,
      });
    } catch (error: any) {
      return JSON.stringify({
        status: "error",
        message: error.message || "Failed to list contract tables",
        code: error.code || "UNKNOWN_ERROR",
        details: error.details || null,
      });
    }
  }
}
