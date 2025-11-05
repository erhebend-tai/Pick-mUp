import { LLMProvider, EmbeddingProvider } from '../types';
import { PickMUpSettings } from '../settings';

export class OpenAIProvider implements LLMProvider, EmbeddingProvider {
	name = 'OpenAI';
	
	constructor(private settings: PickMUpSettings) {}
	
	isConfigured(): boolean {
		return this.settings.openaiApiKey.length > 0;
	}
	
	async sendMessage(prompt: string, context?: string): Promise<string> {
		if (!this.isConfigured()) {
			throw new Error('OpenAI API key not configured');
		}
		
		const messages = [];
		if (context) {
			messages.push({
				role: 'system',
				content: `You are a helpful AI assistant. Use the following context from the user's notes to provide relevant answers:\n\n${context}`
			});
		}
		messages.push({
			role: 'user',
			content: prompt
		});
		
		const response = await fetch(`${this.settings.openaiBaseUrl}/chat/completions`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${this.settings.openaiApiKey}`
			},
			body: JSON.stringify({
				model: this.settings.openaiModel,
				messages: messages,
				temperature: this.settings.temperature,
				max_tokens: this.settings.maxTokens
			})
		});
		
		if (!response.ok) {
			const error = await response.text();
			throw new Error(`OpenAI API error: ${error}`);
		}
		
		const data = await response.json();
		return data.choices[0].message.content;
	}
	
	async generateEmbedding(text: string): Promise<number[]> {
		if (!this.isConfigured()) {
			throw new Error('OpenAI API key not configured');
		}
		
		const response = await fetch(`${this.settings.openaiBaseUrl}/embeddings`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${this.settings.openaiApiKey}`
			},
			body: JSON.stringify({
				model: this.settings.embeddingModel,
				input: text
			})
		});
		
		if (!response.ok) {
			const error = await response.text();
			throw new Error(`OpenAI Embedding API error: ${error}`);
		}
		
		const data = await response.json();
		return data.data[0].embedding;
	}
}
