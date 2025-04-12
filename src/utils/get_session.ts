import { WaxAgentToolkit } from "../agent";
import { Session } from "@wharfkit/session";
import { WalletPluginPrivateKey } from "@wharfkit/wallet-plugin-privatekey";

/**
 * Creates a new WAX blockchain session for transaction signing and blockchain interactions
 *
 * @function get_session
 * @param agent - The WaxAgentToolkit instance containing account and private key information
 * @param chainId - The chain ID of the WAX network (e.g., "1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4" for mainnet)
 * @returns Promise resolving to a Session object configured with:
 *   - Chain information (ID and RPC URL)
 *   - Actor (account name)
 *   - Permission level ("active")
 *   - Private key wallet plugin
 * @throws Error if:
 *   - Invalid chain ID
 *   - Unable to get node URL
 *   - Invalid private key
 *   - Network connection issues
 * @example
 * ```typescript
 * // Create a session for mainnet
 * const session = await get_session(agent, "1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4");
 * ```
 */
export async function get_session(
  agent: WaxAgentToolkit,
  chainId: string,
): Promise<Session> {
  const session = new Session({
    chain: {
      id: chainId,
      url: await agent.get_node(),
    },
    actor: agent.accountName,
    permission: "active",
    walletPlugin: new WalletPluginPrivateKey(agent.privateKey),
  });

  return session;
}
