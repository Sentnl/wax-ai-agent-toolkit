import { Asset, Name } from "@wharfkit/antelope";
import { Tool } from "langchain/tools";
import { WaxAgentToolkit } from "../../agent";
import { formatAccountInfo } from "../../utils/format/formatAccountInfo";

/**
 * Tool for retrieving account information from the WAX blockchain
 *
 * @class WaxGetAccountInfoTool
 * @extends Tool
 * @property {string} name - Tool identifier
 * @property {string} description - Detailed description of the tool's functionality
 * @property {WaxAgentToolkit} waxToolKit - Instance of WaxAgentToolkit for blockchain interactions
 */
export class WaxGetAccountInfoTool extends Tool {
  /** Tool identifier */
  name = "wax_get_account_info";

  /** Detailed description of the tool's functionality */
  description = `Retrieve account information from the WAX blockchain.
  
    This tool should be used when you want to get information about any WAX account.
    For questions like "What's my account info?" or "I need to check another account's details".
    
    You can get information for:
    1. Your own account (no parameters needed)
    2. Any other account by providing the account name
    
    Input for getting account information:
    - For your own account: {}
    - For another account: {"account_name":"account.wam"}
    
    Example: To get your own account info: {}
    Example: To get another account's info: {"account_name":"account.wam"}`;

  /**
   * Creates a new instance of WaxGetAccountInfoTool
   * @param waxToolKit - Instance of WaxAgentToolkit for blockchain interactions
   */
  constructor(private waxToolKit: WaxAgentToolkit) {
    super();
  }

  /**
   * Executes the account information retrieval operation
   * @param input - JSON string containing:
   *   - account_name: Optional name of the account to retrieve information for (e.g., "account.wam")
   *     If not provided, retrieves information for the current user's account
   * @returns Promise resolving to a JSON string containing:
   *   - status: "success" or "error"
   *   - message: Success or error message
   *   - account: Account information (if successful)
   *   - code: Error code (if error occurred)
   * @throws Error if:
   *   - Input parsing fails
   *   - Account not found
   *   - Network connection issues
   */
  protected async _call(input: string): Promise<string> {
    try {
      const params = JSON.parse(input);
      const accountName = params.account_name || this.waxToolKit.accountName;

      const result = await this.waxToolKit.get_account(accountName);

      return JSON.stringify({
        status: "success",
        message: `Successfully retrieved information for account ${accountName}`,
        account: formatAccountInfo(result),
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
