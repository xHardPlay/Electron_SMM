# PopKornMachine - AI-Powered Marketing Automation

## 🤖 AI-Friendly Architecture

This project is designed to be **AI-friendly** with isolated, modular components that are easy to understand, modify, and extend. Each component has clear responsibilities and can be adjusted independently.

## 📁 Project Structure

```
PopKornMachine/
├── config/                 # 🔧 Configuration files (AI prompts, models, settings)
│   ├── prompts.json        # AI agent prompts (easily editable)
│   └── models.json         # Available AI models and settings
├── functions/              # ⚡ Cloudflare Functions (serverless APIs)
│   ├── api/
│   │   ├── workflow/       # 🏭 Main workflow APIs
│   │   │   ├── scrape.ts           # 🌐 Website scraping & brand extraction
│   │   │   └── content-bulk-generate.ts  # 📝 Bulk content generation
│   │   └── consulting/     # 💼 Consulting services
│   │       └── analyze.ts          # 📊 Brand analysis & SWOT
│   └── _middleware.ts      # 🔌 Middleware (if needed)
├── pages/                  # 🎨 Frontend (Cloudflare Pages)
│   ├── index.html          # 🏠 Landing page
│   ├── workflow.html       # 🚀 Main 5-phase workflow
│   ├── campaign.html       # 📢 Quick campaign creation
│   └── consulting.html     # 💡 Brand consulting
├── src/                    # 📚 Shared utilities (if needed)
├── types/                  # 📋 TypeScript definitions
├── docs/                   # 📖 Documentation
└── tests/                  # 🧪 Test files
```

## 🎯 Core Principles

### **1. Isolated Components**
Each AI agent, API endpoint, and UI component is **self-contained** and can be modified independently.

### **2. Configuration-Driven**
All prompts, models, and settings are in **JSON files** that can be edited without touching code.

### **3. Clear Naming & Documentation**
Every file, function, and variable has **descriptive names** and comprehensive comments.

### **4. Modular AI Agents**
Each AI capability is a separate **agent** with its own prompt, model, and configuration.

## 🌐 Live Demo

**Professional Landing Page (Dark Theme)**: https://71ce4d0e.popkornmachine.pages.dev

**Full Workflow Demo**: https://71ce4d0e.popkornmachine.pages.dev/workflow

## 🚀 Quick Start

### **1. Install Dependencies**
```bash
npm install
```

### **2. Configure AI Prompts**
Edit `config/prompts.json` to customize AI behavior:
```json
{
  "agents": {
    "website_scraper": {
      "name": "Website Content Scraper",
      "model": "@cf/meta/llama-3.1-8b-instruct",
      "prompt": "Your custom prompt here...",
      "max_tokens": 1000
    }
  }
}
```

### **3. Local Development**
```bash
npx wrangler pages dev
```
Visit: `http://127.0.0.1:8788`

### **4. Deploy to Production**
```bash
npx wrangler pages deploy
```

### **5. Automated Deployment (GitHub Actions)**
For automatic deployment on every push to main/master branch:
1. Set up the required secrets in your GitHub repository (see `.github/README.md`)
2. Push to main branch - deployment happens automatically
3. Monitor deployment status in GitHub Actions tab

## 🎭 AI Agents (Easily Customizable)

### **1. Website Scraper** (`config/prompts.json` → `website_scraper`)
- **Purpose**: Extract brand information from websites
- **Input**: URLs to analyze
- **Output**: Brand profile, personality, target audience
- **Customization**: Edit the prompt to focus on different aspects

### **2. Brand Voice Generator** (`config/prompts.json` → `brand_voice_generator`)
- **Purpose**: Create comprehensive brand voice guidelines
- **Input**: Scraped brand data + SWOT analysis
- **Output**: Communication guidelines, tone, personality
- **Customization**: Adjust for different brand voice frameworks

### **3. Content Creator** (`config/prompts.json` → `content_creator`)
- **Purpose**: Generate social media posts in bulk
- **Input**: Brand voice + platform + category
- **Output**: Platform-optimized posts with hashtags
- **Customization**: Change posting style, tone, or format

### **4. SWOT Analyzer** (`config/prompts.json` → `swot_analyzer`)
- **Purpose**: Create structured business analysis
- **Input**: Website analysis data
- **Output**: Strengths, weaknesses, opportunities, threats
- **Customization**: Modify analysis depth or focus areas

## 🔧 Configuration Files

### **`config/prompts.json`** - AI Behavior
```json
{
  "models": {
    "available": ["@cf/meta/llama-3.1-8b-instruct", "@cf/stabilityai/stable-diffusion-xl-base-1.0"],
    "text_generation": "@cf/meta/llama-3.1-8b-instruct",
    "image_generation": "@cf/stabilityai/stable-diffusion-xl-base-1.0"
  },
  "agents": {
    "website_scraper": {
      "name": "Website Content Scraper",
      "model": "@cf/meta/llama-3.1-8b-instruct",
      "max_tokens": 1000,
      "temperature": 0.7,
      "prompt": "Your custom scraping prompt..."
    }
  }
}
```

### **`wrangler.toml`** - Cloudflare Configuration
```toml
name = "popkornmachine"
compatibility_date = "2024-01-01"

# AI bindings
[ai]
binding = "AI"

# Storage (configure in Cloudflare dashboard)
# [[kv_namespaces]]
# binding = "METADATA"
# id = "your-kv-namespace-id"

# [[r2_buckets]]
# binding = "IMAGES"
# bucket_name = "popkornmachine-images"
```

## 🎨 Frontend Components

### **Workflow Pages** (`pages/*.html`)
- **Modular Design**: Each phase is a separate section
- **Progressive Enhancement**: Works without JavaScript
- **Accessible**: Semantic HTML with proper ARIA labels
- **Responsive**: Mobile-first design with Tailwind CSS

### **API Integration**
- **RESTful Endpoints**: Clean, predictable APIs
- **Error Handling**: Comprehensive error responses
- **Progress Indicators**: Real-time status updates

## ⚙️ Backend Architecture

### **Function Structure**
```typescript
// functions/api/workflow/scrape.ts
interface Env {
  AI: any;
  METADATA?: any; // Optional for local development
}

export const onRequestPost = async (context: any) => {
  // 1. Input validation
  // 2. Business logic
  // 3. AI processing
  // 4. Response formatting
};
```

### **Error Handling**
- **Graceful Degradation**: Functions work without optional bindings
- **Detailed Logging**: Console logs for debugging
- **User-Friendly Messages**: Clear error responses

## 🧪 Testing & Development

### **Local Testing**
```bash
# Start development server
npx wrangler pages dev

# Test specific endpoints
curl -X POST http://localhost:8788/api/workflow/scrape \
  -H "Content-Type: application/json" \
  -d '{"urls": ["https://example.com"]}'
```

### **AI Prompt Testing**
1. Edit `config/prompts.json`
2. Test with small inputs (5 posts instead of 100)
3. Check console logs for parsing success
4. Adjust prompts based on results

## 📖 API Documentation

### **Workflow Endpoints**

#### **POST `/api/workflow/scrape`**
Scrape websites and extract brand data.

**Request:**
```json
{
  "urls": ["https://example.com", "https://example2.com"],
  "industry": "Technology"
}
```

**Response:**
```json
{
  "id": "scrape_123",
  "brandName": "Example Corp",
  "description": "Tech company...",
  "aiInsights": {
    "personality": ["Innovative", "Professional"],
    "values": ["Quality", "Innovation"],
    "positioning": "Market leader"
  }
}
```

#### **POST `/api/workflow/content-bulk-generate`**
Generate posts in bulk.

**Request:**
```json
{
  "brandVoice": "Professional, innovative tech company...",
  "categories": ["educational", "promotional"],
  "platforms": ["instagram", "linkedin"],
  "count": 5,
  "goals": ["engagement"]
}
```

## 🔧 Customization Guide

### **1. Change AI Models**
Edit `config/prompts.json`:
```json
{
  "models": {
    "text_generation": "@cf/meta/llama-3.2-3b-instruct"
  }
}
```

### **2. Modify Prompts**
Update any agent's prompt in `config/prompts.json`:
```json
{
  "agents": {
    "content_creator": {
      "prompt": "Your custom content generation prompt..."
    }
  }
}
```

### **3. Add New Agents**
1. Add to `config/prompts.json`
2. Create new function in `functions/api/`
3. Update frontend to call new endpoint

### **4. Change UI Styling**
- Edit Tailwind classes in HTML files
- Modify CSS in `<style>` sections
- Update color scheme variables

## 🚨 Troubleshooting

### **Common Issues**

#### **"AI parsing failed"**
- Check `config/prompts.json` for correct prompt format
- Verify AI model is available
- Review console logs for parsing errors

#### **"Template content appearing"**
- AI generation failed, falling back to templates
- Check network connectivity
- Verify AI bindings in `wrangler.toml`

#### **"KV/R2 binding errors"**
- Comment out bindings in `wrangler.toml` for local development
- Create resources in Cloudflare dashboard for production

## 📈 Performance & Costs

### **Token Usage Estimates**
- **Website Scraping**: ~800 tokens per URL
- **Brand Voice Generation**: ~1200 tokens
- **Content Generation**: ~1500 tokens per 10 posts
- **SWOT Analysis**: ~1000 tokens

### **Optimization Tips**
- Use smaller batches for testing (5 posts)
- Cache AI responses in KV store
- Monitor usage in Cloudflare dashboard

## 🤝 Contributing

### **For AI Assistants**
1. **Read this README** first - understand the architecture
2. **Check `config/prompts.json`** for prompt customization
3. **Look at existing functions** for code patterns
4. **Test locally** before making changes
5. **Update documentation** when adding features

### **Code Standards**
- **TypeScript**: Strict type checking enabled
- **Error Handling**: Comprehensive try/catch blocks
- **Logging**: Console logs for debugging
- **Comments**: Explain complex logic

## 📚 Resources

- [Cloudflare AI Documentation](https://developers.cloudflare.com/workers-ai/)
- [Wrangler CLI Guide](https://developers.cloudflare.com/workers/wrangler/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Built for AI agents, by AI agents** 🤖✨

This project is designed to be **AI-maintainable** with clear structure, comprehensive documentation, and modular components that any AI assistant can understand and modify.
