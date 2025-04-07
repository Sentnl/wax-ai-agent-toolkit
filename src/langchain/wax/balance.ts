import { Tool } from "langchain/tools";
import { WaxAgentToolkit } from "../../agent";
import { get_balance } from "../../tools/wax/balance";

export class WaxBalanceTool extends Tool {
  name = "wax_balance";
  description = `Get the balance of your WAX account or token.

  If you want to get the balance of your wallet, you don't need to provide the tokenContract and tokenSymbol.
  If no tokenContract and tokenSymbol are provided, the balance will be in WAX.

  Inputs ( input is a JSON string ):
  tokenContract: string, eg "eosio.token" (optional)
  tokenSymbol: string, eg "TOKEN" (optional)`;

  constructor(private waxToolKit: WaxAgentToolkit) {
    super();
  }

  protected async _call(input: string): Promise<string> {
    try {
      let tokenContract, tokenSymbol;

      if (input) {
        const parsedInput = JSON.parse(input);
        tokenContract = parsedInput.tokenContract;
        tokenSymbol = parsedInput.tokenSymbol;
      }

      // Use the get_balance function from tools/wax/balance.ts
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
