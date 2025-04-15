import { Asset, Name } from "@wharfkit/antelope";
import { Tool } from "langchain/tools";
import { WaxAgentToolkit } from "../../agent";
import { buy_ram, buy_ram_bytes } from "../../tools/wax/buy_ram";

/**
 * Tool for buying RAM for a WAX account
 *
 * @class WaxBuyRamTool
 * @extends Tool
 * @property {string} name - Tool identifier
 * @property {string} description - Detailed description of the tool's functionality
 * @property {WaxAgentToolkit} waxToolKit - Instance of WaxAgentToolkit for blockchain interactions
 */
export class WaxBuyRamTool extends Tool {
  /** Tool identifier */
  name = "wax_buy_ram";

  /** Detailed description of the tool's functionality */
  description = `Buy RAM for your WAX account.
  
    This tool should be used when you want to purchase RAM for your WAX account.
    For questions like "How do I buy RAM?" or "I need more RAM for my account".
    
    You can buy RAM in two ways:
    1. Using WAX tokens:
       {"buy_ram_amount":"1.0000 WAX"}
    2. Using specific bytes:
       {"buy_ram_bytes":8192}
    
    Example: To buy RAM with WAX tokens: {"buy_ram_amount":"1.00000000 WAX"}
    Example: To buy RAM with specific bytes: {"buy_ram_bytes":8192}`;

  /**
   * Creates a new instance of WaxBuyRamTool
   * @param waxToolKit - Instance of WaxAgentToolkit for blockchain interactions
   */
  constructor(private waxToolKit: WaxAgentToolkit) {
    super();
  }

  /**
   * Executes the RAM purchase operation
   * @param input - JSON string containing either:
   *   - buy_ram_amount: Amount of WAX tokens to spend on RAM (e.g., "1.0000 WAX")
   *   - buy_ram_bytes: Number of bytes of RAM to purchase (must be positive integer)
   * @returns Promise resolving to a JSON string containing:
   *   - status: "success" or "error"
   *   - message: Success or error message
   *   - transaction: Transaction details (if successful)
   *   - code: Error code (if error occurred)
   * @throws Error if:
   *   - Input parsing fails
   *   - Invalid input parameters provided
   *   - Invalid bytes value (must be positive number)
   *   - RAM purchase transaction fails
   */
  protected async _call(input: string): Promise<string> {
    try {
      const params = JSON.parse(input);

      if (params.buy_ram_amount) {
        // Buy RAM with WAX tokens
        const amount = Asset.from(params.buy_ram_amount);
        const result = await buy_ram(this.waxToolKit, amount);

        return JSON.stringify({
          status: "success",
          message: `Successfully bought RAM with ${params.buy_ram_amount}`,
          transaction: result,
        });
      } else if (params.buy_ram_bytes) {
        // Buy RAM with specific bytes
        const bytes = parseInt(params.buy_ram_bytes, 10);
        if (isNaN(bytes) || bytes <= 0) {
          throw new Error("Invalid bytes value. Must be a positive number.");
        }

        const result = await buy_ram_bytes(this.waxToolKit, bytes);

        return JSON.stringify({
          status: "success",
          message: `Successfully bought ${bytes} bytes of RAM`,
          transaction: result,
        });
      } else {
        throw new Error(
          "Invalid input. Must provide either 'buy_ram_amount' or 'buy_ram_bytes' parameter.",
        );
      }
    } catch (error: any) {
      return JSON.stringify({
        status: "error",
        message: error.message,
        code: error.code || "UNKNOWN_ERROR",
      });
    }
  }
}
