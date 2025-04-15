import { Asset, Name } from "@wharfkit/antelope";
import { Tool } from "langchain/tools";
import { WaxAgentToolkit } from "../../agent";
import { transfer } from "../../tools/wax";

/**
 * Tool for transferring tokens from a WAX account to another account
 *
 * @class WaxTransferTool
 * @extends Tool
 * @property {string} name - Tool identifier
 * @property {string} description - Detailed description of the tool's functionality
 * @property {WaxAgentToolkit} waxToolKit - Instance of WaxAgentToolkit for blockchain interactions
 */
export class WaxTransferTool extends Tool {
  /** Tool identifier */
  name = "wax_transfer";

  /** Detailed description of the tool's functionality */
  description = `Transfer tokens from your WAX account to another account.
  
    This tool should be used when you want to transfer tokens from your WAX account to another account.
    For questions like "How do I transfer tokens?" or "I want to transfer tokens to another account".
    
    Input for transferring tokens:
    {"token_quantity":10, "token_symbol":"WAX", "to":"recipient.wam"}
    
    Example: To transfer 10 WAX tokens to another account: {"token_quantity":10, "token_symbol":"WAX", "to":"recipient.wam"}`;

  /**
   * Creates a new instance of WaxTransferTool
   * @param waxToolKit - Instance of WaxAgentToolkit for blockchain interactions
   */
  constructor(private waxToolKit: WaxAgentToolkit) {
    super();
  }

  /**
   * Executes the transfer operation
   * @param input - JSON string containing:
   *   - token_quantity: Number of tokens to transfer (must be positive number)
   *   - token_symbol: Symbol of the token to transfer (e.g., "WAX")
   *   - to: Recipient account name
   * @returns Promise resolving to a JSON string containing:
   *   - status: "success" or "error"
   *   - message: Success or error message
   *   - transaction: Transaction details (if successful)
   *   - code: Error code (if error occurred)
   * @throws Error if:
   *   - Input parsing fails
   *   - Invalid input parameters provided
   *   - Invalid token quantity (must be positive number)
   *   - Transfer transaction fails
   */
  protected async _call(input: string): Promise<string> {
    try {
      const params = JSON.parse(input);

      if (!params.token_quantity || !params.token_symbol || !params.to) {
        throw new Error(
          "Missing required parameters. Must provide token_quantity, token_symbol, and to.",
        );
      }

      const quantity = parseFloat(params.token_quantity);
      if (isNaN(quantity) || quantity <= 0) {
        throw new Error("Invalid token quantity. Must be a positive number.");
      }

      const result = await transfer(
        this.waxToolKit,
        quantity,
        params.token_symbol,
        params.to,
      );

      return JSON.stringify({
        status: "success",
        message: `Successfully transferred ${quantity} ${params.token_symbol} to ${params.to}`,
        transaction: result,
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
