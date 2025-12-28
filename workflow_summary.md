# N8N Workflow Summary

## Workflow 1: ADMaker1 (Active)
**Purpose**: Automated ad campaign creation with AI-generated content and image generation.

**Key Components**:
- **Input**: Webhook endpoint "create-campaing" receives campaign parameters (brand, product, platforms, tone, goal, visual_style, cta, description, sources)
- **Brand Voice Generation**: Uses Groq Llama-3.3-70b to create brand voice based on provided brand information and sources
- **Ad Post Creation**: Generates ad content using the brand voice and campaign goals
- **Image Prompt Generation**: Creates detailed image prompts for ultra-realistic Instagram ads with brand text integration
- **Image Generation**: Sends prompts to local ComfyUI instance (localhost:8188) for AI image generation
- **Output**: Returns ad post, image prompt, and brand voice

**Technologies**: n8n workflow, Groq API, ComfyUI (local), Structured output parsing

## Workflow 2: Clear Future Consulting Services AI Tool (Inactive)
**Purpose**: Comprehensive website analysis and brand voice generation for consulting services.

**Key Components**:
- **Input**: Form submission with website URL(s) to analyze
- **Website Analysis**: Scrapes and analyzes website content for business insights, SWOT, growth opportunities
- **Brand Voice Generation**: Creates detailed brand voice analysis and recommendations
- **Report Generation**: Outputs structured HTML report with overview, product analysis, and recommendations
- **Output**: Interactive form displaying analysis results

**Technologies**: n8n workflow, Groq API, Web scraping capabilities, HTML generation

## Common Patterns
- Both workflows use Groq Llama-3.3-70b for AI language tasks
- Structured output parsing for consistent data formats
- Sequential agent execution with wait nodes for rate limiting
- Focus on brand analysis and content generation
- External dependencies: Groq API (hosted), ComfyUI (local for image gen)

## AI-Friendly Format Notes
- Workflows demonstrate multi-step AI pipelines with structured data flow
- Use of specialized prompts for different AI tasks (analysis, generation, creative content)
- Integration of multiple AI capabilities: text analysis, content generation, image prompts
- Emphasis on business value: marketing automation and consulting analysis
