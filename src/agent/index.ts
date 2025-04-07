import { Name } from "@wharfkit/antelope";
import { Session } from "@wharfkit/session";
import { WalletPluginPrivateKey } from "@wharfkit/wallet-plugin-privatekey";
import {
  get_balance,
  get_balance_other,
  get_token_balance,
} from "../tools/wax";

/**
 * Main class for interacting with WAX blockchain
 * Provides a unified interface for token operations, NFT management, trading and more
 *
 * @class WaxAgentToolkit
 * @property {Session} session - WAX session for interacting with the blockchain
 * @property {string} accountName - Name of the WAX account
 */
export class WaxAgentToolkit {
  public session: Session;
  public accountName: string;

  /**
   * Creates a new instance of WaxAgentToolkit
   * @param private_key - Private key for the WAX account
   * @param account_name - Name of the WAX account
   * @param rpc_url - URL of the WAX RPC endpoint (optional)
   * @param chainId - Chain ID of the WAX network (optional)
   */
  constructor(
    private_key: string,
    account_name: string,
    rpc_url: string = "https://wax.greymass.com",
    chainId: string,
  ) {
    // Create a session with the wallet
    this.session = new Session({
      chain: {
        id: chainId,
        url: rpc_url,
      },
      actor: account_name,
      permission: "active",
      walletPlugin: new WalletPluginPrivateKey(private_key),
    });

    this.accountName = account_name;
  }

  /**
   * Get the balance of WAX or a token for the agent's account
   * @param tokenContract - Optional token contract name. If not provided, returns WAX balance
   * @param tokenSymbol - Optional token symbol. If not provided, returns WAX balance
   * @returns Promise resolving to the balance as a string (e.g., "100.0000 WAX" or "50.0000 TOKEN")
   */
  async getBalance(
    tokenContract?: string,
    tokenSymbol?: string,
  ): Promise<string> {
    return get_balance(this, tokenContract, tokenSymbol);
  }

  /**
   * Get the token balances of a WAX account
   * @param accountName - Optional account name. If not provided, returns agent's account balances
   * @returns Promise resolving to an object containing WAX balance and token balances
   */
  async getTokenBalances(accountName?: string): Promise<{
    wax: string;
    tokens: Array<{
      contract: string;
      symbol: string;
      balance: string;
    }>;
  }> {
    return get_token_balance(this, accountName);
  }

  /**
   * Get the balance of WAX or a token for another account
   * @param accountName - Name of the account to check balance for
   * @param tokenContract - Optional token contract name. If not provided, returns WAX balance
   * @param tokenSymbol - Optional token symbol. Required if tokenContract is provided
   * @returns Promise resolving to the balance as a string (e.g., "100.0000 WAX")
   */
  async getBalanceOther(
    accountName: string,
    tokenContract?: string,
    tokenSymbol?: string,
  ): Promise<string> {
    return get_balance_other(this, accountName, tokenContract, tokenSymbol);
  }
}
