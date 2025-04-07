import { Name } from "@wharfkit/antelope";
import { Tool } from "langchain/tools";
import { WaxAgentToolkit } from "../../agent";
import { get_balance_other } from "../../tools/wax/get_balance_others";

export class WaxBalanceOtherTool extends Tool {
  name = "wax_balance_other";
  description = `Get the balance of ANOTHER wallet (not your own) or token account on WAX.
  
    This tool should be used when checking someone else's wallet balance or another wallet address.
    For questions like "How much WAX does account X have?" or "What's the TOKEN balance of account Y?".
    
    Input for checking WAX balance:
    {"accountName":"user123"}
    
    Input for checking token balance:
    {"accountName":"user123", "tokenContract":"eosio.token", "tokenSymbol":"TOKEN"}
    
    Example: To check someone's WAX balance: {"accountName":"user123"}
    Example: To check someone's TOKEN balance: {"accountName":"user123", "tokenContract":"eosio.token", "tokenSymbol":"TOKEN"}`;

  constructor(private waxToolKit: WaxAgentToolkit) {
    super();
  }

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
