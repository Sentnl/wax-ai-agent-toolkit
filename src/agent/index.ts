import { Name } from "@wharfkit/antelope";
import { Account } from "@wharfkit/account";
import { Session } from "@wharfkit/session";
import { WalletPluginPrivateKey } from "@wharfkit/wallet-plugin-privatekey";
import {
  get_balance,
  get_balance_other,
  get_token_balance,
  get_account,
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
  /** WAX session instance for blockchain interactions */
  public session: Session;
  /** Name of the WAX account being managed */
  public accountName: string;

  /**
   * Creates a new instance of WaxAgentToolkit
   * @param private_key - Private key for the WAX account (required for signing transactions)
   * @param account_name - Name of the WAX account to operate with
   * @param rpc_url - URL of the WAX RPC endpoint (defaults to "https://wax.greymass.com")
   * @param chainId - Chain ID of the WAX network (e.g., "1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4")
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
   * @param tokenContract - Optional token contract name (e.g., "eosio.token")
   * @param tokenSymbol - Optional token symbol (e.g., "WAX")
   * @returns Promise resolving to the balance as a string (e.g., "100.0000 WAX" or "50.0000 TOKEN")
   * @throws Error if tokenContract is provided but tokenSymbol is not
   */
  async getBalance(
    tokenContract?: string,
    tokenSymbol?: string,
  ): Promise<string> {
    return await get_balance(this, tokenContract, tokenSymbol);
  }

  /**
   * Get the token balances of a WAX account
   * @param accountName - Optional account name to check balances for. If not provided, returns agent's account balances
   * @returns Promise resolving to an object containing:
   *   - wax: WAX balance as string (e.g., "100.0000 WAX")
   *   - tokens: Array of token balances with contract, symbol, and balance information
   * @throws Error if account doesn't exist
   */
  async getTokenBalances(accountName?: string): Promise<{
    wax: string;
    tokens: Array<{
      contract: string;
      symbol: string;
      balance: string;
    }>;
  }> {
    return await get_token_balance(this, accountName);
  }

  /**
   * Get the balance of WAX or a token for another account
   * @param accountName - Name of the account to check balance for
   * @param tokenContract - Optional token contract name (e.g., "eosio.token")
   * @param tokenSymbol - Optional token symbol (e.g., "WAX"). Required if tokenContract is provided
   * @returns Promise resolving to the balance as a string (e.g., "100.0000 WAX")
   * @throws Error if account doesn't exist or if tokenContract is provided but tokenSymbol is not
   */
  async getBalanceOther(
    accountName: string,
    tokenContract?: string,
    tokenSymbol?: string,
  ): Promise<string> {
    return await get_balance_other(
      this,
      accountName,
      tokenContract,
      tokenSymbol,
    );
  }

  /**
   * Get account information for a WAX account
   * @param accountName - Optional account name to get information for. If not provided, returns agent's account info
   * @returns Promise resolving to an Account object containing account details
   * @throws Error if account doesn't exist
   */
  async get_account(accountName?: string): Promise<Account> {
    const account_name = accountName || this.accountName;
    return await get_account(this, account_name);
  }
}
