# Usage Examples

## Example 1: Research Assistant

**Scenario:** You're researching a topic across multiple notes and want to synthesize the information.

**Setup:**
1. Index your vault: `Cmd+P` → "Index all notes for RAG"
2. Set RAG Max Results to 8 in settings
3. Set Temperature to 0.5 for balanced responses

**Usage:**
```
Cmd+P → "Ask LLM with RAG"
Query: "What are the main themes in my notes about machine learning?"
```

**Result:** The LLM searches your notes, finds relevant content about machine learning, and provides a synthesized summary.

---

## Example 2: Note Summarization

**Scenario:** You have a long note and want a summary.

**Setup:**
1. Open the note
2. Set Temperature to 0.3 for factual summary

**Usage:**
```
Open note → Cmd+P → "Ask LLM with context from current note"
Query: "Summarize the key points of this note"
```

**Result:** A concise summary based on the current note content.

---

## Example 3: Cross-Reference Notes

**Scenario:** Find connections between different notes.

**Query:**
```
"How do my notes on productivity relate to my notes on mindfulness?"
```

**Result:** RAG finds relevant notes from both topics and the LLM explains connections.

---

## Example 4: Code Documentation

**Scenario:** You keep code snippets in notes and want explanations.

**Setup:**
1. Use Local LLM with codellama model
2. Temperature: 0.2

**Usage:**
```
Query: "Explain the Python code in this note and suggest improvements"
```

---

## Example 5: Creative Writing

**Scenario:** Brainstorm ideas for your story.

**Setup:**
1. Temperature: 0.9 (creative)
2. Max Tokens: 2000

**Usage:**
```
Query: "Based on my character notes, suggest 5 plot twists for chapter 3"
```

---

## Example 6: Daily Journal Insights

**Scenario:** Reflect on your journal entries.

**Setup:**
1. Index all journal notes
2. RAG: Enabled

**Query:**
```
"What patterns do you notice in my mood over the past month based on my journal entries?"
```

---

## Example 7: Meeting Notes Action Items

**Scenario:** Extract action items from meeting notes.

**Usage:**
```
Open meeting note → Ask LLM with context
Query: "List all action items and deadlines mentioned in this note"
```

**Result:**
```
Action Items:
1. Complete project proposal - Due Friday
2. Schedule follow-up meeting - Next week
3. Review budget numbers - Before EOD
```

---

## Example 8: Learning Assistant

**Scenario:** Study notes review.

**Setup:**
1. Index study notes
2. Temperature: 0.4

**Queries:**
- "Quiz me on the key concepts from my biology notes"
- "What are the most important formulas in my physics notes?"
- "Create flashcards from my history notes"

---

## Example 9: Book Notes Synthesis

**Scenario:** You've taken notes on multiple books and want to find common themes.

**Query:**
```
"What are the common themes across all my book notes about leadership?"
```

**Result:** Synthesizes insights from multiple book notes.

---

## Example 10: Task Planning

**Scenario:** Create a plan based on project notes.

**Setup:**
1. Open project note
2. Temperature: 0.6

**Query:**
```
"Based on this project outline, create a detailed 4-week implementation plan with milestones"
```

---

## Advanced Queries

### Meta-Analysis
```
"Analyze my writing style across all my blog post drafts and suggest improvements"
```

### Knowledge Gaps
```
"What topics do I have notes on that seem incomplete or need more research?"
```

### Trend Analysis
```
"How has my thinking on [topic] evolved over time based on my notes?"
```

### Content Generation
```
"Create a table of contents for a book based on my notes about [topic]"
```

### Comparison
```
"Compare and contrast the approaches mentioned in my notes about [topic A] and [topic B]"
```

---

## Tips for Better Results

### Be Specific
❌ "Tell me about my notes"
✅ "Summarize the key points about Redux from my React development notes"

### Provide Context
❌ "What should I do?"
✅ "Based on my project planning notes, what are the next 3 steps I should take?"

### Iterate
- Start with a broad query
- Refine based on results
- Ask follow-up questions

### Use Current Note Context When Appropriate
- For focused questions about one note
- When you want detailed analysis of specific content
- For note-specific transformations

### Use RAG for Broad Questions
- Cross-note synthesis
- Finding connections
- Discovering patterns
- Knowledge base queries

---

## Example Workflows

### Morning Routine
1. Ask: "What tasks did I mark as important in yesterday's notes?"
2. Ask: "Based on my weekly planning notes, what are today's priorities?"

### Study Session
1. Index course notes
2. Ask: "Quiz me on [topic]"
3. Check answers
4. Ask: "Explain [concept] in simpler terms"

### Writing Project
1. Open draft note
2. Ask: "Suggest improvements to the introduction"
3. Ask: "What points from my research notes support this argument?"
4. Ask: "Generate 5 alternative titles"

### Code Review
1. Open code note
2. Ask: "Review this code for potential bugs"
3. Ask: "Suggest performance improvements"
4. Ask: "Add inline documentation"

---

## Keyboard Shortcuts

Set up custom hotkeys in Obsidian:
- Settings → Hotkeys → Search "Pick-mUp"
- Assign shortcuts like:
  - `Ctrl+Shift+L` for "Ask LLM with context"
  - `Ctrl+Shift+R` for "Ask LLM with RAG"

---

## Provider Recommendations

### OpenAI GPT-4
- Best for: Complex reasoning, detailed analysis
- Cost: Higher
- Speed: Moderate

### OpenAI GPT-3.5-Turbo
- Best for: Quick queries, simple tasks
- Cost: Lower
- Speed: Fast

### Claude 3 Opus
- Best for: Long documents, nuanced understanding
- Cost: Higher
- Speed: Moderate

### Claude 3 Sonnet
- Best for: Balanced performance and cost
- Cost: Moderate
- Speed: Fast

### Local LLM (Llama2)
- Best for: Privacy, unlimited queries
- Cost: Free (hardware costs)
- Speed: Depends on hardware

---

## Common Patterns

### Question Answering
```
"What does [term] mean based on my notes?"
```

### Summarization
```
"Summarize this note in 3 bullet points"
```

### Extraction
```
"List all the books mentioned in my reading notes"
```

### Generation
```
"Generate 10 blog post ideas based on my notes about [topic]"
```

### Transformation
```
"Convert this note into a presentation outline"
```

### Analysis
```
"What are the pros and cons mentioned in this note?"
```

---

## Troubleshooting Examples

### No Results from RAG
**Problem:** Query returns "No relevant notes found"
**Solution:** 
1. Check notes are indexed
2. Try broader search terms
3. Reduce specificity of query

### Poor Quality Responses
**Problem:** Responses are generic or incorrect
**Solution:**
1. Provide more context
2. Be more specific in query
3. Adjust temperature (lower for factual)
4. Try different provider

### Slow Responses
**Problem:** Queries take too long
**Solution:**
1. Use GPT-3.5 instead of GPT-4
2. Reduce maxTokens
3. Use local LLM for repeated queries
4. Reduce RAG max results
