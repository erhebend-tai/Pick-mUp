import { LLMProvider } from '../types';
import { PickMUpSettings } from '../settings';

export class LocalLLMProvider implements LLMProvider {
	name = 'Local LLM';
	
	constructor(private settings: PickMUpSettings) {}
	
	isConfigured(): boolean {
		return this.settings.localLlmUrl.length > 0 && this.settings.localLlmModel.length > 0;
	}
	
	async sendMessage(prompt: string, context?: string): Promise<string> {
		if (!this.isConfigured()) {
			throw new Error('Local LLM not configured');
		}
		
		let fullPrompt = prompt;
		if (context) {
			fullPrompt = `Context from notes:\n${context}\n\nQuestion: ${prompt}`;
		}
		
		// Support for Ollama API format
		const response = await fetch(`${this.settings.localLlmUrl}/api/generate`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				model: this.settings.localLlmModel,
				prompt: fullPrompt,
				stream: false,
				options: {
					temperature: this.settings.temperature,
					num_predict: this.settings.maxTokens
				}
			})
		});
		
		if (!response.ok) {
			const error = await response.text();
			throw new Error(`Local LLM API error: ${error}`);
		}
		
		const data = await response.json();
		return data.response;
	}
	
	async generateEmbedding(text: string): Promise<number[]> {
		if (!this.isConfigured()) {
			throw new Error('Local LLM not configured');
		}
		
		// Support for Ollama embeddings API
		const response = await fetch(`${this.settings.localLlmUrl}/api/embeddings`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				model: this.settings.localLlmModel,
				prompt: text
			})
		});
		
		if (!response.ok) {
			const error = await response.text();
			throw new Error(`Local LLM Embedding API error: ${error}`);
		}
		
		const data = await response.json();
		return data.embedding;
	}
}
