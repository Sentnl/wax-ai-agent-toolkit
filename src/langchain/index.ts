export * from "./wax";

import { WaxAgentToolkit } from "../agent";
import {
  WaxBalanceOtherTool,
  WaxBalanceTool,
  WaxBuyRamTool,
  WaxSellRamTool,
} from "./index";

/**
 * Creates an array of WAX blockchain tools for use with LangChain
 *
 * @function createWaxTools
 * @param waxAgentkit - Instance of WaxAgentToolkit for blockchain interactions
 * @returns Array of WAX blockchain tools including:
 *   - WaxBalanceOtherTool: For checking other accounts' balances
 *   - WaxBalanceTool: For checking your own account balance
 *   - WaxBuyRamTool: For purchasing RAM
 *   - WaxSellRamTool: For selling RAM
 * @example
 * ```typescript
 * const waxTools = createWaxTools(waxAgentkit);
 * ```
 */
export function createWaxTools(waxAgentkit: WaxAgentToolkit) {
  return [
    new WaxBalanceOtherTool(waxAgentkit),
    new WaxBalanceTool(waxAgentkit),
    new WaxBuyRamTool(waxAgentkit),
    new WaxSellRamTool(waxAgentkit),
  ];
}
