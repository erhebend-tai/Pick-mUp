import { LLMProvider } from '../types';
import { PickMUpSettings } from '../settings';

export class AnthropicProvider implements LLMProvider {
	name = 'Anthropic';
	
	constructor(private settings: PickMUpSettings) {}
	
	isConfigured(): boolean {
		return this.settings.anthropicApiKey.length > 0;
	}
	
	async sendMessage(prompt: string, context?: string): Promise<string> {
		if (!this.isConfigured()) {
			throw new Error('Anthropic API key not configured');
		}
		
		let fullPrompt = prompt;
		if (context) {
			fullPrompt = `Here is some context from the user's notes:\n\n${context}\n\nNow, please answer the following question:\n\n${prompt}`;
		}
		
		const response = await fetch('https://api.anthropic.com/v1/messages', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': this.settings.anthropicApiKey,
				'anthropic-version': '2023-06-01'
			},
			body: JSON.stringify({
				model: this.settings.anthropicModel,
				max_tokens: this.settings.maxTokens,
				temperature: this.settings.temperature,
				messages: [
					{
						role: 'user',
						content: fullPrompt
					}
				]
			})
		});
		
		if (!response.ok) {
			const error = await response.text();
			throw new Error(`Anthropic API error: ${error}`);
		}
		
		const data = await response.json();
		return data.content[0].text;
	}
}
