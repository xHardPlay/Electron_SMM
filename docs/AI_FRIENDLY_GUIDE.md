# 🤖 AI-Friendly Development Guide

## Welcome, AI Assistant!

This guide helps you understand and work with the PopKornMachine codebase. The project is designed to be **AI-friendly** with clear structure, comprehensive documentation, and modular components.

## 📁 Quick Project Overview

```
PopKornMachine/
├── config/          # 🔧 JSON configs (edit these!)
│   ├── prompts.json # AI agent prompts
│   └── models.json  # AI model settings
├── functions/       # ⚡ Serverless functions
├── pages/           # 🎨 Frontend HTML
├── src/utils/       # 🛠️ Reusable utilities
├── types/           # 📋 TypeScript definitions
└── docs/            # 📖 Documentation (you're here!)
```

## 🎯 Key Principles

### 1. **Configuration-Driven**
Don't edit code to change behavior - edit JSON configs instead!

```json
// config/prompts.json - Change AI behavior here
{
  "agents": {
    "content_creator": {
      "prompt": "Your custom prompt here..."
    }
  }
}
```

### 2. **Isolated Components**
Each feature is self-contained and can be modified independently.

### 3. **Type-Safe**
Full TypeScript definitions ensure reliability.

### 4. **Well-Documented**
Every file, function, and type has clear documentation.

## 🚀 Common Tasks

### **Change AI Prompts**
1. Open `config/prompts.json`
2. Find the agent you want to modify
3. Edit the `prompt` field
4. Test locally: `npm run dev`

### **Add New AI Agent**
1. Add to `config/prompts.json`:
```json
{
  "agents": {
    "new_agent": {
      "name": "My New Agent",
      "model": "@cf/meta/llama-3.1-8b-instruct",
      "prompt": "Your prompt here...",
      "max_tokens": 1000
    }
  }
}
```
2. Create function in `functions/api/`
3. Update frontend if needed

### **Modify Content Types**
1. Update `types/index.ts` with new types
2. Update `config/prompts.json` with new prompts
3. Modify relevant functions

### **Add New Platform Support**
1. Add platform to `Platform` type in `types/index.ts`
2. Update prompts in `config/prompts.json`
3. Add platform-specific logic in functions

## 🔧 Available Utilities

### **AI Functions** (`src/utils/index.ts`)
```typescript
// Load AI agent config
const agent = await loadAIAgent('content_creator');

// Execute AI request
const result = await executeAIRequest(env, model, messages, options);

// Parse AI responses
const posts = parseAIContentResponse(content, platform, category, goal);
```

### **Text Processing**
```typescript
// Clean text
const clean = cleanText(rawText);

// Extract hashtags
const hashtags = extractHashtags(text);

// Generate hashtags
const tags = generateHashtags('educational', 'instagram', 5);
```

### **Validation & Error Handling**
```typescript
// Validate input
const validation = validateWorkflowInput(data, schema);

// Create responses
const success = createSuccessResponse(data, metadata);
const error = createErrorResponse('Error message', 'CODE', 400);
```

## 🎭 AI Agents Reference

| Agent | Purpose | Config Key | Model |
|-------|---------|------------|-------|
| Website Scraper | Extract brand data | `website_scraper` | Llama 3.1 |
| Brand Voice Generator | Create voice guidelines | `brand_voice_generator` | Llama 3.1 |
| Content Creator | Generate posts | `content_creator` | Llama 3.1 |
| SWOT Analyzer | Business analysis | `swot_analyzer` | Llama 3.1 |
| Image Prompt Generator | Create image prompts | `image_prompt_generator` | Llama 3.1 |

## ⚙️ Configuration Files

### **`config/prompts.json`**
- **What**: AI agent definitions and prompts
- **When to edit**: To change AI behavior or add new agents
- **Example**:
```json
{
  "agents": {
    "agent_name": {
      "name": "Display Name",
      "model": "@cf/meta/llama-3.1-8b-instruct",
      "prompt": "Your prompt with {variables}",
      "max_tokens": 1000,
      "temperature": 0.7
    }
  }
}
```

### **`config/models.json`**
- **What**: AI model configurations and limits
- **When to edit**: To change model settings or add new models
- **Example**:
```json
{
  "available_models": {
    "@cf/meta/llama-3.1-8b-instruct": {
      "name": "Llama 3.1 8B",
      "cost_per_1k_tokens": 0.00015
    }
  },
  "default_models": {
    "text_generation": "@cf/meta/llama-3.1-8b-instruct"
  }
}
```

## 📋 Development Workflow

### **1. Local Development**
```bash
npm install
npm run dev  # or npx wrangler pages dev
```

### **2. Make Changes**
- **Behavior changes**: Edit `config/*.json`
- **New features**: Add to `functions/` and `types/`
- **UI changes**: Modify `pages/*.html`

### **3. Test Changes**
```bash
# Test API endpoints
curl -X POST http://localhost:8788/api/workflow/scrape \
  -H "Content-Type: application/json" \
  -d '{"urls": ["https://example.com"]}'

# Test AI prompts
# Edit config/prompts.json, restart dev server, test
```

### **4. Deploy**
```bash
npm run deploy  # or npx wrangler pages deploy
```

## 🐛 Troubleshooting

### **"AI responses not parsing correctly"**
1. Check `config/prompts.json` for correct prompt format
2. Look at console logs for parsing attempts
3. Test with simpler prompts first

### **"TypeScript errors"**
1. Check `types/index.ts` for correct type definitions
2. Ensure function parameters match type signatures
3. Run `npx tsc --noEmit` to check for errors

### **"Configuration not loading"**
1. Verify JSON syntax in config files
2. Check file paths are correct
3. Ensure config files are in the right directory

## 📚 Key Files to Know

| File | Purpose | When to Edit |
|------|---------|--------------|
| `config/prompts.json` | AI behavior | Change AI responses |
| `config/models.json` | Model settings | Update models/limits |
| `types/index.ts` | Type definitions | Add new data structures |
| `src/utils/index.ts` | Utilities | Add reusable functions |
| `README.md` | Documentation | Update project info |

## 🎉 You're Ready!

The PopKornMachine codebase is designed to be **maintainable by AI assistants**. With this guide, you should be able to:

- ✅ Understand the project structure
- ✅ Modify AI behavior via configs
- ✅ Add new features following patterns
- ✅ Debug issues effectively
- ✅ Deploy changes safely

**Questions?** Check the README.md or look at existing code examples!

---

*Built for AI agents, by AI agents* 🤖✨
