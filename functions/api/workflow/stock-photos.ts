interface Env {
  AI: any;
}

interface StockPhotoRequest {
  posts: Array<{
    id: string;
    text: string;
    category?: string;
    platform?: string;
  }>;
  brandData?: any;
}

interface StockPhotoResult {
  postId: string;
  selectedImage: {
    id: string;
    url: string;
    thumb: string;
    description: string;
    photographer: string;
    downloadUrl: string;
  };
  keywords: string[];
  reasoning: string;
}

export const onRequestPost = async (context: any) => {
  try {
    const { request, env } = context;
    const data: StockPhotoRequest = await request.json();

    if (!data.posts || data.posts.length === 0) {
      return new Response(JSON.stringify({
        error: 'Posts array is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Process posts in batches to avoid rate limits
    const results: StockPhotoResult[] = [];
    const batchSize = 5;

    for (let i = 0; i < data.posts.length; i += batchSize) {
      const batch = data.posts.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(post => selectStockPhotoForPost(post, data.brandData, env))
      );
      results.push(...batchResults);

      // Small delay between batches to be respectful to the API
      if (i + batchSize < data.posts.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return new Response(JSON.stringify({
      success: true,
      results,
      totalProcessed: results.length
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error: any) {
    console.error('Stock photo selection error:', error);
    return new Response(JSON.stringify({
      error: error.message || 'Failed to select stock photos'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

async function selectStockPhotoForPost(post: any, brandData: any, env: Env): Promise<StockPhotoResult> {
  try {
    // Generate search keywords using AI based on post content
    const keywords = await generateSearchKeywords(post, brandData, env);
    console.log(`Post ${post.id} keywords:`, keywords);

    // Search Unsplash for images with multiple attempts for diversity
    let images = await searchUnsplashImages(keywords);

    // If we get few results, try a modified search
    if (images.length < 3) {
      const enhancedKeywords = [...keywords, getRandomEnhancer()];
      console.log(`Post ${post.id} enhanced keywords:`, enhancedKeywords);
      images = await searchUnsplashImages(enhancedKeywords);
    }

    // If still few results, try completely different search terms
    if (images.length < 3) {
      const alternativeKeywords = generateAlternativeKeywords(post);
      console.log(`Post ${post.id} alternative keywords:`, alternativeKeywords);
      images = await searchUnsplashImages(alternativeKeywords);
    }

    if (images.length === 0) {
      // Fallback to generic business images
      const fallbackImages = await searchUnsplashImages(['business', 'professional', 'office']);
      return {
        postId: post.id,
        selectedImage: fallbackImages[0] || getFallbackImage(),
        keywords: ['business', 'professional'],
        reasoning: 'No images found for specific keywords, using fallback business images'
      };
    }

    // Select a random image from top results to ensure variety
    const randomIndex = Math.floor(Math.random() * Math.min(images.length, 3)); // Random from top 3
    const selectedImage = images[randomIndex];

    console.log(`Post ${post.id} selected image:`, selectedImage.id, 'by', selectedImage.photographer);

    return {
      postId: post.id,
      selectedImage,
      keywords,
      reasoning: `Selected random image ${randomIndex + 1} from ${images.length} results based on keywords: ${keywords.join(', ')}`
    };

  } catch (error) {
    console.warn(`Error selecting stock photo for post ${post.id}:`, error);
    return {
      postId: post.id,
      selectedImage: getFallbackImage(),
      keywords: ['business'],
      reasoning: 'Error occurred, using fallback image'
    };
  }
}

async function generateSearchKeywords(post: any, brandData: any, env: Env): Promise<string[]> {
  const prompt = `Analyze this social media post and suggest 4-6 diverse and specific keywords for finding unique stock photos. Make keywords very specific to avoid generic results.

Post content: "${post.text}"
Category: ${post.category || 'general'}
Platform: ${post.platform || 'social media'}
Post ID: ${post.id}

${brandData?.industry ? `Industry: ${brandData.industry}` : ''}
${brandData?.visualStyle ? `Brand visual style: ${brandData.visualStyle}` : ''}

IMPORTANT: Make keywords very specific and varied. For example:
- Instead of "business", use "corporate meeting", "office collaboration", "professional workspace"
- Instead of "people", use "diverse team", "young professionals", "business executives"
- Add specific actions: "working on laptop", "discussing project", "presenting charts"
- Add specific settings: "modern office", "cozy cafe", "industrial warehouse"

Return only a comma-separated list of 4-6 unique keywords, no other text.`;

  try {
    const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150
    });

    const response = aiResponse.response || aiResponse.choices?.[0]?.message?.content || '';
    const keywords = response.split(',')
      .map((k: string) => k.trim().toLowerCase())
      .filter((k: string) => k.length > 2 && k.length < 30) // Filter out very short or very long keywords
      .filter((k: string, index: number, arr: string[]) => arr.indexOf(k) === index) // Remove duplicates
      .slice(0, 6);

    // Add some randomness to ensure variety
    const baseKeywords = keywords.length > 0 ? keywords : ['business', 'professional', 'office'];
    const enhancers = ['modern', 'contemporary', 'diverse', 'successful', 'innovative', 'collaborative', 'dynamic'];
    const randomEnhancer = enhancers[Math.floor(Math.random() * enhancers.length)];

    if (baseKeywords.length < 4) {
      baseKeywords.push(randomEnhancer);
    }

    return baseKeywords.slice(0, 5);

  } catch (error) {
    console.warn('AI keyword generation failed:', error);
    // More diverse fallback keywords based on post content
    const fallbackSets = [
      ['corporate meeting', 'business professionals', 'office workspace'],
      ['team collaboration', 'modern office', 'business growth'],
      ['professional success', 'workplace diversity', 'corporate culture'],
      ['business innovation', 'executive team', 'company success'],
      ['office environment', 'business meeting', 'professional development']
    ];

    let fallbackKeywords = fallbackSets[Math.floor(Math.random() * fallbackSets.length)];

    if (post.category) {
      if (post.category.includes('education')) fallbackKeywords = ['education', 'learning environment', 'knowledge sharing', 'academic success'];
      if (post.category.includes('promotional')) fallbackKeywords = ['marketing campaign', 'brand promotion', 'advertising success', 'product launch'];
      if (post.category.includes('engagement')) fallbackKeywords = ['community building', 'social interaction', 'customer engagement', 'relationship building'];
    }

    return fallbackKeywords.slice(0, 4);
  }
}

async function searchUnsplashImages(keywords: string[]): Promise<Array<{
  id: string;
  url: string;
  thumb: string;
  description: string;
  photographer: string;
  downloadUrl: string;
}>> {
  // Use the primary keyword for search, others as modifiers
  const searchQuery = keywords.join(' ').replace(/[^a-zA-Z0-9\s]/g, '');

  try {
    // Unsplash API - no API key required for basic search
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=5&orientation=landscape`,
      {
        headers: {
          'Accept-Version': 'v1',
          'Authorization': 'Client-ID' // Note: Unsplash allows anonymous requests but rate limited
        }
      }
    );

    if (!response.ok) {
      console.warn(`Unsplash API error: ${response.status}`);
      return [];
    }

    const data = await response.json();

    return (data.results || []).map((photo: any) => ({
      id: photo.id,
      url: photo.urls.regular,
      thumb: photo.urls.thumb,
      description: photo.description || photo.alt_description || 'Stock photo',
      photographer: photo.user?.name || 'Unknown',
      downloadUrl: photo.links?.download || photo.urls.full
    }));

  } catch (error) {
    console.warn('Unsplash API request failed:', error);
    return [];
  }
}

function getRandomEnhancer(): string {
  const enhancers = [
    'modern', 'contemporary', 'diverse', 'successful', 'innovative',
    'collaborative', 'dynamic', 'creative', 'professional', 'corporate',
    'startup', 'enterprise', 'global', 'local', 'sustainable'
  ];
  return enhancers[Math.floor(Math.random() * enhancers.length)];
}

function generateAlternativeKeywords(post: any): string[] {
  // Generate completely different keyword sets based on post characteristics
  const alternativeSets = [
    ['workspace', 'productivity', 'teamwork', 'communication'],
    ['technology', 'digital', 'innovation', 'future'],
    ['leadership', 'strategy', 'growth', 'achievement'],
    ['creativity', 'design', 'inspiration', 'vision'],
    ['community', 'connection', 'networking', 'relationships'],
    ['education', 'learning', 'development', 'knowledge'],
    ['health', 'wellness', 'balance', 'lifestyle'],
    ['finance', 'investment', 'wealth', 'security']
  ];

  // Select different sets based on post ID to ensure variety
  const setIndex = parseInt(post.id.split('_')[1]) % alternativeSets.length;
  const selectedSet = alternativeSets[setIndex];

  // Add some post-specific modifiers
  const modifiers = ['environment', 'setting', 'atmosphere', 'scene', 'moment'];
  const randomModifier = modifiers[Math.floor(Math.random() * modifiers.length)];

  return [...selectedSet.slice(0, 3), randomModifier];
}

function getFallbackImage() {
  // Return a generic fallback image
  return {
    id: 'fallback',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
    thumb: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    description: 'Professional business meeting',
    photographer: 'Unsplash',
    downloadUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop'
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
