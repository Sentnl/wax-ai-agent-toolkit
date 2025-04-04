import {
  APIClient,
  PublicKey,
  PrivateKey,
  Name,
  NameType,
} from "@wharfkit/antelope";
import { Account } from "@wharfkit/account";
import { Config } from "../types";
/**
 * Main class for interacting with wax blockchain
 * Provides a unified interface for token operations, NFT management, trading and more
 *
 * @class WaxAgentToolkit
 * @property {Account} account - Configuration object
 * @property {APIClient} client - Wax RPC connection
 * @property {Config} config - Configuration object
 * @property {PrivateKey} privateKey - Private key of the wallet
 * @property {PublicKey} wallet_address - Public key of the wallet
 */

export class WaxAgentToolkit {
  //   public account: Account;
  public client: APIClient;
  public privateKey: PrivateKey;
  public walletAddress: PublicKey;
  public accountName: string;
  public config?: Config;
  /**
   * @deprecated Using openai_api_key directly in constructor is deprecated.
   * Please use the new constructor with Config object instead:
   * @example
   * const agent = new WaxAgentToolkit(accountName, privateKey, rpcUrl, {
   *   OPENAI_API_KEY: 'your-key'
   * });
   */
  constructor(
    account_name: string,
    private_key: string,
    rpc_url: string,
    openai_api_key: string | null,
  );

  constructor(
    account_name: string,
    private_key: string,
    rpc_url: string,
    config?: Config,
  );

  constructor(
    account_name: string,
    private_key: string,
    rpc_url: string,
    configOrKey?: Config | string | null,
  ) {
    this.accountName = account_name;
    this.client = new APIClient({
      url: rpc_url || "https://api.mainnet-beta.solana.com",
    });
    this.privateKey = PrivateKey.from(private_key);
    this.walletAddress = this.privateKey.toPublic();

    // Handle both old and new patterns
    if (typeof configOrKey === "string" || configOrKey === null) {
      this.config = { OPENAI_API_KEY: configOrKey || "" };
    } else {
      this.config = configOrKey as Config;
    }
  }
}
