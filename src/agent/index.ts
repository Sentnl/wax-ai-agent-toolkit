import { NodePulse } from "@sentnl/nodepulse";
import { Account } from "@wharfkit/account";
import { Session } from "@wharfkit/session";
import { API } from "@wharfkit/antelope";
import { get_balance, get_balance_other, get_token_balance } from "../tools";
import { get_account, get_node, get_session } from "../utils";
import { Config, Network, NodeType } from "../types";

/**
 * Main class for interacting with WAX blockchain
 * Provides a unified interface for token operations, NFT management, trading and more
 *
 * @class WaxAgentToolkit
 * @property {string} privateKey - Private key for the WAX account
 * @property {string} accountName - Name of the WAX account
 * @property {Config} config - Configuration object containing API keys and settings
 * @property {NodeType} nodeType - Type of node to use (e.g., "hyperion", "atomic", "lightapi", "ipfs")
 * @property {Network} network - Network type (e.g., "mainnet", "testnet")
 * @property {string} chainId - Chain ID of the WAX network
 */
export class WaxAgentToolkit {
  /** Private key for the WAX account */
  public privateKey: string;
  /** Name of the WAX account being managed */
  public accountName: string;
  /** Configuration object containing API keys and settings */
  public config: Config;
  /** Type of node to use (e.g., "hyperion", "atomic", "lightapi", "ipfs") */
  public nodeType: NodeType;
  /** Network type (e.g., "mainnet", "testnet") */
  public network: Network;
  /** Chain ID of the WAX network */
  public chainId: string;

  /**
   * Creates a new instance of WaxAgentToolkit
   * @param private_key - Private key for the WAX account (required for signing transactions)
   * @param account_name - Name of the WAX account to operate with
   * @param chainId - Chain ID of the WAX network (e.g., "1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4")
   * @param nodeType - Type of node to use (defaults to "hyperion")
   * @param network - Network type (defaults to "mainnet")
   * @param configOrKey - Optional configuration object or OpenAI API key string
   */
  constructor(
    private_key: string,
    account_name: string,
    chainId: string,
    nodeType: NodeType = "hyperion",
    network: Network = "mainnet",
    configOrKey?: Config | string | null,
  ) {
    this.chainId = chainId;
    this.nodeType = nodeType;
    this.network = network;
    this.privateKey = private_key;

    // Create a session with the wallet

    this.accountName = account_name;

    if (typeof configOrKey === "string" || configOrKey === null) {
      this.config = { OPENAI_API_KEY: configOrKey || "" };
    } else {
      this.config = configOrKey as Config;
    }
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
  async get_account(accountName?: string): Promise<API.v1.AccountObject> {
    const account_name = accountName || this.accountName;
    return await get_account(this, account_name);
  }

  /**
   * Get a WAX node URL from the NodePulse service
   * @returns Promise resolving to a WAX node URL
   * @throws Error if node URL cannot be retrieved
   */
  async get_node(): Promise<string> {
    return await get_node(this, this.network, this.nodeType);
  }

  /**
   * Get a WAX session for blockchain interactions
   * @returns Promise resolving to a Session object
   * @throws Error if session cannot be created
   */
  async get_session(): Promise<Session> {
    return await get_session(this, this.chainId);
  }
}
