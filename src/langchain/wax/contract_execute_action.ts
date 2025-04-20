import { Tool } from "langchain/tools";
import { TransactResult } from "@wharfkit/session";
import { WaxAgentToolkit } from "../../agent";
import { contract_execute_action } from "../../tools/wax";
import {
  ContractExecuteActionParams,
  ContractExecuteActionResult,
} from "../../types";

/**
/**
 * Tool for executing actions on WAX blockchain smart contracts
 *
 * This tool enables interaction with smart contracts on the WAX blockchain by executing
 * specific actions with provided parameters. It's designed for:
 * - Contract interactions and transactions
 * - Smart contract testing and debugging
 * - Automated contract operations
 *
 * @class WaxContractExecuteActionTool
 * @extends Tool
 * @property {string} name - Tool identifier
 * @property {string} description - Detailed description of the tool's functionality
 * @property {WaxAgentToolkit} waxToolKit - Instance of WaxAgentToolkit for blockchain interactions
 */
export class WaxContractExecuteActionTool extends Tool {
  /** Tool identifier */
  name = "wax_contract_execute_action";

  /** Detailed description of the tool's functionality */
  description = `Execute an action on a WAX blockchain smart contract.
  
  Input format:
  {
    "contract_name": "string",  // Name of the contract (e.g., "eosio.token")
    "action_name": "string",    // Name of the action to execute (e.g., "transfer")
    "params": {                 // Optional parameters for the action
      "key1": "value1",
      "key2": "value2"
    }
  }
  
  Examples:
  1. Transfer WAX tokens:
     {
       "contract_name": "eosio.token",
       "action_name": "transfer",
       "params": {
         "from": "user1.wam",
         "to": "user2.wam",
         "quantity": "1.00000000 WAX",
         "memo": "Test transfer"
       }
     }
  
  2. Stake WAX:
     {
       "contract_name": "eosio",
       "action_name": "delegatebw",
       "params": {
         "from": "user1.wam",
         "receiver": "user1.wam",
         "stake_net_quantity": "1.00000000 WAX",
         "stake_cpu_quantity": "1.00000000 WAX",
         "transfer": false
       }
     }`;

  /**
   * Creates a new instance of WaxContractExecuteAction
   * @param waxToolKit - Instance of WaxAgentToolkit for blockchain interactions
   */
  constructor(private waxToolKit: WaxAgentToolkit) {
    super();
  }

  /**
   * Executes a contract action on the WAX blockchain
   *
   * @param input - JSON string containing contract action parameters
   * @returns Promise resolving to a JSON string with execution results
   * @throws Error if:
   *   - Input parsing fails
   *   - Required parameters are missing
   *   - Contract interaction fails
   */
  protected async _call(input: string): Promise<string> {
    try {
      const params: ContractExecuteActionParams = JSON.parse(input);

      // Validate required parameters
      if (!params.contract_name) {
        throw new Error("Missing required parameter: contract_name");
      }
      if (!params.action_name) {
        throw new Error("Missing required parameter: action_name");
      }

      // Validate parameter types
      if (typeof params.contract_name !== "string") {
        throw new Error("contract_name must be a string");
      }
      if (typeof params.action_name !== "string") {
        throw new Error("action_name must be a string");
      }
      if (params.params && typeof params.params !== "object") {
        throw new Error("params must be an object if provided");
      }

      const result: TransactResult = await contract_execute_action(
        this.waxToolKit,
        params.contract_name,
        params.action_name,
        params.params || {},
      );

      const response: ContractExecuteActionResult = {
        status: "success",
        message: `Successfully executed action ${params.action_name} on contract ${params.contract_name}`,
        transaction:
          this.waxToolKit.network === "testnet"
            ? `https://testnet.waxblock.io/transaction/${result.response?.transaction_id}`
            : `https://waxblock.io/transaction/${result.response?.transaction_id}`,
      };

      return JSON.stringify(response);
    } catch (error: any) {
      const errorResponse: ContractExecuteActionResult = {
        status: "error",
        message: error.message || "Failed to execute contract action",
        code: error.code || "UNKNOWN_ERROR",
        details: error.details || null,
      };
      return JSON.stringify(errorResponse);
    }
  }
}
