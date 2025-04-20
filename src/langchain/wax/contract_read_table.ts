import { Tool } from "langchain/tools";
import { WaxAgentToolkit } from "../../agent";
import { contract_list_tables, contract_read_table } from "../../tools/wax";

/**
 * Tool for reading a table of a smart contract on the WAX blockchain
 *
 * This tool allows users to query and retrieve a table that can be accessed
 * on a specific smart contract. It's particularly useful for:
 * - Discovering available contract functionality
 * - Understanding contract capabilities
 * - Debugging and development purposes
 *
 * @class WaxContractReadTableTool
 * @extends Tool
 * @property {string} name - Tool identifier
 * @property {string} description - Detailed description of the tool's functionality
 * @property {WaxAgentToolkit} waxToolKit - Instance of WaxAgentToolkit for blockchain interactions
 */
export class WaxContractReadTableTool extends Tool {
  /** Tool identifier */
  name = "wax_contract_read_table";

  /** Detailed description of the tool's functionality */
  description = `Read a table of a smart contract on the WAX blockchain.
  
    This tool should be used when you need to:
    - Read a table of a contract
    - Understand what operations a contract supports
    - Debug contract interactions
    
    Input format:
    {
      "contract_name": "string"  // The name of the contract to query (e.g., "eosio.token")
      "table_name": "string"  // The name of the table to read (e.g., "accounts")
    }
    
    Examples:
    1. Read table of eosio.token contract:
       {"contract_name":"eosio.token", "table_name":"accounts"}
    
    2. Read table of a custom contract:
       {"contract_name":"mycontract", "table_name":"mytable"}`;

  /**
   * Creates a new instance of WaxContractReadTableTool
   * @param waxToolKit - Instance of WaxAgentToolkit for blockchain interactions
   */
  constructor(private waxToolKit: WaxAgentToolkit) {
    super();
  }

  /**
   * Executes the read table operation for a specified contract
   * @param input - JSON string containing:
   *   - contract_name: Name of the contract to read table for (required)
   *   - table_name: Name of the table to read (required)
   * @returns Promise resolving to a JSON string containing:
   *   - status: "success" or "error"
   *   - message: Success or error message
   *   - table: Array of contract table with their details
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
          "Missing required parameter: contract_name. Please provide the name of the contract to read table.",
        );
      }

      if (typeof params.contract_name !== "string") {
        throw new Error("Invalid contract_name parameter. Must be a string.");
      }

      if (!params.table_name) {
        throw new Error(
          "Missing required parameter: table_name. Please provide the name of the table to read.",
        );
      }

      const result = await contract_read_table(
        this.waxToolKit,
        params.contract_name,
        params.table_name,
      );

      if (!result || result.length === 0) {
        return JSON.stringify({
          status: "success",
          message: `No table found for contract ${params.contract_name}`,
          table: [],
        });
      }

      return JSON.stringify({
        status: "success",
        message: `Successfully retrieved table for contract ${params.contract_name}`,
        table: result,
      });
    } catch (error: any) {
      return JSON.stringify({
        status: "error",
        message: error.message || "Failed to read table",
        code: error.code || "UNKNOWN_ERROR",
        details: error.details || null,
      });
    }
  }
}
