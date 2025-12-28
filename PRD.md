# Product Requirements Document (PRD) - PopKornMachine

## Overview
PopKornMachine is an AI-powered marketing automation platform that enables users to create comprehensive ad campaigns and perform brand analysis through automated workflows. The platform migrates from N8N-based workflows to a Cloudflare-native architecture, eliminating external dependencies and leveraging edge computing for improved performance.

## Core Features

### 1. Integrated Brand Profile & Content Generation Workflow
**Purpose**: Complete automated marketing content creation from brand discovery to ready-to-post assets.

**Workflow Sequence**:

#### Phase 1: Brand Profile Creation with AI Assistance
**Input Requirements**:
- Website URLs (1-5 URLs for brand research and data collection)
- Basic brand information (optional manual input)
- Business focus/industry

**AI-Powered Auto-Fill**:
- Website scraping and content analysis
- Brand personality extraction
- Visual style identification
- Target audience insights
- Competitive positioning
- Dynamic form population with collected data
- Real-time insights display

**Output**: Comprehensive brand profile with AI-enriched data

#### Phase 2: Brand Voice Generation
**Input Requirements**:
- Complete brand profile (from Phase 1)
- Tone preferences and style guidelines

**AI Processing**:
- Brand voice synthesis from collected data
- Communication style guidelines
- Content personality framework
- Language preferences and restrictions

**Output**: Structured brand voice profile for content generation

#### Phase 3: Bulk Content Generation (100 posts max)
**Input Requirements**:
- Brand voice profile
- Content categories/themes
- Platform selections
- Posting frequency preferences
- Content goals (engagement, conversion, awareness)

**AI Processing**:
- Bulk post content creation (up to 100 posts)
- Platform-optimized formatting
- Brand voice consistency
- Hashtag and emoji optimization
- Call-to-action integration

**Output**: 100 ready-to-post content pieces

#### Phase 4: Image Generation & Enhancement
**Input Requirements**:
- 100 content pieces from Phase 3
- Brand visual guidelines
- Client branding assets

**AI Processing**:
- Image prompt generation from content
- Ultra-realistic image creation
- Text-overlay image generation
- Video thumbnail creation
- Brand asset integration

**Image Overlays**:
- Client image: bottom right corner
- Phone number: integrated into image
- PopKornMachine logo: bottom left watermark

**Output**: 100 enhanced images/videos with brand integration

#### Phase 5: Post Assembly & Approval System
**Input Requirements**:
- 100 content pieces + 100 images/videos
- Platform specifications
- Scheduling preferences

**Processing**:
- Platform-specific post formatting
- Image-content pairing
- Ready-to-upload post packages
- Web-based approval interface

**Features**:
- Bulk approval/rejection
- Individual post editing
- Regeneration requests for declined content
- Complete content regeneration (new text + new images)
- Export functionality

**Output**: Approved, ready-to-post content packages

### 2. Legacy Features (Maintained)

#### Ad Campaign Creation (ADMaker1 Workflow)
**Purpose**: Quick campaign generation for existing brands.

#### Brand Consulting Services
**Purpose**: Standalone website analysis and brand recommendations.

## Technical Architecture

### Frontend Requirements
- **Framework**: Next.js 14+ with App Router
- **Deployment**: Cloudflare Pages
- **UI Components**: Tailwind CSS with responsive design
- **State Management**: React hooks with local storage
- **Form Handling**: Client-side validation with error states

### Backend Requirements
- **Runtime**: Cloudflare Workers (TypeScript)
- **AI Integration**: Cloudflare AI bindings
  - Text Generation: @cf/meta/llama-3.1-8b-instruct or @cf/meta/llama-3.2-3b-instruct
  - Image Generation: @cf/blackforestlabs/flux-1-schnell
- **Storage**: Cloudflare R2 (images), KV (metadata), Durable Objects (workflow state)
- **APIs**: RESTful endpoints with JSON responses

### AI Capabilities

#### Internal LLM for Data Processing
- **Brand Voice Generation**: Analyze brand information and sources to create consistent voice profiles
- **Content Creation**: Generate platform-specific ad copy with proper tone and messaging
- **Prompt Engineering**: Create detailed image generation prompts optimized for AI models
- **Data Analysis**: Process website content for business insights and recommendations

#### Internal LLM for Image Generation
- **Visual Content Creation**: Generate images using Cloudflare AI bindings
- **Brand Integration**: Incorporate brand elements, colors, and text into generated images
- **Style Consistency**: Maintain visual coherence across campaign assets

#### External LLM for Web Scraping
- **Website Analysis**: Extract and analyze website content using external LLMs (Groq/Gemini)
- **Content Parsing**: Structure scraped data for internal processing
- **Insight Generation**: Identify business opportunities and competitive advantages

## User Experience Requirements

### Campaign Creation Flow
1. **Form Input**: User fills campaign parameters through intuitive form interface
2. **Processing**: Real-time status updates during AI processing
3. **Preview**: Display generated content with edit capabilities
4. **Approval**: User reviews and approves final campaign assets
5. **Export**: Download or publish campaign materials

### Consulting Services Flow
1. **URL Input**: User provides website URLs for analysis
2. **Scraping**: Automated content extraction and processing
3. **Analysis**: AI-powered brand and business analysis
4. **Report Generation**: Interactive HTML reports with actionable insights
5. **Export**: Structured data export for client delivery

## Data Structures

### Campaign Input Schema
```typescript
interface CampaignInput {
  brand: {
    name: string;
    description: string;
    tone: string;
    visualStyle: string;
  };
  product: {
    name: string;
    description: string;
    targetAudience: string;
  };
  campaign: {
    goal: 'awareness' | 'conversion' | 'engagement';
    platforms: string[];
    cta: string;
  };
  sources: string[]; // URLs for research
}
```

### Campaign Output Schema
```typescript
interface CampaignOutput {
  brandVoice: string;
  adContent: {
    [platform: string]: string;
  };
  imagePrompts: string[];
  images: string[]; // URLs to generated images
  metadata: {
    createdAt: string;
    status: 'completed' | 'processing' | 'failed';
    references: string[];
  };
}
```

### Consulting Analysis Schema
```typescript
interface ConsultingInput {
  urls: string[];
  focus: string;
  depth: 'basic' | 'comprehensive';
}

interface ConsultingOutput {
  analysis: {
    overview: string;
    swot: {
      strengths: string[];
      weaknesses: string[];
      opportunities: string[];
      threats: string[];
    };
    recommendations: string[];
  };
  brandVoice: string;
  report: string; // HTML content
}
```

## API Endpoints

### Integrated Workflow Endpoints
- `POST /api/workflow/scrape` - Scrape URLs and extract brand data
- `POST /api/workflow/profile/create` - Create brand profile with AI assistance
- `POST /api/workflow/voice/generate` - Generate brand voice from profile
- `POST /api/workflow/content/bulk-generate` - Generate 100 posts in bulk
- `POST /api/workflow/images/bulk-generate` - Generate 100 images with overlays
- `POST /api/workflow/posts/assemble` - Assemble posts with approval system
- `POST /api/workflow/posts/:id/regenerate` - Regenerate declined content

### Legacy Endpoints (Maintained)
#### Campaign Endpoints
- `POST /api/campaign/create` - Create new campaign
- `GET /api/campaign/:id` - Retrieve campaign status/results
- `POST /api/campaign/:id/publish` - Publish campaign to platforms

#### Consulting Endpoints
- `POST /api/consulting/analyze` - Start website analysis
- `GET /api/consulting/:id` - Get analysis results

## Performance Requirements
- **Response Time**: < 5 seconds for form submissions, < 30 seconds for AI processing
- **Availability**: 99.9% uptime
- **Scalability**: Handle 100+ concurrent campaigns
- **Edge Distribution**: Global content delivery

## Security Requirements
- **Data Privacy**: Secure handling of user inputs and generated content
- **API Security**: Rate limiting, authentication for premium features
- **Content Safety**: AI content moderation and filtering

## Migration Considerations
- **Backward Compatibility**: Maintain access to existing campaign data
- **Data Migration**: Export existing N8N workflow results to new format
- **Feature Parity**: Ensure all current capabilities are preserved or enhanced

## Success Metrics
- **User Adoption**: Number of campaigns created per month
- **Processing Success Rate**: >95% successful AI generations
- **User Satisfaction**: Average processing time and quality ratings
- **Cost Efficiency**: Reduction in external API dependencies

## Implementation Phases

### Phase 1: Foundation
- Set up Cloudflare project structure
- Implement basic AI bindings
- Create core API endpoints

### Phase 2: Core Features
- Campaign creation workflow
- Image generation integration
- Consulting services implementation

### Phase 3: Enhancement
- Advanced AI prompt optimization
- Performance monitoring
- User interface refinements

### Phase 4: Optimization
- Load testing and scaling
- Cost optimization
- Advanced features (bulk processing, templates)

## AI-Friendly Implementation Notes
- **Structured Prompts**: All AI interactions use consistent prompt templates
- **Error Handling**: Comprehensive error states for AI failures
- **Caching Strategy**: Cache AI responses to reduce costs and improve performance
- **Modular Architecture**: Separate concerns for different AI capabilities
- **Monitoring**: Detailed logging for AI performance and usage tracking
