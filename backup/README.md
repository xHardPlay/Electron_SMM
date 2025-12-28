# AI Advertising Automation Platform

A Next.js application that generates AI-powered advertising campaigns and automates their publication across social media platforms using n8n and ComfyUI.

## Features

- **AI-Powered Content Generation**: Generate compelling ad copy and visuals using AI
- **Multi-Platform Publishing**: Support for Instagram, Facebook, and YouTube
- **Campaign Scheduling**: Publish immediately or schedule for later
- **Modular Architecture**: Easily extensible for future features

## Tech Stack

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **TailwindCSS** for styling
- **React** for UI components

### Backend Integration
- **n8n** for workflow orchestration and automation
- **ComfyUI** for AI image generation
- **External LLM APIs** for copy generation

## Architecture

```
Frontend (Next.js)
    ↓
n8n Webhooks (API Layer)
    ↓
ComfyUI (Visual Generation)
    ↓
n8n (Social Media Publishing)
```

## Project Structure

```
/app
  /campaign
    page.tsx                    # Main campaign page
    components/
      CampaignForm.tsx          # Campaign creation form
      PreviewCard.tsx           # Content preview and editing
      PublishControls.tsx       # Publishing and scheduling
/services
  n8n.ts                        # N8n webhook integration
  comfy.ts                      # ComfyUI integration (future use)
/types
  campaign.ts                   # TypeScript definitions
```

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pop-korn-machine
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` with your configuration:
   ```env
   NEXT_PUBLIC_N8N_BASE_URL=http://localhost:5678/webhook
   N8N_WEBHOOK_SECRET=your-webhook-secret
   COMFYUI_BASE_URL=http://localhost:8188
   ```

4. **Set up n8n workflows**
   - Install and start n8n at `http://localhost:5678`
   - Import the workflow files:
     - `n8n-workflow-create-campaign.json` - Campaign creation workflow
     - `n8n-workflow-publish.json` - Campaign publishing workflow
   - Configure OpenAI API key in n8n for copy generation
   - Set up Facebook/Instagram API credentials

5. **Set up ComfyUI** (optional for image generation)
   - Install ComfyUI at `http://localhost:8188`
   - Create a workflow that accepts:
     ```json
     {
       "prompt": "string",
       "style": "string",
       "format": "1:1"
     }
     ```
   - Returns:
     ```json
     {
       "image_url": "string"
     }
     ```
   - The n8n workflow expects this API contract

6. **Start development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration

The application uses two configuration files:

- **`.env.local`**: Environment-specific variables (API URLs, secrets)
- **`config.json`**: Application configuration (features, platforms, settings)

## API Integration

### Next.js API Routes (Proxy)

The frontend communicates with n8n through Next.js API routes that proxy requests, avoiding CORS issues:

- `POST /api/campaign/create` → Proxies to n8n `/webhook/create-campaign`
- `POST /api/campaign/publish` → Proxies to n8n `/webhook/publish`

### N8n Webhooks

The actual n8n webhooks that handle the business logic:

- `POST /webhook/create-campaign`: Generate campaign content
- `POST /webhook/publish`: Publish or schedule campaign

### ComfyUI Integration

Image generation is handled by ComfyUI workflows triggered by n8n.

## Development

### Code Quality

- **ESLint**: Code linting
- **TypeScript**: Type checking
- **Prettier**: Code formatting (via editor)

### Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm run start
   ```

## Roadmap

### Phase 1 (Current)
- ✅ Image + text campaigns
- ✅ Instagram + Facebook publishing
- ✅ Manual publishing

### Phase 2
- Video shorts generation
- A/B copy testing
- Campaign calendar

### Phase 3
- Multi-user support
- Campaign analytics
- Advanced scheduling

## Contributing

1. Follow the existing code structure
2. Use TypeScript for all new code
3. Maintain modular architecture
4. Update documentation for significant changes

## License

This project is part of the PopKorn Machine initiative.
