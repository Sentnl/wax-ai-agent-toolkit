export * from "./wax";

import { WaxAgentToolkit } from "../agent";
import {
  WaxBalanceOtherTool,
  WaxBuyRamTool,
  WaxSellRamTool,
  WaxTransferTool,
  WaxGetAccountInfoTool,
  WaxContractExecuteActionTool,
  WaxContractListActionTool,
  WaxContractListTablesTool,
  WaxContractReadTableTool,
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
 *   - WaxTransferTool: For transferring tokens
 *   - WaxGetAccountInfoTool: For getting account information
 *   - WaxContractExecuteActionTool: For executing actions on a contract
 *   - WaxContractListActionTool: For listing actions on a contract
 * @example
 * ```typescript
 * const waxTools = createWaxTools(waxAgentkit);
 * ```
 */
export function createWaxTools(waxAgentkit: WaxAgentToolkit) {
  return [
    new WaxBalanceOtherTool(waxAgentkit),
    new WaxBuyRamTool(waxAgentkit),
    new WaxSellRamTool(waxAgentkit),
    new WaxTransferTool(waxAgentkit),
    new WaxGetAccountInfoTool(waxAgentkit),
    new WaxContractExecuteActionTool(waxAgentkit),
    new WaxContractListActionTool(waxAgentkit),
    new WaxContractListTablesTool(waxAgentkit),
    new WaxContractReadTableTool(waxAgentkit),
  ];
}
