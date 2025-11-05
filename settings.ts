export interface PickMUpSettings {
	// LLM Provider Settings
	defaultProvider: 'openai' | 'anthropic' | 'local';
	
	// OpenAI Settings
	openaiApiKey: string;
	openaiModel: string;
	openaiBaseUrl: string;
	
	// Anthropic Settings
	anthropicApiKey: string;
	anthropicModel: string;
	
	// Local LLM Settings (Ollama/LM Studio)
	localLlmUrl: string;
	localLlmModel: string;
	
	// RAG Settings
	enableRAG: boolean;
	ragMaxResults: number;
	embeddingModel: string;
	
	// SQL Database Settings
	databasePath: string;
	
	// General Settings
	temperature: number;
	maxTokens: number;
}

export const DEFAULT_SETTINGS: PickMUpSettings = {
	defaultProvider: 'openai',
	
	openaiApiKey: '',
	openaiModel: 'gpt-3.5-turbo',
	openaiBaseUrl: 'https://api.openai.com/v1',
	
	anthropicApiKey: '',
	anthropicModel: 'claude-3-sonnet-20240229',
	
	localLlmUrl: 'http://localhost:11434',
	localLlmModel: 'llama2',
	
	enableRAG: true,
	ragMaxResults: 5,
	embeddingModel: 'text-embedding-ada-002',
	
	databasePath: '',
	
	temperature: 0.7,
	maxTokens: 2000
}
