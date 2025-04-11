import { Tool } from "langchain/tools";
import { WaxAgentToolkit } from "../../agent";
import { get_balance } from "../../tools/wax/balance";

/**
 * Tool for checking the balance of your own WAX account or token
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
  description = `Get the balance of your WAX account or token.

  If you want to get the balance of your wallet, you don't need to provide the tokenContract and tokenSymbol.
  If no tokenContract and tokenSymbol are provided, the balance will be in WAX.

  Inputs ( input is a JSON string ):
  tokenContract: string, eg "eosio.token" (optional)
  tokenSymbol: string, eg "TOKEN" (optional)`;

  /**
   * Creates a new instance of WaxBalanceTool
   * @param waxToolKit - Instance of WaxAgentToolkit for blockchain interactions
   */
  constructor(private waxToolKit: WaxAgentToolkit) {
    super();
  }

  /**
   * Executes the balance check for your account
   * @param input - Optional JSON string containing:
   *   - tokenContract: Optional token contract name (e.g., "eosio.token")
   *   - tokenSymbol: Optional token symbol (e.g., "TOKEN")
   * @returns Promise resolving to a JSON string containing:
   *   - status: "success" or "error"
   *   - balance: The account's balance (if successful)
   *   - token: The token type checked (WAX or token@contract)
   *   - message: Error message (if error occurred)
   *   - code: Error code (if error occurred)
   * @throws Error if input parsing fails or balance check fails
   */
  protected async _call(input: string): Promise<string> {
    try {
      let tokenContract, tokenSymbol;

      if (input) {
        const parsedInput = JSON.parse(input);
        tokenContract = parsedInput.tokenContract;
        tokenSymbol = parsedInput.tokenSymbol;
      }

      // Use the get_balance function from tools/wax/balance.ts
      console.log("tokenContract", tokenContract);
      console.log("tokenSymbol", tokenSymbol);
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
