import { Asset, Name } from "@wharfkit/antelope";
import { Tool } from "langchain/tools";
import { WaxAgentToolkit } from "../../agent";
import { sell_ram } from "../../tools/wax/sell_ram";

/**
 * Tool for selling RAM from a WAX account
 *
 * @class WaxSellRamTool
 * @extends Tool
 * @property {string} name - Tool identifier
 * @property {string} description - Detailed description of the tool's functionality
 * @property {WaxAgentToolkit} waxToolKit - Instance of WaxAgentToolkit for blockchain interactions
 */
export class WaxSellRamTool extends Tool {
  /** Tool identifier */
  name = "wax_sell_ram";

  /** Detailed description of the tool's functionality */
  description = `Sell RAM from your WAX account.
  
    This tool should be used when you want to sell RAM from your WAX account to get WAX tokens back.
    For questions like "How do I sell RAM?" or "I want to get WAX back from my RAM".
    
    Input for selling RAM:
    {"sell_ram_bytes":8192}
    
    Example: To sell 8KB of RAM: {"sell_ram_bytes":8192}`;

  /**
   * Creates a new instance of WaxSellRamTool
   * @param waxToolKit - Instance of WaxAgentToolkit for blockchain interactions
   */
  constructor(private waxToolKit: WaxAgentToolkit) {
    super();
  }

  /**
   * Executes the RAM selling operation
   * @param input - JSON string containing:
   *   - sell_ram_bytes: Number of bytes of RAM to sell (must be positive integer)
   * @returns Promise resolving to a JSON string containing:
   *   - status: "success" or "error"
   *   - message: Success or error message
   *   - transaction: Transaction details (if successful)
   *   - code: Error code (if error occurred)
   * @throws Error if:
   *   - Input parsing fails
   *   - Invalid input parameters provided
   *   - Invalid bytes value (must be positive number)
   *   - RAM selling transaction fails
   */
  protected async _call(input: string): Promise<string> {
    try {
      const params = JSON.parse(input);

      if (params.sell_ram_bytes) {
        // Sell RAM with specific bytes
        const bytes = parseInt(params.sell_ram_bytes, 10);
        if (isNaN(bytes) || bytes <= 0) {
          throw new Error("Invalid bytes value. Must be a positive number.");
        }

        const result = await sell_ram(this.waxToolKit, bytes);

        return JSON.stringify({
          status: "success",
          message: `Successfully sold ${bytes} bytes of RAM`,
          transaction: result,
        });
      } else {
        throw new Error("Invalid input. Must provide 'bytes' parameter.");
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
