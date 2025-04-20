# WAX AI Agent Toolkit Report

## Core Functionality
This is a TypeScript toolkit that combines LangChain with WAX blockchain capabilities, creating an AI-powered agent that can interact with the WAX blockchain. The toolkit provides:

1. **Blockchain Interaction Layer**
   - Account management
   - Token transfers
   - RAM management (buy/sell)
   - Contract interactions
   - Balance queries
   - Account information retrieval

2. **AI Integration**
   - Uses GPT-4 for natural language processing
   - Converts user requests into blockchain actions
   - Maintains conversation context
   - Provides intelligent responses

3. **Infrastructure**
   - Node management via NodePulse
   - Secure session handling
   - Transaction signing
   - Error handling and validation

## Testing Instructions

1. **Setup**
   ```bash
   # Install dependencies
   npm install
   
   # Copy .env.example to .env and fill in your credentials
   cp .env.example .env
   ```

2. **Environment Configuration**
   Required variables in `.env`:
   - `PRIVATE_KEY`: Your WAX account's private key
   - `ACCOUNT_NAME`: Your WAX account name
   - `RPC_URL`: WAX RPC endpoint
   - `CHAIN_ID`: WAX network chain ID
   - `OPENAI_API_KEY`: OpenAI API key
   - `NETWORK`: "mainnet" or "testnet"
   - `NODETYPE`: "hyperion", "atomic", "lightapi", or "ipfs"

3. **Running Tests**
   ```bash
   # Run interactive tests
   npm run est

   ```

4. **Available Commands**
   The agent currently supports these blockchain operations:
   - `balance`: Check account balances
   - `transfer`: Transfer tokens
   - `buy_ram`: Purchase RAM
   - `sell_ram`: Sell RAM
   - `get_account_info`: Get account details
   - `execute_action`: Execute contract actions
   - `list_actions`: List available contract actions
   - `list_table`: List contract tables
   - `read_table`: Read contract table data


## Technical Stack
- TypeScript
- Node.js (v22+)
- LangChain
- OpenAI GPT-4
- WAX Blockchain SDK
- NodePulse for node management

The toolkit is designed for developers building AI-powered applications on the WAX blockchain, providing a secure and efficient way to interact with blockchain operations through natural language. 



## Testing examples:

### Get account info for sentnlagents
```
Prompt: get account info for sentnlagents

Chatbot: Here is the account information for **sentnlagents**:

### Account Information:
- **Account Name:** sentnlagents
- **Account Created On:** 6/26/2020, 8:13:12 PM
- **Last Code Update:** 12/4/2024, 9:45:47 AM
- **Privileged Status:** No

### Resource Usage & Limits:
- **CPU Usage:** 272 / 18,542,442
- **Network Usage:** 320 / 111,090,468
- **RAM Usage:** 524,387 bytes / 3,029,225 bytes

### Core Liquid Balance:
- **Balance:** 610,537,721,294,735 148,067,7128

### Permissions:
1. **Permission 1:**
   - **Name:** 3617214756542218240
   - **Parent:** 12044502819693133824
   - **Required Authentication:** PUB_K1_6K4FJxAFRRyMbgnbfsXUczPQDXdJKMUeTw9ss4wa17e6EbSDnT
   - **Linked Actions:** None

2. **Permission 2:**
   - **Name:** 12044502819693133824
   - **Parent:** 0
   - **Required Authentication:** PUB_K1_7tPMYZHx9vWLY5ntXw7NE2swJUhhHyLH3hy8ASABj5u9pARPjj
   - **Linked Actions:** None

3. **Permission 3:**
   - **Name:** 15343383872893616128
   - **Parent:** 3617214756542218240
   - **Required Authentication:** PUB_K1_7GPsJqZ1jyyyTSyKsp7ccDfS8r5S7cq2dc2BY56DxeRhukmTBj
   - **Linked Actions:** [object Object]

### Resource Totals:
- **Total Net Weight:** 25,100,000,000 148,067,7128
- **Total CPU Weight:** 28,500,000,000 148,067,7128
- **Total RAM Bytes:** 3,027,825 bytes

If you need any further information or assistance, feel free to ask!
```


### Perform a token transfer:

```
Prompt: perform a transfer of 100.00000000 WAX from sentnlagents to sentnltestin
{"account":"eosio.token","name":"transfer","authorization":[{"actor":"sentnlagents","permission":"active"}],"data":"80f354ccc499a7c2305dc62ac799a7c200e40b540200000008574158000000002a5472616e736665722066726f6d2073656e746e6c6167656e747320746f2073656e746e6c74657374696e"}

Chatbot: The transfer of **100.00000000 WAX** from **sentnlagents** to **sentnltestin** has been successfully executed.

You can view the transaction details [here](https://testnet.waxblock.io/transaction/4900c61ff444bd6dc2159fa9bc57708d84c697edd062148326ef3e383f722155).
```

### List available actions for eosio.token contract

```
Prompt: can you list the available actions for the eosio.token contract

Chatbot: Here are the available actions for the **eosio.token** contract:

1. **Action Name:** close
   - **Type:** close
   - **Params:** 
     - `owner`: required

2. **Action Name:** create
   - **Type:** create
   - **Params:** 
     - `issuer`: required
     - `maximum_supply`: required

3. **Action Name:** issue
   - **Type:** issue
   - **Params:** 
     - `quantity`: required
     - `to`: required
     - `memo`: optional

4. **Action Name:** open
   - **Type:** open
   - **Params:** 
     - `ram_payer`: required
     - `owner`: required

5. **Action Name:** retire
   - **Type:** retire
   - **Params:** 
     - `quantity`: required
     - `memo`: optional

6. **Action Name:** transfer
   - **Type:** transfer
   - **Params:** 
     - `from`: required
     - `quantity`: required
     - `to`: required
     - `memo`: optional
```

Performing a contract action

```
Prompt: can you execute the transfer action on the eosio.token contract and transfer 200.00000000 WAX from sentnlagents to sentnltestin
{"account":"eosio.token","name":"transfer","authorization":[{"actor":"sentnlagents","permission":"active"}],"data":"80f354ccc499a7c2305dc62ac799a7c200c817a80400000008574158000000002a5472616e736665722066726f6d2073656e746e6c6167656e747320746f2073656e746e6c74657374696e"}

Chatbot: The transfer of **200.00000000 WAX** from **sentnlagents** to **sentnltestin** has been successfully executed.

You can view the transaction details [here](https://testnet.waxblock.io/transaction/5b2fbb3e31aacba21d23f9464cd0f48bb1ed9edeec705ed7c4c9fd4cc48447d1).

```



### list all the tables in the eosio.token contract


```
Prompt: can you list all the tables in the eosio.token contract

Chatbot: The `eosio.token` contract has the following tables:

1. **accounts**
   - Index Type: i64
   - Type: account

2. **stat**
   - Index Type: i64
   - Type: currency_stat
```