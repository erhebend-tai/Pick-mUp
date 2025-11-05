import { App, Editor, MarkdownView, Modal, Notice, Plugin, TFile } from 'obsidian';
import { PickMUpSettings, DEFAULT_SETTINGS } from './settings';
import { PickMUpSettingTab } from './settings-tab';
import { LLMProvider } from './types';
import { OpenAIProvider } from './providers/openai';
import { AnthropicProvider } from './providers/anthropic';
import { LocalLLMProvider } from './providers/local';
import { RAGDatabase } from './rag-database';

export default class PickMUpPlugin extends Plugin {
	settings: PickMUpSettings;
	ragDatabase: RAGDatabase;
	private openaiProvider: OpenAIProvider;
	private anthropicProvider: AnthropicProvider;
	private localProvider: LocalLLMProvider;

	async onload() {
		await this.loadSettings();

		// Initialize providers
		this.openaiProvider = new OpenAIProvider(this.settings);
		this.anthropicProvider = new AnthropicProvider(this.settings);
		this.localProvider = new LocalLLMProvider(this.settings);

		// Initialize RAG database
		this.ragDatabase = new RAGDatabase();
		await this.ragDatabase.initialize();

		// Add ribbon icon
		this.addRibbonIcon('bot', 'Pick-mUp LLM', (evt: MouseEvent) => {
			new Notice('Pick-mUp LLM is ready!');
		});

		// Add command to ask LLM with current note context
		this.addCommand({
			id: 'ask-llm-with-context',
			name: 'Ask LLM with context from current note',
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				const noteContent = editor.getValue();
				new LLMQueryModal(this.app, this, noteContent, false).open();
			}
		});

		// Add command to ask LLM with RAG
		this.addCommand({
			id: 'ask-llm-with-rag',
			name: 'Ask LLM with RAG (search across all notes)',
			callback: async () => {
				new LLMQueryModal(this.app, this, '', true).open();
			}
		});

		// Add command to index current note
		this.addCommand({
			id: 'index-current-note',
			name: 'Index current note for RAG',
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				const file = view.file;
				if (file) {
					await this.indexNote(file);
					new Notice(`Indexed: ${file.basename}`);
				}
			}
		});

		// Add command to index all notes
		this.addCommand({
			id: 'index-all-notes',
			name: 'Index all notes for RAG',
			callback: async () => {
				await this.indexAllNotes();
			}
		});

		// Add settings tab
		this.addSettingTab(new PickMUpSettingTab(this.app, this));

		console.log('Pick-mUp LLM plugin loaded');
	}

	onunload() {
		console.log('Pick-mUp LLM plugin unloaded');
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
		// Reinitialize providers with new settings
		this.openaiProvider = new OpenAIProvider(this.settings);
		this.anthropicProvider = new AnthropicProvider(this.settings);
		this.localProvider = new LocalLLMProvider(this.settings);
	}

	getActiveProvider(): LLMProvider {
		switch (this.settings.defaultProvider) {
			case 'openai':
				return this.openaiProvider;
			case 'anthropic':
				return this.anthropicProvider;
			case 'local':
				return this.localProvider;
			default:
				return this.openaiProvider;
		}
	}

	async askLLM(prompt: string, context?: string): Promise<string> {
		const provider = this.getActiveProvider();
		
		if (!provider.isConfigured()) {
			throw new Error(`${provider.name} is not configured. Please add your API key in settings.`);
		}

		return await provider.sendMessage(prompt, context);
	}

	async generateEmbedding(text: string): Promise<number[]> {
		// Use OpenAI for embeddings by default, or local LLM if configured
		if (this.settings.defaultProvider === 'local' && this.localProvider.isConfigured()) {
			return await this.localProvider.generateEmbedding(text);
		} else if (this.openaiProvider.isConfigured()) {
			return await this.openaiProvider.generateEmbedding(text);
		} else {
			throw new Error('No embedding provider configured. Please configure OpenAI or Local LLM.');
		}
	}

	async indexNote(file: TFile): Promise<void> {
		try {
			const content = await this.app.vault.read(file);
			
			// Generate embedding for the note
			const embedding = await this.generateEmbedding(content);
			
			// Store in RAG database
			await this.ragDatabase.addDocument(file.path, content, embedding);
		} catch (error) {
			console.error(`Failed to index note ${file.path}:`, error);
			throw error;
		}
	}

	async indexAllNotes(): Promise<void> {
		const files = this.app.vault.getMarkdownFiles();
		new Notice(`Indexing ${files.length} notes...`);
		
		let indexed = 0;
		for (const file of files) {
			try {
				await this.indexNote(file);
				indexed++;
				
				if (indexed % 10 === 0) {
					new Notice(`Indexed ${indexed}/${files.length} notes...`);
				}
			} catch (error) {
				console.error(`Failed to index ${file.path}:`, error);
			}
		}
		
		new Notice(`Successfully indexed ${indexed} notes!`);
	}

	async searchRAG(query: string): Promise<string> {
		// Generate embedding for the query
		const queryEmbedding = await this.generateEmbedding(query);
		
		// Search for similar documents
		const results = await this.ragDatabase.searchSimilar(
			queryEmbedding,
			this.settings.ragMaxResults
		);
		
		// Format results as context
		if (results.length === 0) {
			return '';
		}
		
		const contextParts = results.map((result, index) => 
			`[Source ${index + 1}: ${result.source}]\n${result.content}\n`
		);
		
		return contextParts.join('\n---\n\n');
	}

	async clearRAGDatabase(): Promise<void> {
		await this.ragDatabase.clearAll();
		new Notice('RAG database cleared');
	}
}

class LLMQueryModal extends Modal {
	plugin: PickMUpPlugin;
	noteContext: string;
	useRAG: boolean;
	queryInput: HTMLTextAreaElement;
	responseDiv: HTMLDivElement;

	constructor(app: App, plugin: PickMUpPlugin, noteContext: string, useRAG: boolean) {
		super(app);
		this.plugin = plugin;
		this.noteContext = noteContext;
		this.useRAG = useRAG;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();

		contentEl.createEl('h2', { text: 'Ask LLM' });

		if (this.useRAG) {
			contentEl.createEl('p', { 
				text: 'Ask a question and the LLM will search your notes for relevant context.',
				cls: 'setting-item-description'
			});
		} else {
			contentEl.createEl('p', { 
				text: 'Ask a question about the current note.',
				cls: 'setting-item-description'
			});
		}

		// Query input
		contentEl.createEl('label', { text: 'Your Question:' });
		this.queryInput = contentEl.createEl('textarea', {
			placeholder: 'Ask me anything...',
		});
		this.queryInput.style.width = '100%';
		this.queryInput.style.minHeight = '100px';
		this.queryInput.style.marginBottom = '10px';

		// Submit button
		const buttonDiv = contentEl.createEl('div');
		buttonDiv.style.marginBottom = '20px';
		
		const submitButton = buttonDiv.createEl('button', { text: 'Ask' });
		submitButton.style.marginRight = '10px';
		submitButton.addEventListener('click', async () => {
			await this.handleQuery();
		});

		const closeButton = buttonDiv.createEl('button', { text: 'Close' });
		closeButton.addEventListener('click', () => {
			this.close();
		});

		// Response area
		contentEl.createEl('h3', { text: 'Response:' });
		this.responseDiv = contentEl.createEl('div', { cls: 'llm-response' });
		this.responseDiv.style.padding = '10px';
		this.responseDiv.style.border = '1px solid var(--background-modifier-border)';
		this.responseDiv.style.borderRadius = '5px';
		this.responseDiv.style.minHeight = '100px';
		this.responseDiv.style.whiteSpace = 'pre-wrap';
		this.responseDiv.style.maxHeight = '400px';
		this.responseDiv.style.overflowY = 'auto';
	}

	async handleQuery() {
		const query = this.queryInput.value.trim();
		
		if (!query) {
			new Notice('Please enter a question');
			return;
		}

		this.responseDiv.setText('Thinking...');

		try {
			let context = '';
			
			if (this.useRAG && this.plugin.settings.enableRAG) {
				// Use RAG to find relevant context
				context = await this.plugin.searchRAG(query);
				if (!context) {
					new Notice('No relevant notes found. Make sure to index your notes first.');
				}
			} else if (this.noteContext) {
				// Use current note as context
				context = this.noteContext;
			}

			const response = await this.plugin.askLLM(query, context);
			this.responseDiv.setText(response);
		} catch (error) {
			this.responseDiv.setText(`Error: ${error.message}`);
			new Notice(`Error: ${error.message}`);
		}
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
