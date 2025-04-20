import { Action, Session } from "@wharfkit/session";
import { APIClient } from "@wharfkit/antelope";
import { WaxAgentToolkit } from "../../agent";
import { Asset } from "@wharfkit/antelope";

/**
 * Transfer tokens from the agent's account to another account
 *
 * @function transfer
 * @param agent - The WaxAgentToolkit instance to use for the transaction
 * @param token_quantity - The amount of tokens to transfer (must be a positive number)
 * @param token_symbol - The symbol of the token to transfer (e.g., "WAX")
 * @param to - The recipient account name
 * @returns Promise resolving to the transaction result containing:
 *   - transaction_id: The ID of the transaction
 *   - processed: Transaction processing details
 *   - block_num: Block number where the transaction was included
 * @throws Error if:
 *   - Account not found
 *   - Invalid token quantity
 *   - Insufficient balance
 *   - Transaction fails
 *   - Network connection issues
 * @example
 * ```typescript
 * // Transfer 10 WAX tokens to another account
 * const result = await transfer(agent, 10, "WAX", "recipient.wam");
 * ```
 */
export async function transfer(
  agent: WaxAgentToolkit,
  token_quantity: number,
  token_symbol: string,
  to: string,
) {
  try {
    const session: Session = await agent.get_session();

    // Format the quantity with the correct precision (8 decimal places for WAX)
    const formattedQuantity = token_quantity.toFixed(8);
    const asset = Asset.from(`${formattedQuantity} ${token_symbol}`);

    return await session.transact(
      {
        action: {
          account: "eosio.token",
          name: "transfer",
          authorization: [
            {
              actor: agent.accountName,
              permission: "active",
            },
          ],
          data: {
            from: agent.accountName,
            to: to,
            quantity: asset.toString(),
            memo: `Transfering ${formattedQuantity} ${token_symbol} to ${to}`,
          },
        },
      },
      {
        // Set transaction expiration time to 30 seconds
        expireSeconds: 30,
      },
    );
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to transfer: ${error.message}`);
    }
    throw new Error("Failed to transfer: Unknown error");
  }
}
