// Cloudflare Pages Function types
interface Env {
  AI: any;
  METADATA: any;
  IMAGES: any;
  // CAMPAIGN_STATE: any; // Commented out for now
}

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
  sources: string[];
}

interface CampaignOutput {
  id: string;
  brandVoice: string;
  adContent: { [platform: string]: string };
  imagePrompts: string[];
  images?: string[];
  metadata: {
    createdAt: string;
    status: 'completed' | 'processing' | 'failed';
    references: string[];
  };
}

export const onRequestPost = async (context: any) => {
  try {
    const { request, env } = context;
    const campaignData: CampaignInput = await request.json();

    // Generate unique campaign ID
    const campaignId = crypto.randomUUID();

    // Start processing campaign
    const campaignResult = await processCampaign(campaignData, env, campaignId);

    // Store campaign metadata
    await env.METADATA.put(`campaign:${campaignId}`, JSON.stringify({
      ...campaignResult.metadata,
      status: 'completed'
    }));

    return new Response(JSON.stringify({
      ...campaignResult,
      id: campaignId
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error: any) {
    console.error('Campaign creation error:', error);
    return new Response(JSON.stringify({
      error: error.message || 'Failed to create campaign'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};

async function processCampaign(campaignData: CampaignInput, env: Env, campaignId: string): Promise<CampaignOutput> {
  // Step 1: Generate brand voice
  const brandVoice = await generateBrandVoice(campaignData, env);

  // Step 2: Generate ad content for each platform
  const adContent = await generateAdContent(campaignData, brandVoice, env);

  // Step 3: Generate image prompts
  const imagePrompts = await generateImagePrompts(campaignData, brandVoice, env);

  // Step 4: Generate images (optional - can be async)
  let images: string[] = [];
  try {
    images = await generateImages(imagePrompts, env, campaignId);
  } catch (error) {
    console.warn('Image generation failed:', error);
  }

  return {
    id: campaignId,
    brandVoice,
    adContent,
    imagePrompts,
    images: images.length > 0 ? images : undefined,
    metadata: {
      createdAt: new Date().toISOString(),
      status: 'completed',
      references: campaignData.sources
    }
  };
}

async function generateBrandVoice(campaignData: CampaignInput, env: Env): Promise<string> {
  const prompt = `Generate a comprehensive brand voice profile for ${campaignData.brand.name}.

Brand Description: ${campaignData.brand.description}
Tone: ${campaignData.brand.tone}
Visual Style: ${campaignData.brand.visualStyle}
Product: ${campaignData.product.name} - ${campaignData.product.description}
Target Audience: ${campaignData.product.targetAudience}

Create a detailed brand voice that includes:
- Core personality traits
- Communication style guidelines
- Key messaging principles
- Tone and language preferences
- Brand values and positioning

Make it specific and actionable for content creation.`;

  const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 1000
  });

  return response.response || response.choices?.[0]?.message?.content || 'Brand voice generation failed';
}

async function generateAdContent(
  campaignData: CampaignInput,
  brandVoice: string,
  env: Env
): Promise<{ [platform: string]: string }> {
  const adContent: { [platform: string]: string } = {};

  for (const platform of campaignData.campaign.platforms) {
    const prompt = `Create compelling ad copy for ${platform} based on the following:

Brand Voice: ${brandVoice}

Product: ${campaignData.product.name}
Product Description: ${campaignData.product.description}
Target Audience: ${campaignData.product.targetAudience}
Campaign Goal: ${campaignData.campaign.goal}
Call to Action: ${campaignData.campaign.cta}

Platform: ${platform}
Visual Style: ${campaignData.brand.visualStyle}

Create engaging, platform-optimized content that:
- Matches the brand voice and tone
- Appeals to the target audience
- Achieves the campaign goal
- Includes the call to action naturally
- Is appropriate length for the platform
- Incorporates the visual style description

Make it ready to post with emojis and formatting as appropriate for ${platform}.`;

    const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500
    });

    adContent[platform] = response.response || response.choices?.[0]?.message?.content || `Ad content for ${platform}`;
  }

  return adContent;
}

async function generateImagePrompts(
  campaignData: CampaignInput,
  brandVoice: string,
  env: Env
): Promise<string[]> {
  const prompt = `Generate detailed, professional image generation prompts for an advertising campaign.

Brand: ${campaignData.brand.name}
Visual Style: ${campaignData.brand.visualStyle}
Product: ${campaignData.product.name} - ${campaignData.product.description}
Target Audience: ${campaignData.product.targetAudience}
Campaign Goal: ${campaignData.campaign.goal}
Call to Action: ${campaignData.campaign.cta}

Brand Voice Context: ${brandVoice.substring(0, 300)}...

Create 3-5 highly detailed image prompts that:
- Are optimized for AI image generation (like DALL-E, Midjourney, or Flux)
- Incorporate brand elements and visual style
- Show the product in context
- Appeal to the target audience
- Support the campaign goal
- Are ultra-realistic and Instagram-worthy
- Include specific details about lighting, composition, colors, and mood
- Integrate brand text/names naturally into the image

Each prompt should be comprehensive and ready to use for image generation.`;

  const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 1000
  });

  const content = response.response || response.choices?.[0]?.message?.content || '';
  // Split by newlines and filter out empty lines
  return content.split('\n').filter((line: string) => line.trim().length > 10).slice(0, 5);
}

async function generateImages(imagePrompts: string[], env: Env, campaignId: string): Promise<string[]> {
  const images: string[] = [];

  for (let i = 0; i < Math.min(imagePrompts.length, 3); i++) {
    try {
      // Use available Cloudflare AI image model
      const response = await env.AI.run('@cf/stabilityai/stable-diffusion-xl-base-1.0', {
        prompt: imagePrompts[i],
        num_steps: 20
      });

      // Handle the image response
      if (response && response.result) {
        // Convert base64 or binary image data to buffer
        let imageBuffer: ArrayBuffer;

        if (typeof response.result === 'string') {
          // Assume base64 encoded image
          const base64Data = response.result.replace(/^data:image\/png;base64,/, '');
          const binaryString = atob(base64Data);
          imageBuffer = new ArrayBuffer(binaryString.length);
          const bytes = new Uint8Array(imageBuffer);
          for (let j = 0; j < binaryString.length; j++) {
            bytes[j] = binaryString.charCodeAt(j);
          }
        } else if (response.result instanceof ArrayBuffer) {
          imageBuffer = response.result;
        } else {
          throw new Error('Unexpected image response format');
        }

        // Store image in R2
        const imageKey = `campaigns/${campaignId}/image-${i + 1}.png`;
        await env.IMAGES.put(imageKey, imageBuffer, {
          httpMetadata: {
            contentType: 'image/png',
          },
        });

        // Generate public URL (assuming R2 public bucket or custom domain)
        const imageUrl = `https://images.popkornmachine.com/${imageKey}`;
        images.push(imageUrl);
      }
    } catch (error) {
      console.warn(`Failed to generate image ${i + 1}:`, error);
      // Return placeholder for failed images
      images.push(`/placeholder-image-${i + 1}.png`);
    }
  }

  return images;
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
