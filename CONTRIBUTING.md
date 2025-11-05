# Contributing to Pick-mUp

Thank you for your interest in contributing to Pick-mUp! This document provides guidelines and instructions for contributing.

## How to Contribute

### Reporting Bugs
1. Check if the bug has already been reported in Issues
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Your environment (OS, Obsidian version, plugin version)
   - Console errors if applicable

### Suggesting Features
1. Check if the feature has been suggested
2. Create a new issue labeled "enhancement"
3. Describe:
   - The problem it solves
   - Proposed solution
   - Alternative solutions considered
   - Additional context

### Pull Requests

#### Getting Started
```bash
# Fork the repository
git clone https://github.com/YOUR-USERNAME/Pick-mUp.git
cd Pick-mUp

# Install dependencies
npm install

# Create a branch
git checkout -b feature/your-feature-name
```

#### Development Workflow
```bash
# Start development mode (watches for changes)
npm run dev

# Test your changes in Obsidian
# Copy main.js, manifest.json, and styles.css to:
# /path/to/vault/.obsidian/plugins/pick-mup-llm-rag/

# Build for production
npm run build

# Check TypeScript types
npm run build
```

#### Code Style
- Use TypeScript for all code
- Follow existing code formatting
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions focused and small

#### Commit Messages
- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Reference issues: "Fix #123: Description"
- First line: short summary (50 chars or less)
- Body: detailed explanation if needed

Example:
```
Add streaming response support

- Implement streaming for OpenAI provider
- Add UI indicator for streaming status
- Update docs with streaming examples

Fixes #45
```

#### Pull Request Process
1. Update README.md if needed
2. Update CONFIGURATION.md for new settings
3. Test thoroughly:
   - All three providers (OpenAI, Anthropic, Local)
   - RAG functionality
   - Settings UI
   - Error handling
4. Create PR with:
   - Clear description of changes
   - Link to related issues
   - Screenshots for UI changes
   - Test results

## Development Guidelines

### Adding a New Provider

1. Create file in `providers/`:
```typescript
import { LLMProvider } from '../types';
import { PickMUpSettings } from '../settings';

export class NewProvider implements LLMProvider {
    name = 'NewProvider';
    
    constructor(private settings: PickMUpSettings) {}
    
    isConfigured(): boolean {
        // Check if API key/URL is set
    }
    
    async sendMessage(prompt: string, context?: string): Promise<string> {
        // Implementation
    }
}
```

2. Add settings in `settings.ts`:
```typescript
export interface PickMUpSettings {
    // ... existing
    newProviderApiKey: string;
    newProviderModel: string;
}

export const DEFAULT_SETTINGS = {
    // ... existing
    newProviderApiKey: '',
    newProviderModel: 'default-model'
}
```

3. Update settings UI in `settings-tab.ts`

4. Update main.ts to initialize provider

5. Update README.md with usage instructions

### Adding RAG Features

When adding RAG functionality:
- Consider performance impact
- Test with large vaults (1000+ notes)
- Handle errors gracefully
- Add progress indicators for long operations
- Document new features

### Testing

Manual Testing Checklist:
- [ ] Plugin loads without errors
- [ ] Settings save and persist
- [ ] OpenAI provider works
- [ ] Anthropic provider works
- [ ] Local LLM provider works
- [ ] RAG indexing works
- [ ] RAG search returns relevant results
- [ ] Error messages are helpful
- [ ] UI is responsive
- [ ] Works on mobile (if applicable)

### Code Architecture

```
main.ts                 # Plugin entry point, command registration
settings.ts            # Settings interface and defaults
settings-tab.ts        # Settings UI
types.ts               # TypeScript interfaces
rag-database.ts        # RAG database implementation
providers/
  ├── openai.ts        # OpenAI provider
  ├── anthropic.ts     # Anthropic provider
  └── local.ts         # Local LLM provider
```

### Common Tasks

#### Adding a New Command
```typescript
this.addCommand({
    id: 'command-id',
    name: 'Command Name',
    callback: async () => {
        // Implementation
    }
});
```

#### Adding a New Setting
1. Add to interface in settings.ts
2. Add default value
3. Add UI in settings-tab.ts
4. Use in relevant code

#### Debugging
- Enable Developer Tools: Ctrl+Shift+I (Windows/Linux) or Cmd+Opt+I (Mac)
- Check Console for errors
- Use console.log() for debugging
- Use debugger; for breakpoints

## Questions?

- Open a Discussion on GitHub
- Check existing Issues
- Read the documentation

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

Thank you for contributing! 🎉
