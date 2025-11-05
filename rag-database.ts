import { RAGResult } from './types';
import { Notice } from 'obsidian';

interface DocumentEmbedding {
	id: number;
	source: string;
	content: string;
	embedding: string;
	created_at: number;
}

interface SQLJsStatic {
	Database: any;
}

declare global {
	interface Window {
		initSqlJs?: (config?: any) => Promise<SQLJsStatic>;
	}
}

export class RAGDatabase {
	private db: any = null;
	private SQL: SQLJsStatic | null = null;
	
	async initialize(): Promise<void> {
		try {
			// Try browser environment first (window.initSqlJs)
			let initSqlJs = window.initSqlJs;
			
			// Fallback to Node.js require for development/testing
			if (!initSqlJs) {
				try {
					initSqlJs = require('sql.js');
				} catch (e) {
					console.error('Failed to load sql.js:', e);
				}
			}
			
			if (!initSqlJs) {
				throw new Error('sql.js not available');
			}
			
			this.SQL = await initSqlJs({
				locateFile: (file: string) => `https://sql.js.org/dist/${file}`
			});
			
			if (!this.SQL) {
				throw new Error('Failed to initialize SQL.js');
			}
			
			// Create new database
			this.db = new this.SQL.Database();
			
			// Create tables
			this.db.run(`
				CREATE TABLE IF NOT EXISTS documents (
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					source TEXT NOT NULL,
					content TEXT NOT NULL,
					embedding TEXT,
					created_at INTEGER NOT NULL
				);
			`);
			
			this.db.run(`
				CREATE INDEX IF NOT EXISTS idx_source ON documents(source);
			`);
			
			console.log('RAG Database initialized successfully');
		} catch (error) {
			console.error('Failed to initialize RAG database:', error);
			new Notice('Failed to initialize RAG database. Some features may not work.');
		}
	}
	
	async addDocument(source: string, content: string, embedding: number[]): Promise<void> {
		if (!this.db) {
			throw new Error('Database not initialized');
		}
		
		const embeddingJson = JSON.stringify(embedding);
		const timestamp = Date.now();
		
		this.db.run(
			'INSERT INTO documents (source, content, embedding, created_at) VALUES (?, ?, ?, ?)',
			[source, content, embeddingJson, timestamp]
		);
	}
	
	async searchSimilar(queryEmbedding: number[], limit: number = 5): Promise<RAGResult[]> {
		if (!this.db) {
			throw new Error('Database not initialized');
		}
		
		const results: RAGResult[] = [];
		
		const stmt = this.db.prepare('SELECT id, source, content, embedding FROM documents');
		
		while (stmt.step()) {
			const row = stmt.getAsObject();
			const docEmbedding = JSON.parse(row.embedding as string);
			const similarity = this.cosineSimilarity(queryEmbedding, docEmbedding);
			
			results.push({
				content: row.content as string,
				source: row.source as string,
				score: similarity
			});
		}
		
		stmt.free();
		
		// Sort by similarity score (descending) and return top results
		results.sort((a, b) => b.score - a.score);
		return results.slice(0, limit);
	}
	
	async deleteBySource(source: string): Promise<void> {
		if (!this.db) {
			throw new Error('Database not initialized');
		}
		
		this.db.run('DELETE FROM documents WHERE source = ?', [source]);
	}
	
	async getAllDocuments(): Promise<DocumentEmbedding[]> {
		if (!this.db) {
			throw new Error('Database not initialized');
		}
		
		const results: DocumentEmbedding[] = [];
		const stmt = this.db.prepare('SELECT * FROM documents');
		
		while (stmt.step()) {
			results.push(stmt.getAsObject() as DocumentEmbedding);
		}
		
		stmt.free();
		return results;
	}
	
	async clearAll(): Promise<void> {
		if (!this.db) {
			throw new Error('Database not initialized');
		}
		
		this.db.run('DELETE FROM documents');
	}
	
	private cosineSimilarity(a: number[], b: number[]): number {
		if (a.length !== b.length) {
			throw new Error('Vectors must have the same length');
		}
		
		let dotProduct = 0;
		let normA = 0;
		let normB = 0;
		
		for (let i = 0; i < a.length; i++) {
			dotProduct += a[i] * b[i];
			normA += a[i] * a[i];
			normB += b[i] * b[i];
		}
		
		return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
	}
	
	async exportDatabase(): Promise<Uint8Array> {
		if (!this.db) {
			throw new Error('Database not initialized');
		}
		
		return this.db.export();
	}
	
	async importDatabase(data: Uint8Array): Promise<void> {
		if (!this.SQL) {
			throw new Error('SQL engine not initialized');
		}
		
		this.db = new this.SQL.Database(data);
	}
}
