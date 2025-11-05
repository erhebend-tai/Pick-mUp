# Pick-mUp: Obsidian LLM Extension with RAG

An advanced Obsidian extension that seamlessly integrates Large Language Models (LLMs) with your notes, featuring Retrieval-Augmented Generation (RAG) capabilities powered by SQL database.

## Features

### 🤖 Multiple LLM Providers
- **OpenAI**: GPT-3.5, GPT-4, and other OpenAI models
- **Anthropic**: Claude 3 (Sonnet, Opus, Haiku)
- **Local LLMs**: Ollama, LM Studio, and other local inference servers

### 🔍 RAG (Retrieval-Augmented Generation)
- Index your entire vault for semantic search
- SQL-based vector database for efficient storage and retrieval
- Find relevant context from your notes automatically
- Cosine similarity search for accurate results

### ⚙️ Customizable Settings
- Configure API keys for paid services
- Adjust temperature and max tokens
- Control RAG behavior and number of results
- Switch between providers easily

### 💡 Key Commands
- **Ask LLM with context**: Query the LLM using your current note as context
- **Ask LLM with RAG**: Search across all indexed notes for relevant context
- **Index current note**: Add the current note to the RAG database
- **Index all notes**: Index your entire vault for RAG

## Installation

### Manual Installation
1. Download the latest release
2. Extract the files to your vault's `.obsidian/plugins/pick-mup-llm-rag/` directory
3. Enable the plugin in Obsidian settings

### Building from Source
```bash
# Clone the repository
git clone https://github.com/erhebend-tai/Pick-mUp.git
cd Pick-mUp

# Install dependencies
npm install

# Build the plugin
npm run build
```

## Configuration

### OpenAI Setup
1. Get your API key from [OpenAI](https://platform.openai.com/api-keys)
2. Open Obsidian Settings → Pick-mUp LLM
3. Enter your API key in the OpenAI API Key field
4. Select your preferred model (default: gpt-3.5-turbo)

### Anthropic Setup
1. Get your API key from [Anthropic](https://console.anthropic.com/)
2. Open Obsidian Settings → Pick-mUp LLM
3. Enter your API key in the Anthropic API Key field
4. Select your preferred Claude model

### Local LLM Setup (Ollama)
1. Install [Ollama](https://ollama.ai/)
2. Pull a model: `ollama pull llama2`
3. Start the Ollama server (usually runs on http://localhost:11434)
4. In plugin settings, set:
   - Local LLM URL: `http://localhost:11434`
   - Local LLM Model: `llama2` (or your chosen model)
5. Select "Local LLM" as your default provider

## Usage

### Basic Query
1. Open a note
2. Press `Ctrl/Cmd + P` to open the command palette
3. Run "Ask LLM with context from current note"
4. Type your question and press "Ask"

### RAG-Powered Query
1. First, index your notes:
   - Run "Index all notes for RAG" from the command palette
   - Or index notes individually with "Index current note for RAG"
2. Run "Ask LLM with RAG (search across all notes)"
3. Type your question - the system will automatically find relevant notes
4. Get AI-powered answers based on your entire knowledge base

### Tips
- Index your vault regularly to keep RAG up-to-date
- Use RAG for questions that might span multiple notes
- Use current note context for focused, document-specific questions
- Adjust temperature for more creative (higher) or factual (lower) responses

## Architecture

### Components

**LLM Providers** (`providers/`)
- Abstraction layer for different LLM services
- OpenAI, Anthropic, and Local LLM implementations
- Consistent interface for message sending and embedding generation

**RAG Database** (`rag-database.ts`)
- SQL.js-based in-memory database
- Stores document content and embeddings
- Implements cosine similarity search
- Efficient indexing and retrieval

**Main Plugin** (`main.ts`)
- Obsidian plugin integration
- Command registration
- Provider management
- RAG coordination

**Settings** (`settings.ts`, `settings-tab.ts`)
- User configuration interface
- API key management
- Provider selection
- RAG parameters

## Technical Details

### Embeddings
- OpenAI: Uses text-embedding-ada-002 by default
- Local: Uses Ollama's embedding API
- Stored as JSON strings in SQL database

### Vector Search
- Cosine similarity for semantic matching
- In-memory database for fast queries
- Configurable number of results

### SQL Database
- SQL.js (SQLite compiled to WebAssembly)
- Tables: documents (id, source, content, embedding, created_at)
- Indexed by source for efficient updates

## Development

```bash
# Install dependencies
npm install

# Development mode (watch for changes)
npm run dev

# Production build
npm run build

# Run TypeScript compiler check
npm run build
```

## Security Notes

- API keys are stored in Obsidian's data.json (encrypted by Obsidian)
- Never commit API keys to version control
- Local LLMs provide privacy - no data sent externally
- RAG database is stored locally in your vault

## Troubleshooting

**"No embedding provider configured"**
- Configure either OpenAI or Local LLM in settings
- Make sure API key is entered correctly

**"Failed to initialize RAG database"**
- Check browser console for detailed errors
- Ensure sql.js can be loaded

**Local LLM not responding**
- Verify Ollama/LM Studio is running
- Check the URL (default: http://localhost:11434)
- Confirm the model is pulled: `ollama list`

**No RAG results found**
- Index your notes first using "Index all notes"
- Verify notes are being indexed successfully
- Check that RAG is enabled in settings

## Roadmap

- [ ] Streaming responses
- [ ] Custom prompt templates
- [ ] Multiple database backends
- [ ] Export/import indexed data
- [ ] Conversation history
- [ ] Fine-tuning support

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Credits

Built with:
- [Obsidian API](https://github.com/obsidianmd/obsidian-api)
- [SQL.js](https://github.com/sql-js/sql.js)
- OpenAI, Anthropic, and Ollama APIs