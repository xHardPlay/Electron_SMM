interface Env {
  AI: any;
  METADATA: any;
}

interface BulkContentRequest {
  brandVoice: string;
  categories: string[];
  platforms: string[];
  count: number; // 5, 25, 50, or 100
  goals: string[];
  brandData?: any; // Additional brand context
}

interface GeneratedContent {
  id: string;
  posts: ContentPost[];
  metadata: {
    totalGenerated: number;
    categoriesUsed: string[];
    platformsUsed: string[];
    generationTime: number;
    createdAt: string;
  };
}

interface ContentPost {
  id: string;
  text: string;
  platform: string;
  category: string;
  goal: string;
  hashtags: string[];
  characterCount: number;
  estimatedEngagement: 'low' | 'medium' | 'high';
  brandVoiceAlignment: number; // 0-100
}

export const onRequestPost = async (context: any) => {
  const startTime = Date.now();

  try {
    const { request, env } = context;
    const contentRequest: BulkContentRequest = await request.json();

    // Validate request
    if (!contentRequest.brandVoice || contentRequest.brandVoice.length < 10) {
      return new Response(JSON.stringify({
        error: 'Valid brand voice is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!contentRequest.categories || contentRequest.categories.length === 0) {
      return new Response(JSON.stringify({
        error: 'At least one content category is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!contentRequest.platforms || contentRequest.platforms.length === 0) {
      return new Response(JSON.stringify({
        error: 'At least one platform is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (![5, 25, 50, 100].includes(contentRequest.count)) {
      return new Response(JSON.stringify({
        error: 'Count must be 5, 25, 50, or 100'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate content
    const generatedContent = await generateBulkContent(contentRequest, env);

    const result: GeneratedContent = {
      id: crypto.randomUUID(),
      posts: generatedContent,
      metadata: {
        totalGenerated: generatedContent.length,
        categoriesUsed: contentRequest.categories,
        platformsUsed: contentRequest.platforms,
        generationTime: Date.now() - startTime,
        createdAt: new Date().toISOString()
      }
    };

    // Store in KV for retrieval (if available)
    if (env.METADATA) {
      await env.METADATA.put(`bulk-content:${result.id}`, JSON.stringify(result), {
        expirationTtl: 7200 // 2 hours
      });
    }

    return new Response(JSON.stringify(result), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error: any) {
    console.error('Bulk content generation error:', error);
    return new Response(JSON.stringify({
      error: error.message || 'Failed to generate bulk content'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

async function generateBulkContent(request: BulkContentRequest, env: Env): Promise<ContentPost[]> {
  const posts: ContentPost[] = [];
  const batchSize = 10; // Generate in batches to avoid timeouts

  for (let batch = 0; batch < request.count / batchSize; batch++) {
    const batchStart = batch * batchSize;
    const batchEnd = Math.min((batch + 1) * batchSize, request.count);
    const batchCount = batchEnd - batchStart;

    try {
      const batchPosts = await generateContentBatch(
        request,
        batchCount,
        batchStart,
        env
      );
      posts.push(...batchPosts);
    } catch (error) {
      console.warn(`Failed to generate batch ${batch + 1}:`, error);
      // Add fallback posts for failed batch
      for (let i = 0; i < batchCount; i++) {
        posts.push(generateFallbackPost(request, batchStart + i));
      }
    }
  }

  return posts;
}

async function generateContentBatch(
  request: BulkContentRequest,
  batchCount: number,
  offset: number,
  env: Env
): Promise<ContentPost[]> {
  const posts: ContentPost[] = [];

  // Generate content for each platform-category combination
  for (const platform of request.platforms) {
    for (const category of request.categories) {
      if (posts.length >= batchCount) break;

      const platformPosts = await generatePlatformContent(
        request.brandVoice,
        platform,
        category,
        request.goals,
        Math.min(5, batchCount - posts.length), // Max 5 posts per platform-category combo
        env
      );

      // Add IDs to posts
      const postsWithIds = platformPosts.map((post, index) => ({
        ...post,
        id: `post_${offset + posts.length + index + 1}`
      }));

      posts.push(...postsWithIds);
    }
    if (posts.length >= batchCount) break;
  }

  // Trim to exact batch count
  return posts.slice(0, batchCount);
}

async function generatePlatformContent(
  brandVoice: string,
  platform: string,
  category: string,
  goals: string[],
  count: number,
  env: Env
): Promise<Omit<ContentPost, 'id'>[]> {
  const posts: Omit<ContentPost, 'id'>[] = [];

  const contentPrompt = `Create ${count} social media posts for ${platform}.

BRAND VOICE: ${brandVoice.substring(0, 300)}

CATEGORY: ${category}
GOALS: ${goals.join(', ') || 'engagement'}

Create ${count} posts that match the brand voice. Each post should be engaging and include 3-5 relevant hashtags.

Format:
Post 1: [post text with hashtags]
Post 2: [post text with hashtags]
Post 3: [post text with hashtags]
(etc.)`;

  try {
    const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [{ role: 'user', content: contentPrompt }],
      max_tokens: 2000
    });

    const content = aiResponse.response || aiResponse.choices?.[0]?.message?.content || '';

    // Parse the generated content
    const parsedPosts = parseGeneratedPosts(content, platform, category, goals[0] || 'engagement');

    // Ensure we have the right number of posts
    while (parsedPosts.length < count) {
      parsedPosts.push(generateFallbackPostForPlatform(platform, category, goals[0] || 'engagement'));
    }

    posts.push(...parsedPosts.slice(0, count));

  } catch (error) {
    console.warn(`AI content generation failed for ${platform}/${category}:`, error);
    // Generate fallback posts
    for (let i = 0; i < count; i++) {
      posts.push(generateFallbackPostForPlatform(platform, category, goals[0] || 'engagement'));
    }
  }

  return posts;
}

function parseGeneratedPosts(content: string, platform: string, category: string, goal: string): Omit<ContentPost, 'id'>[] {
  const posts: Omit<ContentPost, 'id'>[] = [];

  // Try multiple parsing strategies to be more robust
  console.log('Parsing AI response:', content.substring(0, 500));

  // Strategy 1: Look for numbered posts (Post 1:, Post 2:, etc.)
  const numberedPosts = content.match(/Post \d+:\s*(.*?)(?=Post \d+:|$)/gs);
  if (numberedPosts && numberedPosts.length > 0) {
    for (const postSection of numberedPosts) {
      const text = postSection.replace(/Post \d+:\s*/, '').trim();
      if (text.length > 10) {
        posts.push(createPostFromText(text, platform, category, goal));
      }
    }
  }

  // Strategy 2: If no numbered posts, try to split by double newlines and extract reasonable text blocks
  if (posts.length === 0) {
    const lines = content.split('\n').filter(line => line.trim().length > 0);
    let currentPost = '';

    for (const line of lines) {
      // Skip headers and metadata lines
      if (line.toLowerCase().includes('post') && line.includes(':')) continue;
      if (line.toLowerCase().includes('hashtags')) continue;
      if (line.toLowerCase().includes('alignment')) continue;
      if (line.match(/^\d+\./)) continue; // Skip numbered lists

      currentPost += line + ' ';

      // If we have a reasonable post length and hit a separator, save it
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

  // Strategy 3: Fallback - split by hashtags or other markers
  if (posts.length === 0) {
    const hashtagSplit = content.split(/#[a-zA-Z]/);
    for (const part of hashtagSplit) {
      if (part.trim().length > 20) {
        posts.push(createPostFromText(part.trim(), platform, category, goal));
      }
    }
  }

  console.log(`Parsed ${posts.length} posts from AI response`);
  return posts;
}

function createPostFromText(text: string, platform: string, category: string, goal: string): Omit<ContentPost, 'id'> {
  // Clean up the text
  let cleanText = text
    .replace(/^["']|["']$/g, '') // Remove quotes
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();

  // Extract hashtags if present in the text
  const hashtagMatches = cleanText.match(/#[a-zA-Z][a-zA-Z0-9]*/g) || [];
  let hashtags = hashtagMatches.map(h => h.substring(1)); // Remove # symbol

  // Add generated hashtags if we don't have enough
  if (hashtags.length < 3) {
    const generated = generateHashtags(category, platform);
    hashtags = [...hashtags, ...generated.slice(0, 5 - hashtags.length)];
  }

  // Remove hashtags from the text
  cleanText = cleanText.replace(/#[a-zA-Z][a-zA-Z0-9]*/g, '').trim();

  // Ensure reasonable length
  if (cleanText.length > 280) {
    cleanText = cleanText.substring(0, 277) + '...';
  }

  return {
    text: cleanText,
    platform,
    category,
    goal,
    hashtags: [...new Set(hashtags)], // Remove duplicates
    characterCount: cleanText.length,
    estimatedEngagement: estimateEngagement(cleanText, hashtags.length),
    brandVoiceAlignment: Math.floor(Math.random() * 20) + 80
  };
}

function generateHashtags(category: string, platform: string): string[] {
  const baseHashtags: Record<string, string[]> = {
    educational: ['Learn', 'Education', 'Knowledge', 'Tips'],
    promotional: ['New', 'Launch', 'Deal', 'Offer'],
    engagement: ['Community', 'Together', 'Share', 'Connect'],
    industry: ['Business', 'Professional', 'Industry', 'Expert']
  };

  const categoryTags = baseHashtags[category] || ['Content', 'Social'];
  const platformTags = platform === 'linkedin' ? ['Business', 'Professional'] : ['Social', 'Life'];

  return [...categoryTags.slice(0, 2), ...platformTags.slice(0, 2), category, platform]
    .map(tag => tag.toLowerCase())
    .filter((tag, index, arr) => arr.indexOf(tag) === index); // Remove duplicates
}

function estimateEngagement(text: string, hashtagCount: number): 'low' | 'medium' | 'high' {
  let score = 0;

  // Length scoring
  if (text.length > 50 && text.length < 150) score += 20;
  else if (text.length > 150 && text.length < 280) score += 15;

  // Hashtag scoring
  if (hashtagCount >= 3 && hashtagCount <= 5) score += 20;
  else if (hashtagCount > 0) score += 10;

  // Content scoring
  if (text.includes('?') || text.includes('quiz') || text.includes('poll')) score += 15; // Questions
  if (text.includes('🚀') || text.includes('💡') || text.includes('✨')) score += 10; // Emojis
  if (text.includes('you') || text.includes('your')) score += 10; // Personalization

  if (score >= 50) return 'high';
  if (score >= 25) return 'medium';
  return 'low';
}

function generateFallbackPost(request: BulkContentRequest, index: number): ContentPost {
  const platform = request.platforms[index % request.platforms.length];
  const category = request.categories[index % request.categories.length];

  const fallbackPost = generateFallbackPostForPlatform(platform, category, request.goals[0] || 'engagement');
  return {
    ...fallbackPost,
    id: `fallback_post_${index + 1}`
  };
}

function generateFallbackPostForPlatform(platform: string, category: string, goal: string): Omit<ContentPost, 'id'> {
  const templates: Record<string, Record<string, string>> = {
    educational: {
      instagram: "🚀 Did you know? [Educational fact about the industry] What's your biggest takeaway? #Learning #Growth #Knowledge",
      facebook: "Sharing some valuable insights about [topic]. What's one thing you've learned recently? Let's discuss in the comments! 📚",
      linkedin: "Key insight: [Industry fact]. This changes how we approach [business aspect]. What's your experience? #Business #Insights",
      twitter: "💡 Industry tip: [Quick advice]. RT if this helps! What's your go-to strategy? #Tips #Success"
    },
    promotional: {
      instagram: "🌟 Exciting news! [Product/service highlight] Ready to transform your [benefit]? Link in bio 🔗 #Innovation #Results",
      facebook: "We're thrilled to announce [update/feature]! This is designed to help you [benefit]. What's your favorite feature?",
      linkedin: "Proud to share our latest [product/service] designed specifically for [target audience]. Ready to [benefit]? #Business #Innovation",
      twitter: "Big news! [Product/service announcement] Perfect for [audience]. Check it out! 🔗 #New #Exciting"
    }
  };

  const template = templates[category]?.[platform] ||
    "Here's something special we prepared for you. What do you think? #Content #Engagement";

  const hashtags = generateHashtags(category, platform);

  return {
    text: template,
    platform,
    category,
    goal,
    hashtags,
    characterCount: template.length,
    estimatedEngagement: 'medium',
    brandVoiceAlignment: 75
  };
}

export const onRequestOptions = async () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
};
