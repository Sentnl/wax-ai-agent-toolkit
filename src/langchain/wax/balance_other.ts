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
  name = "wax_balance_other";

  /** Detailed description of the tool's functionality */
  description = `Get the balance of ANOTHER wallet (not your own) or token account on WAX.
  
    This tool should be used when checking someone else's wallet balance or another wallet address.
    For questions like "How much WAX does account X have?" or "What's the TOKEN balance of account Y?".
    
    Input for checking WAX balance:
    {"accountName":"sentnltestin"}
    
    Input for checking token balance:
    {"accountName":"sentnltestin", "tokenContract":"eosio.token", "tokenSymbol":"TOKEN"}
    
    Example: To check someone's WAX balance: {"accountName":"sentnltestin"}
    Example: To check someone's TOKEN balance: {"accountName":"sentnltestin", "tokenContract":"eosio.token", "tokenSymbol":"TOKEN"}`;

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
