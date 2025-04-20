import { Name } from "@wharfkit/antelope";
import { Tool } from "langchain/tools";
import { WaxAgentToolkit } from "../../agent";
import { get_balance_other } from "../../tools/wax/get_balance_others";

/**
 * Tool for checking the balance of another WAX account or token
 *
 * @class WaxBalanceOtherTool
 * @extends Tool
 * @property {string} name - Tool identifier
 * @property {string} description - Detailed description of the tool's functionality
 * @property {WaxAgentToolkit} waxToolKit - Instance of WaxAgentToolkit for blockchain interactions
 */
export class WaxBalanceOtherTool extends Tool {
  /** Tool identifier */
  name = "wax_balance";

  /** Detailed description of the tool's functionality */
  description = `Handles balance checks for WAX accounts.
  Expects a JSON input with "accountName" (optional), "tokenContract" (optional), and "tokenSymbol" (optional).
  Example: {} for WAX balance of my account
  Example: {"tokenContract": "custom.token", "tokenSymbol": "TOKEN"} for token balance of my account
  Example: {"accountName": "sentnltestin"} for WAX balance of sentnltestin account
  Example: {"accountName": "sentnltestin", "tokenContract": "eosio.token", "tokenSymbol": "TOKEN"} for token balance of sentnltestin account`;

  /**
   * Creates a new instance of WaxBalanceOtherTool
   * @param waxToolKit - Instance of WaxAgentToolkit for blockchain interactions
   */
  constructor(private waxToolKit: WaxAgentToolkit) {
    super();
  }

  /**
   * Executes the balance check for another account
   * @param input - JSON string containing:
   *   - accountName: Name of the account to check balance for
   *   - tokenContract: Optional token contract name (e.g., "eosio.token")
   *   - tokenSymbol: Optional token symbol (e.g., "TOKEN")
   * @returns Promise resolving to a JSON string containing:
   *   - status: "success" or "error"
   *   - balance: The account's balance (if successful)
   *   - account: The account name checked
   *   - token: The token type checked (WAX or token@contract)
   *   - message: Error message (if error occurred)
   *   - code: Error code (if error occurred)
   * @throws Error if input parsing fails or balance check fails
   */
  protected async _call(input: string): Promise<string> {
    try {
      const { accountName, tokenContract, tokenSymbol } = JSON.parse(input);

      // Use the get_balance_other function from get_balance_others.ts
      const balance = await get_balance_other(
        this.waxToolKit,
        accountName,
        tokenContract,
        tokenSymbol,
      );

      return JSON.stringify({
        status: "success",
        balance,
        account: accountName,
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
