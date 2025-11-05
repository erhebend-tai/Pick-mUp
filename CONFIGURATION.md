# Configuration Examples

## OpenAI Configuration

### Basic Setup
```json
{
  "defaultProvider": "openai",
  "openaiApiKey": "sk-your-api-key-here",
  "openaiModel": "gpt-3.5-turbo",
  "openaiBaseUrl": "https://api.openai.com/v1"
}
```

### Advanced Models
```json
{
  "openaiModel": "gpt-4",
  "temperature": 0.7,
  "maxTokens": 4000
}
```

### Custom Endpoint (Azure OpenAI)
```json
{
  "openaiBaseUrl": "https://your-resource.openai.azure.com/",
  "openaiApiKey": "your-azure-key"
}
```

## Anthropic Configuration

### Claude 3 Sonnet
```json
{
  "defaultProvider": "anthropic",
  "anthropicApiKey": "sk-ant-your-key-here",
  "anthropicModel": "claude-3-sonnet-20240229"
}
```

### Claude 3 Opus (Most Capable)
```json
{
  "anthropicModel": "claude-3-opus-20240229",
  "maxTokens": 4096
}
```

## Local LLM Configuration

### Ollama Setup
```json
{
  "defaultProvider": "local",
  "localLlmUrl": "http://localhost:11434",
  "localLlmModel": "llama2"
}
```

### LM Studio Setup
```json
{
  "localLlmUrl": "http://localhost:1234/v1",
  "localLlmModel": "local-model"
}
```

### Available Ollama Models
- llama2
- llama2:13b
- mistral
- codellama
- phi
- neural-chat

Pull a model:
```bash
ollama pull llama2
ollama pull mistral
```

## RAG Configuration

### Standard Setup
```json
{
  "enableRAG": true,
  "ragMaxResults": 5,
  "embeddingModel": "text-embedding-ada-002"
}
```

### High Precision
```json
{
  "ragMaxResults": 10,
  "temperature": 0.3
}
```

### Creative Mode
```json
{
  "temperature": 0.9,
  "maxTokens": 3000
}
```

## Use Cases

### Research Assistant
**Settings:**
- Provider: OpenAI or Claude
- RAG: Enabled
- Max Results: 8
- Temperature: 0.5

**Best for:** Synthesizing information across multiple notes

### Creative Writing
**Settings:**
- Provider: OpenAI GPT-4
- Temperature: 0.9
- Max Tokens: 2000
- RAG: Disabled or limited

**Best for:** Story development, brainstorming

### Code Documentation
**Settings:**
- Provider: Local (codellama)
- Temperature: 0.2
- RAG: Enabled

**Best for:** Technical notes, code snippets

### Daily Journaling
**Settings:**
- Provider: Any
- Temperature: 0.7
- RAG: Enabled
- Max Results: 3

**Best for:** Connecting today's thoughts with past entries

## Environment Variables (Alternative)

You can also use environment variables:

```bash
export OPENAI_API_KEY="sk-..."
export ANTHROPIC_API_KEY="sk-ant-..."
export LOCAL_LLM_URL="http://localhost:11434"
```

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for CI/CD
3. **Rotate keys regularly**
4. **Use read-only keys** where possible
5. **Monitor API usage** to detect unauthorized access
6. **Consider local LLMs** for sensitive data

## Troubleshooting

### API Key Issues
- Ensure no extra spaces in the key
- Check key permissions on provider dashboard
- Verify account has credits/billing set up

### Connection Issues
- Check firewall settings
- Verify proxy configuration
- Test endpoint with curl:
  ```bash
  curl -X POST http://localhost:11434/api/generate -d '{"model": "llama2", "prompt": "test"}'
  ```

### RAG Not Working
- Ensure notes are indexed: Run "Index all notes"
- Check embedding provider is configured
- Verify database initialized correctly
- Look for errors in Developer Console (Ctrl+Shift+I)

## Performance Tips

1. **Index incrementally**: Index new notes as you create them
2. **Adjust max results**: Lower numbers = faster queries
3. **Use appropriate models**: GPT-3.5 is faster than GPT-4
4. **Local LLMs**: Faster for repeated queries, no API costs
5. **Temperature**: Lower values = faster, more deterministic responses
