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

5. **Documentation**
   ```bash
   # Generate documentation
   pnpm docs
   ```

## Technical Stack
- TypeScript
- Node.js (v22+)
- LangChain
- OpenAI GPT-4
- WAX Blockchain SDK
- NodePulse for node management

The toolkit is designed for developers building AI-powered applications on the WAX blockchain, providing a secure and efficient way to interact with blockchain operations through natural language. 