export interface LLMProvider {
	name: string;
	sendMessage(prompt: string, context?: string): Promise<string>;
	isConfigured(): boolean;
}

export interface LLMMessage {
	role: 'system' | 'user' | 'assistant';
	content: string;
}

export interface LLMResponse {
	content: string;
	model: string;
	usage?: {
		promptTokens: number;
		completionTokens: number;
		totalTokens: number;
	};
}

export interface EmbeddingProvider {
	generateEmbedding(text: string): Promise<number[]>;
}

export interface RAGResult {
	content: string;
	source: string;
	score: number;
}
