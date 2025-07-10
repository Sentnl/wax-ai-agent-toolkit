import { Tool } from "langchain/tools";
import { TransactResult } from "@wharfkit/session";
import { WaxAgentToolkit } from "../../agent";
import { contract_execute_action } from "../../tools/wax";

import {
  ContractExecuteActionParams,
  ContractExecuteActionResult,
} from "../../types";

/**
 * Tool for executing token swaps on Alcor using WAX blockchain
 *
 * This enables interaction with Alcor's swap contract using WharfKit.
 */
export class AlcorSwapActionTool extends Tool {
  /** Tool identifier */
  name = "alcor_swap_action";

  /** Description of the tool's functionality */
  description = `Execute a token swap using Alcor's smart contract on the WAX blockchain.

Input format:
{
  "contract_name": "string",   // Alcor swap contract (e.g., "alcordexmain")
  "action_name": "string",     // Usually "swap"
  "params": {
    "owner": "string",         // Account performing the swap (e.g., "user1.wam")
    "amount_in": "string",     // Amount being swapped (e.g., "1.00000000 WAX")
    "min_amount_out": "string",// Minimum expected output
    "path": ["token1", "token2"] // Swap path (token contract symbols)
  }
}

Example:
{
  "contract_name": "alcordexmain",
  "action_name": "swap",
  "params": {
    "owner": "user1.wam",
    "amount_in": "1.00000000 WAX",
    "min_amount_out": "0.10000000 TLM",
    "path": ["WAX", "TLM"]
  }
}`;

  constructor(private waxToolKit: WaxAgentToolkit) {
    super();
  }

  protected async _call(input: string): Promise<string> {
    try {
      const params: ContractExecuteActionParams = JSON.parse(input);

      // Validate inputs
      if (!params.contract_name || typeof params.contract_name !== "string") {
        throw new Error("Missing or invalid 'contract_name'");
      }
      if (!params.action_name || typeof params.action_name !== "string") {
        throw new Error("Missing or invalid 'action_name'");
      }
      if (!params.params || typeof params.params !== "object") {
        throw new Error("Missing or invalid 'params'");
      }

      const result: TransactResult = await contract_execute_action(
        this.waxToolKit,
        params.contract_name,
        params.action_name,
        params.params,
      );

      const response: ContractExecuteActionResult = {
        status: "success",
        message: `Swap executed: ${params.action_name} on ${params.contract_name}`,
        transaction:
          this.waxToolKit.network === "testnet"
            ? `https://testnet.waxblock.io/transaction/${result.response?.transaction_id}`
            : `https://waxblock.io/transaction/${result.response?.transaction_id}`,
      };

      return JSON.stringify(response);
    } catch (error: any) {
      const errorResponse: ContractExecuteActionResult = {
        status: "error",
        message: error.message || "Swap failed",
        code: error.code || "SWAP_ERROR",
        details: error.details || null,
      };
      return JSON.stringify(errorResponse);
    }
  }
}