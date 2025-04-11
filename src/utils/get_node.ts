import { WaxAgentToolkit } from "../agent";
import { NodePulse } from "@sentnl/nodepulse";
import { NodeType, Network } from "../types";

/**
 * Retrieves a WAX node from the NodePulse service
 *
 * This function initializes a NodePulse instance with custom configuration
 * and returns an available node for WAX blockchain interactions.
 *
 * @function get_node
 * @param agent - The WaxAgentToolkit instance for blockchain interactions
 * @param network - The WAX network to connect to (e.g., "mainnet", "testnet")
 * @param nodeType - The type of node to retrieve (e.g., "hyperion", "atomic", "lightapi", "ipfs")
 * @returns Promise resolving to a WAX node URL
 * @throws Error if:
 *   - Invalid network or node type
 *   - NodePulse service is unavailable
 *   - No available nodes found
 *   - Network connection issues
 * @example
 * ```typescript
 * // Get a Hyperion node for mainnet
 * const nodeUrl = await get_node(agent, "mainnet", "hyperion");
 *
 * // Get an Atomic node for testnet
 * const testnetNode = await get_node(agent, "testnet", "atomic");
 * ```
 */
export async function get_node(
  agent: WaxAgentToolkit,
  network: Network,
  nodeType: NodeType,
): Promise<string> {
  // Initialize with custom options and default nodes
  const nodePulse = new NodePulse({
    nodeType: nodeType,
    network: network,
    nodeCount: 5,
    updateInterval: 60000, // Refresh every minute
    apiUrl: "https://nodes.nodepulse.co/nodes",
    atomicassets: false,
    atomicmarket: false,
  });
  // Retrieve a node from the custom configuration
  return await nodePulse.getNode();
}
