import { Asset, Name } from "@wharfkit/antelope";
import { Tool } from "langchain/tools";
import { WaxAgentToolkit } from "../../agent";
import { sell_ram } from "../../tools/wax/sell_ram";

export class WaxSellRamTool extends Tool {
  name = "wax_sell_ram";
  description = `Sell RAM from your WAX account.
  
    This tool should be used when you want to sell RAM from your WAX account to get WAX tokens back.
    For questions like "How do I sell RAM?" or "I want to get WAX back from my RAM".
    
    Input for selling RAM:
    {"bytes":8192}
    
    Example: To sell 8KB of RAM: {"bytes":8192}`;

  constructor(private waxToolKit: WaxAgentToolkit) {
    super();
  }

  protected async _call(input: string): Promise<string> {
    try {
      const params = JSON.parse(input);

      if (params.bytes) {
        // Sell RAM with specific bytes
        const bytes = parseInt(params.bytes, 10);
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
