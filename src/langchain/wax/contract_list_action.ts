import { Asset, Name } from "@wharfkit/antelope";
import { Tool } from "langchain/tools";
import { WaxAgentToolkit } from "../../agent";
import { contract_list_action } from "../../tools/wax";
import { formatContractActions } from "../../utils";

/**
 * Tool for listing all available actions of a smart contract on the WAX blockchain
 *
 * This tool allows users to query and retrieve all available actions that can be executed
 * on a specific smart contract. It's particularly useful for:
 * - Discovering available contract functionality
 * - Understanding contract capabilities
 * - Debugging and development purposes
 *
 * @class WaxContractListActionTool
 * @extends Tool
 * @property {string} name - Tool identifier
 * @property {string} description - Detailed description of the tool's functionality
 * @property {WaxAgentToolkit} waxToolKit - Instance of WaxAgentToolkit for blockchain interactions
 */
export class WaxContractListActionTool extends Tool {
  /** Tool identifier */
  name = "wax_contract_list_action";

  /** Detailed description of the tool's functionality */
  description = `List all available actions of a smart contract on the WAX blockchain.
  
    This tool should be used when you need to:
    - View all available actions of a contract
    - Understand what operations a contract supports
    - Debug contract interactions
    
    Input format:
    {
      "contract_name": "string"  // The name of the contract to query (e.g., "eosio.token")
    }
    
    Examples:
    1. List actions of eosio.token contract:
       {"contract_name":"eosio.token"}
    
    2. List actions of a custom contract:
       {"contract_name":"mycontract"}`;

  /**
   * Creates a new instance of WaxContractListAction
   * @param waxToolKit - Instance of WaxAgentToolkit for blockchain interactions
   */
  constructor(private waxToolKit: WaxAgentToolkit) {
    super();
  }

  /**
   * Executes the list actions operation for a specified contract
   * @param input - JSON string containing:
   *   - contract_name: Name of the contract to list actions for (required)
   * @returns Promise resolving to a JSON string containing:
   *   - status: "success" or "error"
   *   - message: Success or error message
   *   - actions: Array of contract actions with their details
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

      const result = await contract_list_action(
        this.waxToolKit,
        params.contract_name,
      );

      if (!result || result.length === 0) {
        return JSON.stringify({
          status: "success",
          message: `No actions found for contract ${params.contract_name}`,
          actions: [],
        });
      }

      return JSON.stringify({
        status: "success",
        message: `Successfully retrieved ${result.length} actions for contract ${params.contract_name}`,
        actions: formatContractActions(result),
      });
    } catch (error: any) {
      return JSON.stringify({
        status: "error",
        message: error.message || "Failed to list contract actions",
        code: error.code || "UNKNOWN_ERROR",
        details: error.details || null,
      });
    }
  }
}
