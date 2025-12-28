interface Env {
  AI: any;
  METADATA: any;
}

interface ConsultingInput {
  urls: string[];
  focus: string;
  depth: 'basic' | 'comprehensive';
}

interface ConsultingOutput {
  id: string;
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
  exampleAd: string;
  report?: string; // HTML report
  metadata: {
    createdAt: string;
    status: 'completed' | 'processing' | 'failed';
    urlsAnalyzed: string[];
  };
}

export const onRequestPost = async (context: any) => {
  try {
    const { request, env } = context;
    const consultingData: ConsultingInput = await request.json();

    // Generate unique analysis ID
    const analysisId = crypto.randomUUID();

    // Start processing analysis
    const analysisResult = await processConsultingAnalysis(consultingData, env, analysisId);

    // Store analysis metadata (if available)
    if (env.METADATA) {
      await env.METADATA.put(`analysis:${analysisId}`, JSON.stringify({
        ...analysisResult.metadata,
        status: 'completed'
      }));
    }

    return new Response(JSON.stringify({
      ...analysisResult,
      id: analysisId
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error: any) {
    console.error('Consulting analysis error:', error);
    return new Response(JSON.stringify({
      error: error.message || 'Failed to analyze websites'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};

async function processConsultingAnalysis(
  consultingData: ConsultingInput,
  env: Env,
  analysisId: string
): Promise<ConsultingOutput> {
  // Step 1: Scrape and analyze websites
  const websiteAnalyses = await Promise.all(
    consultingData.urls.map(url => analyzeWebsite(url, env))
  );

  // Step 2: Generate comprehensive analysis
  const combinedAnalysis = await generateComprehensiveAnalysis(
    websiteAnalyses,
    consultingData,
    env
  );

  // Step 3: Generate brand voice recommendations
  const brandVoice = await generateBrandVoiceAnalysis(
    websiteAnalyses,
    combinedAnalysis,
    env
  );

  // Step 3.5: Generate example ad using brand voice
  const exampleAd = await generateExampleAd(
    brandVoice,
    combinedAnalysis,
    consultingData,
    env
  );

  // Step 4: Generate HTML report (optional)
  const report = await generateHTMLReport(
    combinedAnalysis,
    brandVoice,
    consultingData,
    env
  );

  return {
    id: analysisId,
    analysis: combinedAnalysis,
    brandVoice,
    exampleAd,
    report,
    metadata: {
      createdAt: new Date().toISOString(),
      status: 'completed',
      urlsAnalyzed: consultingData.urls
    }
  };
}

async function analyzeWebsite(url: string, env: Env): Promise<any> {
  try {
    // Use fetch to get website content (simplified - in production you'd want more robust scraping)
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'PopKornMachine-Bot/1.0 (Web Analysis Service)'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status}`);
    }

    const html = await response.text();

    // Use AI to analyze the website content
    const analysisPrompt = `Analyze this website content and extract key business information:

Website URL: ${url}
Content: ${html.substring(0, 5000)}... (truncated for analysis)

Please provide:
1. Business type/industry
2. Main products/services offered
3. Target audience description
4. Brand personality/tone
5. Key strengths
6. Areas for improvement
7. Competitive advantages
8. Content quality assessment

Be specific and actionable.`;

    const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [{ role: 'user', content: analysisPrompt }],
      max_tokens: 1500
    });

    return {
      url,
      content: aiResponse.response || aiResponse.choices?.[0]?.message?.content || 'Analysis failed',
      success: true
    };

  } catch (error: any) {
    console.warn(`Failed to analyze ${url}:`, error);
    return {
      url,
      content: `Failed to analyze website: ${error.message}`,
      success: false
    };
  }
}

async function generateComprehensiveAnalysis(
  websiteAnalyses: any[],
  consultingData: ConsultingInput,
  env: Env
): Promise<ConsultingOutput['analysis']> {
  const successfulAnalyses = websiteAnalyses.filter(a => a.success);

  const analysisPrompt = `Based on the following website analyses, create a comprehensive business analysis:

Focus Area: ${consultingData.focus}
Analysis Depth: ${consultingData.depth}

Website Analyses:
${successfulAnalyses.map(a => `URL: ${a.url}\nAnalysis: ${a.content}`).join('\n\n')}

Please provide:

1. **OVERVIEW**: A comprehensive summary of the business based on all websites analyzed

2. **SWOT ANALYSIS** with specific, actionable points:
   - Strengths (internal positive factors)
   - Weaknesses (internal negative factors)  
   - Opportunities (external positive factors)
   - Threats (external negative factors)

3. **RECOMMENDATIONS**: 5-8 specific, prioritized recommendations for improvement

Format the SWOT as structured lists. Make all analysis specific to the ${consultingData.focus} industry and ${consultingData.depth} analysis depth.`;

  const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
    messages: [{ role: 'user', content: analysisPrompt }],
    max_tokens: 2000
  });

  const content = aiResponse.response || aiResponse.choices?.[0]?.message?.content || '';

  // Parse the AI response to extract structured data
  return parseAnalysisResponse(content);
}

function parseAnalysisResponse(content: string): ConsultingOutput['analysis'] {
  // Simple parsing - in production you'd want more robust parsing
  const overviewMatch = content.match(/OVERVIEW:?\s*(.*?)(?=\n\n|\nSWOT|\n\d\.|\*\*|$)/is);
  const overview = overviewMatch ? overviewMatch[1].trim() : 'Analysis completed successfully';

  // Extract SWOT components
  const swot: ConsultingOutput['analysis']['swot'] = {
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: []
  };

  const strengthMatch = content.match(/(?:STRENGTHS?|Strengths?):?\s*\n?((?:[-•*]\s*.+\n?)+)/i);
  if (strengthMatch) {
    swot.strengths = strengthMatch[1].split(/\n/).map(s => s.replace(/^[-•*]\s*/, '').trim()).filter(s => s);
  }

  const weaknessMatch = content.match(/(?:WEAKNESSES?|Weaknesses?):?\s*\n?((?:[-•*]\s*.+\n?)+)/i);
  if (weaknessMatch) {
    swot.weaknesses = weaknessMatch[1].split(/\n/).map(s => s.replace(/^[-•*]\s*/, '').trim()).filter(s => s);
  }

  const opportunityMatch = content.match(/(?:OPPORTUNITIES?|Opportunities?):?\s*\n?((?:[-•*]\s*.+\n?)+)/i);
  if (opportunityMatch) {
    swot.opportunities = opportunityMatch[1].split(/\n/).map(s => s.replace(/^[-•*]\s*/, '').trim()).filter(s => s);
  }

  const threatMatch = content.match(/(?:THREATS?|Threats?):?\s*\n?((?:[-•*]\s*.+\n?)+)/i);
  if (threatMatch) {
    swot.threats = threatMatch[1].split(/\n/).map(s => s.replace(/^[-•*]\s*/, '').trim()).filter(s => s);
  }

  // Extract recommendations
  const recommendationMatch = content.match(/(?:RECOMMENDATIONS?|Recommendations?):?\s*\n?((?:[-•*\d]+\s*.+\n?)+)/i);
  const recommendations = recommendationMatch
    ? recommendationMatch[1].split(/\n/).map(s => s.replace(/^[-•*\d]+\s*/, '').trim()).filter(s => s)
    : ['Conduct regular website audits', 'Implement SEO best practices', 'Enhance user experience', 'Update content regularly'];

  return {
    overview,
    swot,
    recommendations
  };
}

async function generateBrandVoiceAnalysis(
  websiteAnalyses: any[],
  analysis: ConsultingOutput['analysis'],
  env: Env
): Promise<string> {
  const brandVoicePrompt = `Based on the website analyses and SWOT findings, create comprehensive brand voice recommendations:

Website Analyses:
${websiteAnalyses.map(a => `${a.url}: ${a.content}`).join('\n')}

SWOT Summary:
Strengths: ${analysis.swot.strengths.join(', ')}
Weaknesses: ${analysis.swot.weaknesses.join(', ')}
Opportunities: ${analysis.swot.opportunities.join(', ')}
Threats: ${analysis.swot.threats.join(', ')}

Create detailed brand voice guidelines including:
1. Core personality traits
2. Communication style and tone
3. Key messaging principles
4. Language preferences and restrictions
5. Brand positioning recommendations
6. Content strategy suggestions

Make the recommendations specific, actionable, and aligned with the business analysis.`;

  const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
    messages: [{ role: 'user', content: brandVoicePrompt }],
    max_tokens: 1500
  });

  return aiResponse.response || aiResponse.choices?.[0]?.message?.content || 'Brand voice analysis not available';
}

async function generateExampleAd(
  brandVoice: string,
  analysis: ConsultingOutput['analysis'],
  consultingData: ConsultingInput,
  env: Env
): Promise<string> {
  const exampleAdPrompt = `Using the following brand voice guidelines, create a compelling example advertisement for this business.

Brand Voice Guidelines:
${brandVoice}

Business Overview:
${analysis.overview}

Focus Area: ${consultingData.focus}

Create a complete advertisement that demonstrates the brand voice in action. Include:
1. A catchy headline
2. Main body copy (2-3 paragraphs)
3. Call-to-action
4. Any relevant hashtags or social proof elements

Make the ad authentic to the brand personality and aligned with the analysis findings.`;

  const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
    messages: [{ role: 'user', content: exampleAdPrompt }],
    max_tokens: 800
  });

  return aiResponse.response || aiResponse.choices?.[0]?.message?.content || 'Example ad generation failed';
}

async function generateHTMLReport(
  analysis: ConsultingOutput['analysis'],
  brandVoice: string,
  consultingData: ConsultingInput,
  env: Env
): Promise<string> {
  // Generate a simple HTML report
  const reportHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Brand Analysis Report</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
            .section { margin: 30px 0; }
            .swot-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
            .swot-item { border: 1px solid #e5e7eb; padding: 15px; border-radius: 5px; }
            .strengths { border-color: #10b981; }
            .weaknesses { border-color: #ef4444; }
            .opportunities { border-color: #8b5cf6; }
            .threats { border-color: #f59e0b; }
            ul { padding-left: 20px; }
            li { margin: 5px 0; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Brand Analysis Report</h1>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
            <p><strong>Focus Area:</strong> ${consultingData.focus}</p>
            <p><strong>Analysis Depth:</strong> ${consultingData.depth}</p>
        </div>

        <div class="section">
            <h2>Executive Summary</h2>
            <p>${analysis.overview}</p>
        </div>

        <div class="section">
            <h2>SWOT Analysis</h2>
            <div class="swot-grid">
                <div class="swot-item strengths">
                    <h3>Strengths</h3>
                    <ul>
                        ${analysis.swot.strengths.map(s => `<li>${s}</li>`).join('')}
                    </ul>
                </div>
                <div class="swot-item weaknesses">
                    <h3>Weaknesses</h3>
                    <ul>
                        ${analysis.swot.weaknesses.map(s => `<li>${s}</li>`).join('')}
                    </ul>
                </div>
                <div class="swot-item opportunities">
                    <h3>Opportunities</h3>
                    <ul>
                        ${analysis.swot.opportunities.map(s => `<li>${s}</li>`).join('')}
                    </ul>
                </div>
                <div class="swot-item threats">
                    <h3>Threats</h3>
                    <ul>
                        ${analysis.swot.threats.map(s => `<li>${s}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>Recommendations</h2>
            <ol>
                ${analysis.recommendations.map(r => `<li>${r}</li>`).join('')}
            </ol>
        </div>

        <div class="section">
            <h2>Brand Voice Guidelines</h2>
            <div>${brandVoice.replace(/\n/g, '<br>')}</div>
        </div>
    </body>
    </html>
  `;

  return reportHtml;
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
