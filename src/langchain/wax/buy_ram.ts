import { Asset, Name } from "@wharfkit/antelope";
import { Tool } from "langchain/tools";
import { WaxAgentToolkit } from "../../agent";
import { buy_ram, buy_ram_bytes } from "../../tools/wax/buy_ram";

export class WaxBuyRamTool extends Tool {
  name = "wax_buy_ram";
  description = `Buy RAM for your WAX account.
  
    This tool should be used when you want to purchase RAM for your WAX account.
    For questions like "How do I buy RAM?" or "I need more RAM for my account".
    
    Input for buying RAM with WAX tokens:
    {"amount":"1.0000 WAX"}
    
    Input for buying RAM with specific bytes:
    {"bytes":8192}
    
    Example: To buy RAM with WAX tokens: {"amount":"1.0000 WAX"}
    Example: To buy RAM with specific bytes: {"bytes":8192}`;

  constructor(private waxToolKit: WaxAgentToolkit) {
    super();
  }

  protected async _call(input: string): Promise<string> {
    try {
      const params = JSON.parse(input);

      if (params.amount) {
        // Buy RAM with WAX tokens
        const amount = Asset.from(params.amount);
        const result = await buy_ram(this.waxToolKit, amount);

        return JSON.stringify({
          status: "success",
          message: `Successfully bought RAM with ${params.amount}`,
          transaction: result,
        });
      } else if (params.bytes) {
        // Buy RAM with specific bytes
        const bytes = parseInt(params.bytes, 10);
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
          "Invalid input. Must provide either 'amount' or 'bytes' parameter.",
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
