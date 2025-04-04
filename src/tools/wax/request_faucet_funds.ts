import { WaxAgentToolkit } from "../../index";
import { Transaction } from "@wharfkit/antelope";

/**
 * Request WAX from the Solana faucet (devnet/testnet only)
 * @param agent - WaxAgentToolkit instance
 * @returns Transaction signature
 * @throws Error if the request fails or times out
 */
export async function request_faucet_funds(
  agent: WaxAgentToolkit,
): Promise<string> {
  return "";
}
