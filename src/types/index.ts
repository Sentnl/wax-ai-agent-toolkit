export interface Config {
  OPENAI_API_KEY?: string;
}
export type NodeType = "hyperion" | "atomic" | "lightapi" | "ipfs";
export type Network = "mainnet" | "testnet";

export interface ContractExecuteActionParams {
  contract_name: string;
  action_name: string;
  params?: Record<string, any>;
}

export interface ContractExecuteActionResult {
  status: "success" | "error";
  message: string;
  transaction?: string;
  code?: string;
  details?: any;
}

export interface ContractListTablesParams {
  table_name: string;
  table_keys: string[];
}
