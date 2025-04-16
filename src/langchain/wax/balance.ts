import { Tool } from "langchain/tools";
import { WaxAgentToolkit } from "../../agent";
import { get_balance } from "../../tools/wax/balance";

/**
 * Tool for checking token balances in a WAX account
 *
 * @class WaxBalanceTool
 * @extends Tool
 * @property {string} name - Tool identifier
 * @property {string} description - Detailed description of the tool's functionality
 * @property {WaxAgentToolkit} waxToolKit - Instance of WaxAgentToolkit for blockchain interactions
 */
export class WaxBalanceTool extends Tool {
  /** Tool identifier */
  name = "wax_balance";

  /** Detailed description of the tool's functionality */
  description = `Handles balance checks for your WAX account.
  Expects a JSON input with "tokenContract" (optional) and "tokenSymbol" (optional).
  Example: {} for WAX balance
  Example: {"tokenContract": "eosio.token", "tokenSymbol": "WAX"} for WAX balance
  Example: {"tokenContract": "custom.token", "tokenSymbol": "TOKEN"} for token balance`;

  /**
   * Creates a new instance of WaxBalanceTool
   * @param waxToolKit - Instance of WaxAgentToolkit for blockchain interactions
   */
  constructor(private waxToolKit: WaxAgentToolkit) {
    super();
  }

  /**
   * Executes the balance check operation
   * @param input - JSON string containing:
   *   - tokenContract: Token contract name (e.g., "eosio.token")
   *   - tokenSymbol: Token symbol (e.g., "WAX")
   * @returns Promise resolving to a JSON string containing:
   *   - status: "success" or "error"
   *   - balance: The account's token balance
   *   - token: The token type checked (WAX or token@contract)
   *   - message: Error message (if error occurred)
   *   - code: Error code (if error occurred)
   * @throws Error if:
   *   - Input parsing fails
   *   - Invalid input parameters provided
   *   - Balance check fails
   */
  protected async _call(input: string): Promise<string> {
    try {
      let tokenContract, tokenSymbol;

      if (input) {
        const parsedInput = JSON.parse(input);
        tokenContract = parsedInput.tokenContract;
        tokenSymbol = parsedInput.tokenSymbol;
      }

      const balance = await get_balance(
        this.waxToolKit,
        tokenContract,
        tokenSymbol,
      );

      return JSON.stringify({
        status: "success",
        balance,
        token:
          tokenContract && tokenSymbol
            ? `${tokenSymbol}@${tokenContract}`
            : "WAX",
      });
    } catch (error: any) {
      return JSON.stringify({
        status: "error",
        message: error.message,
        code: error.code || "UNKNOWN_ERROR",
      });
    }
  }
}
