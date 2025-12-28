interface Env {
  AI: any;
  METADATA: any;
}

interface ScrapeInput {
  urls: string[];
  industry?: string;
}

interface ScrapedBrandData {
  id: string;
  brandName?: string;
  description?: string;
  tone?: string;
  visualStyle?: string;
  targetAudience?: string;
  industry?: string;
  websiteContent: {
    [url: string]: {
      title?: string;
      description?: string;
      keywords?: string[];
      content?: string;
      insights?: string[];
    };
  };
  aiInsights: {
    personality: string[];
    values: string[];
    positioning: string;
    opportunities: string[];
    swot: {
      strengths: string[];
      weaknesses: string[];
      opportunities: string[];
      threats: string[];
    };
    brandVoice: {
      objective: string;
      recommendedTone: string[];
      recommendedPersonalityTraits: string[];
      improvedKeyMessages: string[];
      voiceGuidelines: {
        dos: string[];
        donts: string[];
      };
      sampleCopy: {
        headline: string;
        shortParagraph: string;
        callToAction: string;
      };
      positioningShift: string;
    };
    clarityLevel: string;
  };
  confidence: number; // 0-100, how confident we are in the extracted data
  metadata: {
    createdAt: string;
    urlsProcessed: string[];
    processingTime: number;
  };
}

export const onRequestPost = async (context: any) => {
  const startTime = Date.now();

  try {
    const { request, env } = context;
    const scrapeData: ScrapeInput = await request.json();

    if (!scrapeData.urls || scrapeData.urls.length === 0) {
      return new Response(JSON.stringify({
        error: 'At least one URL is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (scrapeData.urls.length > 5) {
      return new Response(JSON.stringify({
        error: 'Maximum 5 URLs allowed'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate unique ID for this scraping session
    const scrapeId = crypto.randomUUID();

    // Process all URLs
    const scrapedData = await processUrls(scrapeData, env);

    // Generate AI insights from all collected data
    const aiInsights = await generateBrandInsights(scrapedData, scrapeData.industry || '', env);

    // Structure the final brand data
    const brandData: ScrapedBrandData = {
      id: scrapeId,
      ...extractBrandProfile(scrapedData),
      websiteContent: scrapedData,
      aiInsights,
      confidence: calculateConfidence(scrapedData, aiInsights),
      metadata: {
        createdAt: new Date().toISOString(),
        urlsProcessed: scrapeData.urls,
        processingTime: Date.now() - startTime
      }
    };

    // Store in KV for later retrieval (if available)
    if (env.METADATA) {
      await env.METADATA.put(`scrape:${scrapeId}`, JSON.stringify(brandData), {
        expirationTtl: 3600 // 1 hour expiration
      });
    }

    return new Response(JSON.stringify(brandData), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error: any) {
    console.error('Scraping error:', error);
    return new Response(JSON.stringify({
      error: error.message || 'Failed to scrape websites'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

async function processUrls(scrapeData: ScrapeInput, env: Env): Promise<{ [url: string]: any }> {
  const results: { [url: string]: any } = {};

  for (const url of scrapeData.urls) {
    try {
      console.log(`Processing URL: ${url}`);

      // Fetch website content
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'PopKornMachine-Bot/1.0 (Brand Analysis Service)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        // Add timeout
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      if (!response.ok) {
        console.warn(`Failed to fetch ${url}: ${response.status}`);
        results[url] = {
          error: `HTTP ${response.status}: ${response.statusText}`,
          title: extractDomain(url),
          insights: []
        };
        continue;
      }

      const html = await response.text();

      // Extract basic information
      const title = extractTitle(html);
      const description = extractDescription(html);
      const keywords = extractKeywords(html);

      // Use AI to analyze content and extract insights
      const contentAnalysis = await analyzeWebsiteContent(html, url, env);

      results[url] = {
        title,
        description,
        keywords,
        content: contentAnalysis.summary,
        insights: contentAnalysis.insights
      };

    } catch (error: any) {
      console.warn(`Error processing ${url}:`, error);
      results[url] = {
        error: error.message,
        title: extractDomain(url),
        insights: []
      };
    }
  }

  return results;
}

function extractTitle(html: string): string {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return titleMatch ? titleMatch[1].trim() : '';
}

function extractDescription(html: string): string {
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
  return descMatch ? descMatch[1].trim() : '';
}

function extractKeywords(html: string): string[] {
  const keywordsMatch = html.match(/<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']+)["'][^>]*>/i);
  if (keywordsMatch) {
    return keywordsMatch[1].split(',').map(k => k.trim()).filter(k => k);
  }
  return [];
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
}

async function analyzeWebsiteContent(html: string, url: string, env: Env): Promise<{ summary: string; insights: string[] }> {
  // Extract readable text content (basic cleaning)
  const textContent = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 3000); // Limit content length

  const analysisPrompt = `Analyze this website content and extract key brand insights:

URL: ${url}
Content: ${textContent}

Please provide:
1. A brief summary of what this business does
2. Key insights about their brand personality, values, and positioning
3. Their target audience characteristics
4. Visual/style cues mentioned or implied
5. Unique value propositions or competitive advantages

Format as a structured analysis with clear sections.`;

  try {
    const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [{ role: 'user', content: analysisPrompt }],
      max_tokens: 1000
    });

    const analysis = aiResponse.response || aiResponse.choices?.[0]?.message?.content || 'Analysis failed';

    // Parse insights from the analysis
    const insights = analysis.split('\n')
      .filter((line: string) => line.trim().length > 10 && !line.match(/^(URL|Content|Please provide)/i))
      .map((line: string) => line.replace(/^[-•*]\s*/, '').trim())
      .filter((line: string) => line.length > 0)
      .slice(0, 10); // Limit to 10 insights

    return {
      summary: analysis.split('\n')[0] || 'Website content analyzed',
      insights
    };

  } catch (error) {
    console.warn('AI analysis failed:', error);
    return {
      summary: 'Content analysis unavailable',
      insights: ['Website content extracted but AI analysis failed']
    };
  }
}

async function generateBrandInsights(scrapedData: any, industry: string, env: Env): Promise<ScrapedBrandData['aiInsights']> {
  const allInsights = Object.values(scrapedData).flatMap((data: any) => data.insights || []);

  const insightsPrompt = `Based on these website insights, create a comprehensive brand analysis and respond ONLY with a valid JSON object.

Industry: ${industry || 'General'}
Insights: ${allInsights.join('; ')}

Analyze the brand and provide a JSON response with exactly this structure:
{
  "personality": ["trait1", "trait2", "trait3"],
  "values": ["value1", "value2", "value3"],
  "positioning": "A clear positioning statement",
  "opportunities": ["opportunity1", "opportunity2", "opportunity3"],
  "swot": {
    "strengths": ["strength1", "strength2"],
    "weaknesses": ["weakness1", "weakness2"],
    "opportunities": ["swot_opportunity1", "swot_opportunity2"],
    "threats": ["threat1", "threat2"]
  },
  "brandVoice": {
    "objective": "Brand voice objective statement",
    "recommendedTone": ["tone1", "tone2"],
    "recommendedPersonalityTraits": ["trait1", "trait2"],
    "improvedKeyMessages": ["message1", "message2"],
    "voiceGuidelines": {
      "dos": ["guideline1", "guideline2"],
      "donts": ["dont1", "dont2"]
    },
    "sampleCopy": {
      "headline": "Sample headline",
      "shortParagraph": "Sample paragraph text",
      "callToAction": "Sample call to action"
    },
    "positioningShift": "Suggested positioning shift"
  },
  "clarityLevel": "clear/unclear/needs_improvement"
}

Requirements:
- personality: 3-5 key personality traits as strings
- values: 3-5 core values as strings
- positioning: A single clear positioning statement
- opportunities: 3-5 content/marketing focus areas
- swot: Complete SWOT analysis with arrays for each category
- brandVoice: Comprehensive brand voice recommendations
- clarityLevel: Overall clarity assessment

Respond ONLY with the JSON object, no additional text or formatting.`;

  try {
    console.log('Generating brand insights with prompt:', insightsPrompt);

    const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [{ role: 'user', content: insightsPrompt }],
      max_tokens: 600
    });

    const analysis = aiResponse.response || aiResponse.choices?.[0]?.message?.content || '';
    console.log('Raw AI response for brand insights:', analysis);

    // Try to parse JSON response
    try {
      const parsed = JSON.parse(analysis.trim());
      console.log('Successfully parsed JSON response:', parsed);

      // Validate the structure
      if (parsed && typeof parsed === 'object') {
        const result: ScrapedBrandData['aiInsights'] = {
          personality: Array.isArray(parsed.personality) ? parsed.personality : ['Professional', 'Reliable'],
          values: Array.isArray(parsed.values) ? parsed.values : ['Quality', 'Innovation'],
          positioning: typeof parsed.positioning === 'string' ? parsed.positioning : 'Market leader in their field',
          opportunities: Array.isArray(parsed.opportunities) ? parsed.opportunities : ['Content marketing', 'Social media presence'],
          swot: parsed.swot && typeof parsed.swot === 'object' ? {
            strengths: Array.isArray(parsed.swot.strengths) ? parsed.swot.strengths : ['Experienced team'],
            weaknesses: Array.isArray(parsed.swot.weaknesses) ? parsed.swot.weaknesses : ['Limited online presence'],
            opportunities: Array.isArray(parsed.swot.opportunities) ? parsed.swot.opportunities : ['Digital expansion'],
            threats: Array.isArray(parsed.swot.threats) ? parsed.swot.threats : ['Market competition']
          } : {
            strengths: ['Experienced team'],
            weaknesses: ['Limited online presence'],
            opportunities: ['Digital expansion'],
            threats: ['Market competition']
          },
          brandVoice: parsed.brandVoice && typeof parsed.brandVoice === 'object' ? {
            objective: typeof parsed.brandVoice.objective === 'string' ? parsed.brandVoice.objective : 'Establish brand authority',
            recommendedTone: Array.isArray(parsed.brandVoice.recommendedTone) ? parsed.brandVoice.recommendedTone : ['Professional', 'Confident'],
            recommendedPersonalityTraits: Array.isArray(parsed.brandVoice.recommendedPersonalityTraits) ? parsed.brandVoice.recommendedPersonalityTraits : ['Approachable', 'Transparent'],
            improvedKeyMessages: Array.isArray(parsed.brandVoice.improvedKeyMessages) ? parsed.brandVoice.improvedKeyMessages : ['Quality services', 'Expert support'],
            voiceGuidelines: parsed.brandVoice.voiceGuidelines && typeof parsed.brandVoice.voiceGuidelines === 'object' ? {
              dos: Array.isArray(parsed.brandVoice.voiceGuidelines.dos) ? parsed.brandVoice.voiceGuidelines.dos : ['Use clear language', 'Be consistent'],
              donts: Array.isArray(parsed.brandVoice.voiceGuidelines.donts) ? parsed.brandVoice.voiceGuidelines.donts : ['Use jargon', 'Be promotional']
            } : {
              dos: ['Use clear language', 'Be consistent'],
              donts: ['Use jargon', 'Be promotional']
            },
            sampleCopy: parsed.brandVoice.sampleCopy && typeof parsed.brandVoice.sampleCopy === 'object' ? {
              headline: typeof parsed.brandVoice.sampleCopy.headline === 'string' ? parsed.brandVoice.sampleCopy.headline : 'Expert Solutions',
              shortParagraph: typeof parsed.brandVoice.sampleCopy.shortParagraph === 'string' ? parsed.brandVoice.sampleCopy.shortParagraph : 'We provide expert solutions to meet your needs.',
              callToAction: typeof parsed.brandVoice.sampleCopy.callToAction === 'string' ? parsed.brandVoice.sampleCopy.callToAction : 'Contact us today'
            } : {
              headline: 'Expert Solutions',
              shortParagraph: 'We provide expert solutions to meet your needs.',
              callToAction: 'Contact us today'
            },
            positioningShift: typeof parsed.brandVoice.positioningShift === 'string' ? parsed.brandVoice.positioningShift : 'From service provider to trusted advisor'
          } : {
            objective: 'Establish brand authority',
            recommendedTone: ['Professional', 'Confident'],
            recommendedPersonalityTraits: ['Approachable', 'Transparent'],
            improvedKeyMessages: ['Quality services', 'Expert support'],
            voiceGuidelines: {
              dos: ['Use clear language', 'Be consistent'],
              donts: ['Use jargon', 'Be promotional']
            },
            sampleCopy: {
              headline: 'Expert Solutions',
              shortParagraph: 'We provide expert solutions to meet your needs.',
              callToAction: 'Contact us today'
            },
            positioningShift: 'From service provider to trusted advisor'
          },
          clarityLevel: typeof parsed.clarityLevel === 'string' ? parsed.clarityLevel : 'clear'
        };

        console.log('Final brand insights result:', result);
        return result;
      }
    } catch (parseError) {
      console.warn('JSON parsing failed, falling back to regex extraction:', parseError);
      // Fallback to old method if JSON parsing fails
      return extractInsightsFromText(analysis);
    }

    // If we get here, something went wrong
    console.warn('Unexpected response format, using fallbacks');
    return {
      personality: ['Professional', 'Reliable'],
      values: ['Quality', 'Innovation'],
      positioning: 'Market leader in their field',
      opportunities: ['Content marketing', 'Social media presence'],
      swot: {
        strengths: ['Experienced team'],
        weaknesses: ['Limited online presence'],
        opportunities: ['Digital expansion'],
        threats: ['Market competition']
      },
      brandVoice: {
        objective: 'Establish brand authority',
        recommendedTone: ['Professional', 'Confident'],
        recommendedPersonalityTraits: ['Approachable', 'Transparent'],
        improvedKeyMessages: ['Quality services', 'Expert support'],
        voiceGuidelines: {
          dos: ['Use clear language', 'Be consistent'],
          donts: ['Use jargon', 'Be promotional']
        },
        sampleCopy: {
          headline: 'Expert Solutions',
          shortParagraph: 'We provide expert solutions to meet your needs.',
          callToAction: 'Contact us today'
        },
        positioningShift: 'From service provider to trusted advisor'
      },
      clarityLevel: 'clear'
    };

  } catch (error) {
    console.warn('Brand insights generation failed:', error);
    return {
      personality: ['Professional'],
      values: ['Quality'],
      positioning: 'Business service provider',
      opportunities: ['Digital marketing'],
      swot: {
        strengths: ['Experienced team'],
        weaknesses: ['Limited online presence'],
        opportunities: ['Digital expansion'],
        threats: ['Market competition']
      },
      brandVoice: {
        objective: 'Establish brand authority',
        recommendedTone: ['Professional', 'Confident'],
        recommendedPersonalityTraits: ['Approachable', 'Transparent'],
        improvedKeyMessages: ['Quality services', 'Expert support'],
        voiceGuidelines: {
          dos: ['Use clear language', 'Be consistent'],
          donts: ['Use jargon', 'Be promotional']
        },
        sampleCopy: {
          headline: 'Expert Solutions',
          shortParagraph: 'We provide expert solutions to meet your needs.',
          callToAction: 'Contact us today'
        },
        positioningShift: 'From service provider to trusted advisor'
      },
      clarityLevel: 'clear'
    };
  }
}

// Fallback function for text parsing (kept for compatibility)
function extractInsightsFromText(text: string): ScrapedBrandData['aiInsights'] {
  const personality = extractSection(text, 'PERSONALITY') || extractSection(text, 'BRAND PERSONALITY');
  const values = extractSection(text, 'VALUES') || extractSection(text, 'CORE VALUES');
  const positioning = extractSection(text, 'POSITIONING')?.[0] || extractSection(text, 'MARKET POSITIONING')?.[0] || 'Market leader in their field';
  const opportunities = extractSection(text, 'OPPORTUNITIES');

  return {
    personality: personality.length > 0 ? personality : ['Professional', 'Reliable'],
    values: values.length > 0 ? values : ['Quality', 'Innovation'],
    positioning: positioning || 'Market leader in their field',
    opportunities: opportunities.length > 0 ? opportunities : ['Content marketing', 'Social media presence'],
    swot: {
      strengths: ['Experienced team'],
      weaknesses: ['Limited online presence'],
      opportunities: ['Digital expansion'],
      threats: ['Market competition']
    },
    brandVoice: {
      objective: 'Establish brand authority',
      recommendedTone: ['Professional', 'Confident'],
      recommendedPersonalityTraits: ['Approachable', 'Transparent'],
      improvedKeyMessages: ['Quality services', 'Expert support'],
      voiceGuidelines: {
        dos: ['Use clear language', 'Be consistent'],
        donts: ['Use jargon', 'Be promotional']
      },
      sampleCopy: {
        headline: 'Expert Solutions',
        shortParagraph: 'We provide expert solutions to meet your needs.',
        callToAction: 'Contact us today'
      },
      positioningShift: 'From service provider to trusted advisor'
    },
    clarityLevel: 'clear'
  };
}

function extractSection(text: string, sectionName: string): string[] {
  console.log(`Extracting section "${sectionName}" from text:`, text);

  // More robust section extraction
  const patterns = [
    new RegExp(`${sectionName}:?\\s*([\\s\\S]*?)(?=\\n\\n|\\n[A-Z][A-Z\\s]+:|$)`, 'i'),
    new RegExp(`${sectionName}\\s*\\n([\\s\\S]*?)(?=\\n[A-Z][A-Z\\s]+:|$)`, 'i'),
    new RegExp(`${sectionName}:?\\s*\\n?([\\s\\S]*?)(?=\\n\\d+\\.|\\n[A-Z][A-Z\\s]+:|$)`, 'i')
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const sectionText = match[1].trim();
      console.log(`Found section "${sectionName}" content:`, sectionText);

      // Split by bullet points, numbers, or line breaks
      const items = sectionText
        .split(/[-•*]\s*|\d+\.\s*|\n\s*/)
        .map(item => item.trim())
        .filter(item => item.length > 2 && !item.match(/^[A-Z][A-Z\s]*:$/i)) // Filter out section headers
        .slice(0, 8); // Limit to 8 items

      console.log(`Parsed items for "${sectionName}":`, items);
      return items;
    }
  }

  console.log(`No section found for "${sectionName}"`);
  return [];
}

function extractBrandProfile(scrapedData: any): Partial<ScrapedBrandData> {
  const urls = Object.keys(scrapedData);
  const firstUrl = urls[0];
  const firstData = scrapedData[firstUrl];

  // Try to extract brand name from title or domain
  let brandName = '';
  if (firstData.title) {
    brandName = firstData.title.split('|')[0].split('-')[0].trim();
  } else {
    brandName = extractDomain(firstUrl);
  }

  // Create description from available content
  const descriptions = Object.values(scrapedData)
    .map((data: any) => data.description)
    .filter(desc => desc)
    .join(' ');

  return {
    brandName: brandName.substring(0, 50), // Limit length
    description: descriptions.substring(0, 200),
    industry: 'Auto-detected', // Would need more sophisticated detection
    targetAudience: 'Business professionals', // Default assumption
    visualStyle: 'Professional, modern' // Default assumption
  };
}

function calculateConfidence(scrapedData: any, aiInsights: any): number {
  let confidence = 50; // Base confidence

  // Increase confidence based on data quality
  const urlsProcessed = Object.keys(scrapedData).length;
  confidence += urlsProcessed * 10; // +10 per URL

  // Increase if we have good AI insights
  if (aiInsights.personality.length > 0) confidence += 15;
  if (aiInsights.values.length > 0) confidence += 15;
  if (aiInsights.opportunities.length > 0) confidence += 10;

  return Math.min(confidence, 100);
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
