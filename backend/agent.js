import { StarknetAgent } from "starknet-agent-kit";
import dotenv from "dotenv";

dotenv.config();


console.log('Environment Variables:', {
  aiProvider: process.env.AI_PROVIDER,
  aiModel: process.env.AI_MODEL,
  rpcUrl: process.env.RPC_URL,
 
  hasApiKey: !!process.env.AI_PROVIDER_API_KEY,
  hasPrivateKey: !!process.env.PRIVATE_KEY
});

const config = {
  aiProviderApiKey: process.env.AI_PROVIDER_API_KEY || '',
  aiProvider: process.env.AI_PROVIDER || 'openai', 
  aiModel: process.env.AI_MODEL || '', 
  walletPrivateKey: process.env.PRIVATE_KEY || '',
  rpcUrl: process.env.RPC_URL || '',
};

// Validate configuration before creating agent
if (!config.aiProviderApiKey) {
  throw new Error('AI Provider API Key is required');
}

if (!config.aiProvider) {
  throw new Error('AI Provider is required');
}

export const agent = new StarknetAgent(config);

export const executeAgent = async (prompt) => {
  try {
    const response = await agent.execute(prompt);
    return response;
  } catch (error) {
    console.error('Agent execution error:', error);
    throw error;
  }
};