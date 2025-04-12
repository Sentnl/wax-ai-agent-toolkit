import { Name, API } from "@wharfkit/antelope";
import { Account } from "@wharfkit/account";
import { WaxAgentToolkit } from "../agent";

/**
 * Retrieves account information from the WAX blockchain
 *
 * @function get_account
 * @param agent - The WaxAgentToolkit instance to use for the blockchain query
 * @param accountName - Optional name of the WAX account to retrieve information for. If not provided, uses agent's account name
 * @returns Promise resolving to the account information object containing:
 *   - account_name: Name of the account
 *   - ram_quota: RAM quota in bytes
 *   - net_weight: Network bandwidth weight
 *   - cpu_weight: CPU bandwidth weight
 *   - net_limit: Network bandwidth limit
 *   - cpu_limit: CPU bandwidth limit
 *   - permissions: Account permissions
 *   - total_resources: Total account resources
 *   - self_delegated_bandwidth: Self-delegated bandwidth information
 *   - refund_request: Refund request information (if any)
 *   - voter_info: Voter information (if any)
 * @throws Error if:
 *   - Account not found
 *   - Invalid account name
 *   - Blockchain query fails
 *   - Network connection issues
 * @example
 * ```typescript
 * // Get agent's own account information
 * const accountInfo = await get_account(agent);
 *
 * // Get another account's information
 * const otherAccountInfo = await get_account(agent, "sentnltestin");
 * ```
 */
export async function get_account(
  agent: WaxAgentToolkit,
  accountName?: string,
): Promise<API.v1.AccountObject> {
  try {
    const session = await agent.get_session();
    const response = await session.client.v1.chain.get_account(
      accountName || agent.accountName,
    );

    if (!response) {
      throw new Error(`Account ${accountName} not found`);
    }

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get account information: ${error.message}`);
    }
    throw new Error("Failed to get account information: Unknown error");
  }
}
