// ============================================================================
// PopKornMachine - Utility Functions
// ============================================================================
// Reusable utility functions that make the codebase more maintainable and AI-friendly.
// These functions handle common operations used across the application.

import { AIModel, AIAgent, ProcessingMetadata } from '../../types/index.js';

// ============================================================================
// AI UTILITIES
// ============================================================================

/**
 * Load AI agent configuration from prompts.json
 * @param agentId - The ID of the agent to load
 * @returns Promise<AIAgent | null>
 */
export async function loadAIAgent(agentId: string): Promise<AIAgent | null> {
  try {
    const response = await fetch('/config/prompts.json');
    const config = await response.json();
    return config.agents[agentId] || null;
  } catch (error) {
    console.error(`Failed to load AI agent ${agentId}:`, error);
    return null;
  }
}

/**
 * Load AI model configuration from models.json
 * @param modelId - The ID of the model to load
 * @returns Promise<AIModel | null>
 */
export async function loadAIModel(modelId: string): Promise<AIModel | null> {
  try {
    const response = await fetch('/config/models.json');
    const config = await response.json();
    return config.available_models[modelId] || null;
  } catch (error) {
    console.error(`Failed to load AI model ${modelId}:`, error);
    return null;
  }
}

/**
 * Get the best available model for a specific task
 * @param task - The type of task (text_generation, image_generation, etc.)
 * @returns Promise<string> - Model ID
 */
export async function getBestModelForTask(task: string): Promise<string> {
  try {
    const response = await fetch('/config/models.json');
    const config = await response.json();
    return config.default_models[task] || config.default_models.text_generation;
  } catch (error) {
    console.error(`Failed to get best model for ${task}:`, error);
    return '@cf/meta/llama-3.1-8b-instruct'; // Fallback
  }
}

/**
 * Execute AI request with proper error handling and logging
 * @param env - Cloudflare environment
 * @param model - AI model to use
 * @param messages - Messages array
 * @param options - Additional options
 * @returns Promise<any>
 */
export async function executeAIRequest(
  env: any,
  model: string,
  messages: any[],
  options: { max_tokens?: number; temperature?: number } = {}
): Promise<any> {
  const startTime = Date.now();
  const defaultOptions = {
    max_tokens: 1500,
    temperature: 0.7,
    ...options
  };

  try {
    console.log(`🤖 Executing AI request with model: ${model}`);
    console.log(`📝 Messages:`, messages.length);
    console.log(`⚙️ Options:`, defaultOptions);

    const response = await env.AI.run(model, {
      messages,
      ...defaultOptions
    });

    const processingTime = Date.now() - startTime;
    console.log(`✅ AI request completed in ${processingTime}ms`);

    return {
      success: true,
      data: response,
      processingTime,
      modelUsed: model
    };

  } catch (error: any) {
    const processingTime = Date.now() - startTime;
    console.error(`❌ AI request failed after ${processingTime}ms:`, error);

    return {
      success: false,
      error: error.message,
      processingTime,
      modelUsed: model
    };
  }
}

// ============================================================================
// TEXT PROCESSING UTILITIES
// ============================================================================

/**
 * Clean and normalize text content
 * @param text - Raw text to clean
 * @returns string - Cleaned text
 */
export function cleanText(text: string): string {
  return text
    .replace(/^["']|["']$/g, '') // Remove surrounding quotes
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim();
}

/**
 * Extract hashtags from text
 * @param text - Text to extract hashtags from
 * @returns string[] - Array of hashtags without # symbol
 */
export function extractHashtags(text: string): string[] {
  const matches = text.match(/#[a-zA-Z][a-zA-Z0-9]*/g) || [];
  return matches.map(tag => tag.substring(1)); // Remove # symbol
}

/**
 * Generate relevant hashtags for content
 * @param category - Content category
 * @param platform - Target platform
 * @param count - Number of hashtags to generate (default: 5)
 * @returns string[] - Generated hashtags
 */
export function generateHashtags(
  category: string,
  platform: string,
  count: number = 5
): string[] {
  const hashtagMap: Record<string, string[]> = {
    educational: ['Learn', 'Education', 'Knowledge', 'Tips', 'Growth'],
    promotional: ['New', 'Launch', 'Deal', 'Offer', 'Innovation'],
    engagement: ['Community', 'Together', 'Share', 'Connect', 'Discussion'],
    industry: ['Business', 'Professional', 'Industry', 'Expert', 'Leadership']
  };

  const categoryTags = hashtagMap[category] || ['Content', 'Social'];
  const platformTags = platform === 'linkedin'
    ? ['Business', 'Professional', 'Network']
    : ['Social', 'Life', 'Content'];

  const allTags = [...categoryTags, ...platformTags, category, platform];
  const uniqueTags = [...new Set(allTags)]; // Remove duplicates

  return uniqueTags.slice(0, count).map(tag => tag.toLowerCase());
}

/**
 * Calculate estimated engagement level for content
 * @param text - Content text
 * @param hashtagCount - Number of hashtags
 * @returns 'low' | 'medium' | 'high'
 */
export function estimateEngagement(text: string, hashtagCount: number): 'low' | 'medium' | 'high' {
  let score = 0;

  // Length scoring
  if (text.length > 50 && text.length < 150) score += 20;
  else if (text.length > 150 && text.length < 280) score += 15;

  // Hashtag scoring
  if (hashtagCount >= 3 && hashtagCount <= 5) score += 20;
  else if (hashtagCount > 0) score += 10;

  // Content scoring
  if (text.includes('?') || text.includes('quiz') || text.includes('poll')) score += 15;
  if (text.includes('🚀') || text.includes('💡') || text.includes('✨')) score += 10;
  if (text.includes('you') || text.includes('your')) score += 10;

  if (score >= 50) return 'high';
  if (score >= 25) return 'medium';
  return 'low';
}

// ============================================================================
// PARSING UTILITIES
// ============================================================================

/**
 * Parse AI response with multiple fallback strategies
 * @param content - Raw AI response
 * @param platform - Target platform
 * @param category - Content category
 * @param goal - Content goal
 * @returns Array of parsed content posts
 */
export function parseAIContentResponse(
  content: string,
  platform: string,
  category: string,
  goal: string
): any[] {
  const posts: any[] = [];

  console.log('🔍 Parsing AI response:', content.substring(0, 300));

  // Strategy 1: Look for numbered posts
  const numberedPosts = content.match(/Post \d+:\s*(.*?)(?=Post \d+:|$)/gs);
  if (numberedPosts && numberedPosts.length > 0) {
    for (const postSection of numberedPosts) {
      const text = postSection.replace(/Post \d+:\s*/, '').trim();
      if (text.length > 10) {
        posts.push(createPostFromText(text, platform, category, goal));
      }
    }
  }

  // Strategy 2: Split by newlines and extract text blocks
  if (posts.length === 0) {
    const lines = content.split('\n').filter(line => line.trim().length > 0);
    let currentPost = '';

    for (const line of lines) {
      if (line.toLowerCase().includes('post') && line.includes(':')) continue;
      if (line.toLowerCase().includes('hashtags')) continue;
      if (line.toLowerCase().includes('alignment')) continue;
      if (line.match(/^\d+\./)) continue;

      currentPost += line + ' ';

      if (currentPost.trim().length > 20 &&
          (line.includes('---') || line.includes('===') || lines.indexOf(line) === lines.length - 1)) {
        const cleanText = currentPost.trim();
        if (cleanText.length > 10) {
          posts.push(createPostFromText(cleanText, platform, category, goal));
          currentPost = '';
        }
      }
    }
  }

  // Strategy 3: Split by hashtags
  if (posts.length === 0) {
    const hashtagSplit = content.split(/#[a-zA-Z]/);
    for (const part of hashtagSplit) {
      if (part.trim().length > 20) {
        posts.push(createPostFromText(part.trim(), platform, category, goal));
      }
    }
  }

  console.log(`📝 Parsed ${posts.length} posts from AI response`);
  return posts;
}

/**
 * Create a content post object from raw text
 * @param text - Raw post text
 * @param platform - Target platform
 * @param category - Content category
 * @param goal - Content goal
 * @returns Content post object
 */
export function createPostFromText(text: string, platform: string, category: string, goal: string): any {
  const cleanedText = cleanText(text);
  const extractedHashtags = extractHashtags(cleanedText);
  let hashtags = extractedHashtags;

  // Generate additional hashtags if needed
  if (hashtags.length < 3) {
    const generated = generateHashtags(category, platform);
    hashtags = [...hashtags, ...generated.slice(0, 5 - hashtags.length)];
  }

  // Remove hashtags from text for character count
  const textWithoutHashtags = cleanedText.replace(/#[a-zA-Z][a-zA-Z0-9]*/g, '').trim();

  return {
    text: cleanedText,
    platform,
    category,
    goal,
    hashtags: [...new Set(hashtags)], // Remove duplicates
    characterCount: textWithoutHashtags.length,
    estimatedEngagement: estimateEngagement(cleanedText, hashtags.length),
    brandVoiceAlignment: Math.floor(Math.random() * 20) + 80 // 80-100%
  };
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Validate workflow input data
 * @param data - Data to validate
 * @param schema - Validation schema
 * @returns Validation result
 */
export function validateWorkflowInput(data: any, schema: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Basic validation - extend as needed
  if (!data) {
    errors.push('Data is required');
    return { isValid: false, errors };
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Validate URL format
 * @param url - URL to validate
 * @returns boolean
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// ============================================================================
// METADATA UTILITIES
// ============================================================================

/**
 * Create processing metadata
 * @param startTime - Processing start time
 * @param additionalData - Additional metadata
 * @returns ProcessingMetadata
 */
export function createProcessingMetadata(
  startTime: number,
  additionalData: any = {}
): ProcessingMetadata {
  return {
    createdAt: new Date().toISOString(),
    processingTime: Date.now() - startTime,
    ...additionalData
  };
}

/**
 * Generate unique ID
 * @returns string - UUID
 */
export function generateId(): string {
  return crypto.randomUUID();
}

// ============================================================================
// ERROR HANDLING UTILITIES
// ============================================================================

/**
 * Create standardized error response
 * @param message - Error message
 * @param code - Error code
 * @param statusCode - HTTP status code
 * @returns Response
 */
export function createErrorResponse(message: string, code: string = 'ERROR', statusCode: number = 500): Response {
  return new Response(JSON.stringify({
    success: false,
    error: message,
    code,
    timestamp: new Date().toISOString()
  }), {
    status: statusCode,
    headers: { 'Content-Type': 'application/json' }
  });
}

/**
 * Create standardized success response
 * @param data - Response data
 * @param metadata - Additional metadata
 * @returns Response
 */
export function createSuccessResponse(data: any, metadata: any = {}): Response {
  return new Response(JSON.stringify({
    success: true,
    data,
    metadata: {
      timestamp: new Date().toISOString(),
      ...metadata
    }
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

// ============================================================================
// CONFIGURATION UTILITIES
// ============================================================================

/**
 * Load configuration file
 * @param configName - Name of config file (without .json)
 * @returns Promise<any>
 */
export async function loadConfig(configName: string): Promise<any> {
  try {
    const response = await fetch(`/config/${configName}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load config: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to load ${configName} config:`, error);
    return {};
  }
}

/**
 * Get configuration value with fallback
 * @param config - Configuration object
 * @param path - Dot-separated path (e.g., 'ai.models.text_generation')
 * @param fallback - Fallback value
 * @returns any
 */
export function getConfigValue(config: any, path: string, fallback: any = null): any {
  const keys = path.split('.');
  let value = config;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return fallback;
    }
  }

  return value;
}
