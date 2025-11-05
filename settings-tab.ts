import { App, PluginSettingTab, Setting } from 'obsidian';
import PickMUpPlugin from './main';

export class PickMUpSettingTab extends PluginSettingTab {
	plugin: PickMUpPlugin;

	constructor(app: App, plugin: PickMUpPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl('h2', { text: 'Pick-mUp LLM Settings' });

		// Default Provider
		new Setting(containerEl)
			.setName('Default LLM Provider')
			.setDesc('Choose the default LLM provider to use')
			.addDropdown(dropdown => dropdown
				.addOption('openai', 'OpenAI')
				.addOption('anthropic', 'Anthropic (Claude)')
				.addOption('local', 'Local LLM (Ollama/LM Studio)')
				.setValue(this.plugin.settings.defaultProvider)
				.onChange(async (value: 'openai' | 'anthropic' | 'local') => {
					this.plugin.settings.defaultProvider = value;
					await this.plugin.saveSettings();
				}));

		// OpenAI Settings
		containerEl.createEl('h3', { text: 'OpenAI Settings' });

		new Setting(containerEl)
			.setName('OpenAI API Key')
			.setDesc('Enter your OpenAI API key')
			.addText(text => text
				.setPlaceholder('sk-...')
				.setValue(this.plugin.settings.openaiApiKey)
				.onChange(async (value) => {
					this.plugin.settings.openaiApiKey = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('OpenAI Model')
			.setDesc('The OpenAI model to use')
			.addText(text => text
				.setPlaceholder('gpt-3.5-turbo')
				.setValue(this.plugin.settings.openaiModel)
				.onChange(async (value) => {
					this.plugin.settings.openaiModel = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('OpenAI Base URL')
			.setDesc('Base URL for OpenAI API (for custom endpoints)')
			.addText(text => text
				.setPlaceholder('https://api.openai.com/v1')
				.setValue(this.plugin.settings.openaiBaseUrl)
				.onChange(async (value) => {
					this.plugin.settings.openaiBaseUrl = value;
					await this.plugin.saveSettings();
				}));

		// Anthropic Settings
		containerEl.createEl('h3', { text: 'Anthropic Settings' });

		new Setting(containerEl)
			.setName('Anthropic API Key')
			.setDesc('Enter your Anthropic API key')
			.addText(text => text
				.setPlaceholder('sk-ant-...')
				.setValue(this.plugin.settings.anthropicApiKey)
				.onChange(async (value) => {
					this.plugin.settings.anthropicApiKey = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Anthropic Model')
			.setDesc('The Anthropic model to use')
			.addText(text => text
				.setPlaceholder('claude-3-sonnet-20240229')
				.setValue(this.plugin.settings.anthropicModel)
				.onChange(async (value) => {
					this.plugin.settings.anthropicModel = value;
					await this.plugin.saveSettings();
				}));

		// Local LLM Settings
		containerEl.createEl('h3', { text: 'Local LLM Settings' });

		new Setting(containerEl)
			.setName('Local LLM URL')
			.setDesc('URL for your local LLM server (Ollama/LM Studio)')
			.addText(text => text
				.setPlaceholder('http://localhost:11434')
				.setValue(this.plugin.settings.localLlmUrl)
				.onChange(async (value) => {
					this.plugin.settings.localLlmUrl = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Local LLM Model')
			.setDesc('Model name for your local LLM')
			.addText(text => text
				.setPlaceholder('llama2')
				.setValue(this.plugin.settings.localLlmModel)
				.onChange(async (value) => {
					this.plugin.settings.localLlmModel = value;
					await this.plugin.saveSettings();
				}));

		// RAG Settings
		containerEl.createEl('h3', { text: 'RAG (Retrieval-Augmented Generation) Settings' });

		new Setting(containerEl)
			.setName('Enable RAG')
			.setDesc('Use RAG to provide context from your notes')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.enableRAG)
				.onChange(async (value) => {
					this.plugin.settings.enableRAG = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Max RAG Results')
			.setDesc('Maximum number of relevant notes to include as context')
			.addSlider(slider => slider
				.setLimits(1, 10, 1)
				.setValue(this.plugin.settings.ragMaxResults)
				.setDynamicTooltip()
				.onChange(async (value) => {
					this.plugin.settings.ragMaxResults = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Embedding Model')
			.setDesc('Model to use for generating embeddings')
			.addText(text => text
				.setPlaceholder('text-embedding-ada-002')
				.setValue(this.plugin.settings.embeddingModel)
				.onChange(async (value) => {
					this.plugin.settings.embeddingModel = value;
					await this.plugin.saveSettings();
				}));

		// General Settings
		containerEl.createEl('h3', { text: 'General Settings' });

		new Setting(containerEl)
			.setName('Temperature')
			.setDesc('Control randomness in responses (0.0 = deterministic, 1.0 = creative)')
			.addSlider(slider => slider
				.setLimits(0, 1, 0.1)
				.setValue(this.plugin.settings.temperature)
				.setDynamicTooltip()
				.onChange(async (value) => {
					this.plugin.settings.temperature = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Max Tokens')
			.setDesc('Maximum length of the response')
			.addText(text => text
				.setPlaceholder('2000')
				.setValue(String(this.plugin.settings.maxTokens))
				.onChange(async (value) => {
					const numValue = parseInt(value);
					if (!isNaN(numValue) && numValue > 0) {
						this.plugin.settings.maxTokens = numValue;
						await this.plugin.saveSettings();
					}
				}));

		// RAG Management
		containerEl.createEl('h3', { text: 'RAG Database Management' });

		new Setting(containerEl)
			.setName('Index All Notes')
			.setDesc('Index all notes in your vault for RAG')
			.addButton(button => button
				.setButtonText('Index Now')
				.onClick(async () => {
					await this.plugin.indexAllNotes();
				}));

		new Setting(containerEl)
			.setName('Clear RAG Database')
			.setDesc('Remove all indexed notes from the RAG database')
			.addButton(button => button
				.setButtonText('Clear Database')
				.setWarning()
				.onClick(async () => {
					await this.plugin.clearRAGDatabase();
				}));
	}
}
