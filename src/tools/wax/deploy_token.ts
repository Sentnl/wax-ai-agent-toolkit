import { WaxAgentToolkit } from "../../index";
/**
 * Deploy a new WAX token
 * @param agent - WaxAgentToolkit instance
 * @param name Name of the token
 * @param symbol Symbol of the token
 * @param supply Total supply of the token
 * @returns Transaction result
 */
export async function deployToken(
  agent: WaxAgentToolkit,
  name: string,
  symbol: string,
  supply: string,
) {
  try {
    // Define the token creation action
    const actions = [
      {
        account: "eosio.token",
        name: "create",
        authorization: [
          {
            actor: agent.accountName,
            permission: "active",
          },
        ],
        data: {
          issuer: agent.accountName,
          maximum_supply: `${supply} ${symbol}`,
        },
      },
      {
        account: "eosio.token",
        name: "issue",
        authorization: [
          {
            actor: agent.accountName,
            permission: "active",
          },
        ],
        data: {
          to: agent.accountName,
          quantity: `${supply} ${symbol}`,
          memo: "Initial supply",
        },
      },
    ];

    // Send the transaction
    const result = await agent.session.transact(
      { actions },
      {
        expireSeconds: 30,
      },
    );

    return result;
  } catch (error: any) {
    throw new Error(`Token deployment failed: ${error.message}`);
  }
}
