// ============================================================================
// PopKornMachine - TypeScript Type Definitions
// ============================================================================
// These types define the structure of all data flowing through the system.
// They ensure type safety and make the codebase AI-friendly and self-documenting.

export interface Env {
  AI: any;                    // Cloudflare AI binding
  METADATA?: any;            // KV namespace (optional for local dev)
  IMAGES?: any;              // R2 bucket (optional for local dev)
}

// ============================================================================
// WORKFLOW TYPES
// ============================================================================

export interface WorkflowSession {
  id: string;
  createdAt: string;
  lastModified: string;
  currentPhase: WorkflowPhase;
  brandData?: ScrapedBrandData;
  brandVoice?: BrandVoice;
  generatedContent?: GeneratedContent;
  status: 'active' | 'completed' | 'failed';
}

export enum WorkflowPhase {
  BRAND_DISCOVERY = 1,
  BRAND_VOICE_GENERATION = 2,
  BULK_CONTENT_GENERATION = 3,
  VISUAL_ASSETS_GENERATION = 4,
  APPROVAL_AND_EXPORT = 5
}

// ============================================================================
// BRAND DISCOVERY TYPES
// ============================================================================

export interface ScrapeRequest {
  urls: string[];
  industry?: string;
  depth?: 'basic' | 'comprehensive';
}

export interface ScrapedBrandData {
  id: string;
  brandName?: string;
  description?: string;
  tone?: string;
  visualStyle?: string;
  targetAudience?: string;
  industry?: string;
  websiteContent: Record<string, WebsiteAnalysis>;
  aiInsights: BrandInsights;
  confidence: number;
  metadata: ProcessingMetadata;
}

export interface WebsiteAnalysis {
  title?: string;
  description?: string;
  keywords?: string[];
  content?: string;
  insights?: string[];
  error?: string;
}

export interface BrandInsights {
  personality: string[];
  values: string[];
  positioning: string;
  opportunities: string[];
}

// ============================================================================
// BRAND VOICE TYPES
// ============================================================================

export interface BrandVoiceRequest {
  brandData: ScrapedBrandData;
  preferences?: {
    tone?: string;
    style?: string;
    restrictions?: string[];
  };
}

export interface BrandVoice {
  id: string;
  guidelines: {
    personality: string;
    tone: string;
    communicationStyle: string;
    keyMessages: string[];
    languagePreferences: string[];
    restrictions: string[];
    examples: {
      good: string[];
      avoid: string[];
    };
  };
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  recommendations: string[];
  metadata: ProcessingMetadata;
}

// ============================================================================
// CONTENT GENERATION TYPES
// ============================================================================

export interface BulkContentRequest {
  brandVoice: string;
  categories: ContentCategory[];
  platforms: Platform[];
  count: number;
  goals: ContentGoal[];
  brandData?: ScrapedBrandData;
}

export interface GeneratedContent {
  id: string;
  posts: ContentPost[];
  metadata: {
    totalGenerated: number;
    categoriesUsed: ContentCategory[];
    platformsUsed: Platform[];
    generationTime: number;
    createdAt: string;
  };
}

export interface ContentPost {
  id: string;
  text: string;
  platform: Platform;
  category: ContentCategory;
  goal: ContentGoal;
  hashtags: string[];
  characterCount: number;
  estimatedEngagement: EngagementLevel;
  brandVoiceAlignment: number;
  metadata?: {
    promptUsed?: string;
    modelUsed?: string;
    generationTime?: number;
  };
}

export type ContentCategory =
  | 'educational'
  | 'promotional'
  | 'engagement'
  | 'industry'
  | 'entertainment'
  | 'news'
  | 'behind_the_scenes';

export type Platform =
  | 'instagram'
  | 'facebook'
  | 'linkedin'
  | 'twitter'
  | 'tiktok'
  | 'youtube'
  | 'pinterest';

export type ContentGoal =
  | 'awareness'
  | 'engagement'
  | 'conversion'
  | 'traffic'
  | 'leads'
  | 'sales';

export type EngagementLevel = 'low' | 'medium' | 'high';

// ============================================================================
// VISUAL ASSETS TYPES
// ============================================================================

export interface VisualAssetsRequest {
  content: ContentPost[];
  branding: {
    clientImage?: string;
    phoneNumber?: string;
    logo?: string;
    colors?: string[];
    style?: string;
  };
  requirements: {
    imageTypes: ImageType[];
    dimensions?: ImageDimensions[];
    overlays: OverlayOptions;
  };
}

export interface GeneratedVisualAssets {
  id: string;
  assets: VisualAsset[];
  metadata: {
    totalGenerated: number;
    generationTime: number;
    createdAt: string;
  };
}

export interface VisualAsset {
  id: string;
  contentId: string;
  type: ImageType;
  url: string;
  thumbnail?: string;
  dimensions: ImageDimensions;
  overlays: AppliedOverlays;
  prompt: string;
  metadata: {
    modelUsed?: string;
    generationTime?: number;
  };
}

export type ImageType =
  | 'realistic'
  | 'text_overlay'
  | 'graphic'
  | 'video_thumbnail'
  | 'carousel'
  | 'story';

export interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: string;
}

export interface OverlayOptions {
  clientImage?: {
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    size: number;
    opacity?: number;
  };
  phoneNumber?: {
    position: 'top' | 'bottom' | 'center';
    style: 'text' | 'badge';
    color?: string;
  };
  logo?: {
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    size: number;
    opacity?: number;
  };
}

export interface AppliedOverlays {
  clientImage?: boolean;
  phoneNumber?: boolean;
  logo?: boolean;
}

// ============================================================================
// APPROVAL & EXPORT TYPES
// ============================================================================

export interface ApprovalRequest {
  contentId: string;
  approvedPosts: string[];  // Post IDs that were approved
  rejectedPosts: string[];  // Post IDs that were rejected
  feedback?: Record<string, string>; // Post ID -> feedback
}

export interface ExportRequest {
  workflowId: string;
  format: ExportFormat;
  includeImages: boolean;
  platformSpecific: boolean;
  scheduling?: SchedulingOptions;
}

export type ExportFormat =
  | 'json'
  | 'csv'
  | 'excel'
  | 'pdf'
  | 'social_scheduler'
  | 'buffer'
  | 'hootsuite';

export interface SchedulingOptions {
  startDate: string;
  frequency: 'daily' | 'weekly' | 'custom';
  timeSlots: string[];
  timezone: string;
}

export interface ExportedContent {
  id: string;
  workflowId: string;
  format: ExportFormat;
  content: any; // Format-specific content
  metadata: {
    totalPosts: number;
    approvedPosts: number;
    exportDate: string;
    version: string;
  };
}

// ============================================================================
// AI AGENT TYPES
// ============================================================================

export interface AIAgent {
  id: string;
  name: string;
  description: string;
  model: string;
  prompt: string;
  maxTokens: number;
  temperature: number;
  capabilities: string[];
  useCases: string[];
  fallbackModels?: string[];
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  contextWindow?: number;
  maxTokens?: number;
  capabilities: string[];
  useCases: string[];
  costPer1kTokens?: number;
  costPerImage?: number;
  description: string;
}

export interface AIPrompt {
  id: string;
  agentId: string;
  template: string;
  variables: string[];
  examples?: string[];
  version: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface ProcessingMetadata {
  createdAt: string;
  urlsProcessed?: string[];
  processingTime: number;
  modelUsed?: string;
  tokensUsed?: number;
  cost?: number;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    processingTime: number;
    version: string;
    timestamp: string;
  };
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface RateLimit {
  requestsPerMinute: number;
  requestsPerHour: number;
  tokensPerMinute: number;
  tokensPerHour: number;
}

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

export interface AppConfig {
  ai: {
    models: Record<string, AIModel>;
    agents: Record<string, AIAgent>;
    prompts: Record<string, AIPrompt>;
    limits: RateLimit;
  };
  storage: {
    kvNamespaces: string[];
    r2Buckets: string[];
    retention: {
      sessions: number; // hours
      exports: number;  // days
    };
  };
  ui: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    features: {
      debug: boolean;
      analytics: boolean;
      betaFeatures: boolean;
    };
  };
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export class PopKornError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'PopKornError';
  }
}

export class AIError extends PopKornError {
  constructor(message: string, details?: any) {
    super(message, 'AI_ERROR', 500, details);
    this.name = 'AIError';
  }
}

export class ValidationError extends PopKornError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

export class RateLimitError extends PopKornError {
  constructor(message: string, details?: any) {
    super(message, 'RATE_LIMIT_ERROR', 429, details);
    this.name = 'RateLimitError';
  }
}
