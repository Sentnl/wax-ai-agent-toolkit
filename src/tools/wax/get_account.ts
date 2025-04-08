import { Name } from "@wharfkit/antelope";
import { WaxAgentToolkit } from "../../agent";

/**
 * Retrieves account information from the WAX blockchain
 *
 * @param agent - The WaxAgentToolkit instance to use for the blockchain query
 * @param accountName - The name of the WAX account to retrieve information for
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
 * @throws Error if the account doesn't exist or if the RPC request fails
 */
export async function get_account(agent: WaxAgentToolkit, accountName: string) {
  try {
    const response = await agent.session.fetch("get_account", {
      account_name: accountName,
    });

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
