import { WaxAgentToolkit } from "../../agent";
import SwapSDK, { Token, Pool } from "@alcorexchange/alcor-swap-sdk";
import { Session } from "@wharfkit/session";
import { Name } from "@wharfkit/antelope";
import { asset } from "eos-common";

/**
 * Parse token data from Alcor format
 * @param token Token data from Alcor
 * @returns Token instance
 */
export function parseToken(token: any): Token {
  return new Token(
    token.contract,
    asset(token.quantity).symbol.precision(),
    asset(token.quantity).symbol.code().to_string(),
  );
}

/**
 * Initialize the Alcor swap SDK client
 * @param agent WaxAgentToolkit instance
 * @returns Object with session and helper functions
 */
export async function initAlcorClient(agent: WaxAgentToolkit): Promise<any> {
  // Access the private key from the wallet plugin
  const session = await agent.get_session();
  const privateKey = (session.walletPlugin as any).privateKey;

  return {
    session: session,
    privateKey,
    account: agent.accountName,
    parseToken,
    // Helper function to get pool data
    async getPool(poolId: string): Promise<Pool> {
      const { rows } = await session.client.v1.chain.get_table_rows({
        scope: Name.from("swap.alcor"),
        table: Name.from("pools"),
        code: Name.from("swap.alcor"),
        lower_bound: Name.from(poolId),
        upper_bound: Name.from(poolId),
        limit: 1,
      });

      if (rows.length === 0) {
        throw new Error(`Pool with ID ${poolId} not found`);
      }

      const {
        tokenA,
        tokenB,
        currSlot: { sqrtPriceX64, tick },
      } = rows[0];

      return new Pool({
        ...rows[0],
        tokenA: parseToken(tokenA),
        tokenB: parseToken(tokenB),
        sqrtPriceX64,
        tickCurrent: tick,
      });
    },
  };
}
