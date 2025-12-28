// Phase 1 JavaScript - Brand Profile Creation functions
function addUrlInput() {
    if (urlCount >= 5) {
        alert('Maximum 5 URLs allowed');
        return;
    }

    urlCount++;
    const container = document.getElementById('urlInputs');
    const div = document.createElement('div');
    div.className = 'flex gap-2';
    div.innerHTML = `
        <input type="url" class="url-input flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://example.com">
        <button type="button" onclick="removeUrlInput(this)" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">-</button>
    `;
    container.appendChild(div);
}

function removeUrlInput(btn) {
    btn.parentElement.remove();
    urlCount--;
}

function displayScrapedData(data) {
    console.log('Displaying scraped data:', data);

    const displayDiv = document.getElementById('brandDataDisplay');

    // Safely access nested properties
    const personality = data.aiInsights?.personality || [];
    const values = data.aiInsights?.values || [];
    const positioning = data.aiInsights?.positioning || 'Not analyzed';
    const opportunities = data.aiInsights?.opportunities || [];

    const websiteContent = data.websiteContent || {};

    displayDiv.innerHTML = `
        <div class="grid md:grid-cols-2 gap-6">
            <div>
                <h4 class="font-semibold text-gray-800 mb-2">Extracted Brand Information</h4>
                <div class="space-y-2 text-sm">
                    <p><strong>Brand Name:</strong> ${data.brandName || 'Not detected'}</p>
                    <p><strong>Description:</strong> ${data.description || 'Not available'}</p>
                    <p><strong>Industry:</strong> ${data.industry || 'Auto-detected'}</p>
                    <p><strong>Target Audience:</strong> ${data.targetAudience || 'Business professionals'}</p>
                    <p><strong>Visual Style:</strong> ${data.visualStyle || 'Professional, modern'}</p>
                    <p><strong>Confidence:</strong> ${data.confidence || 0}%</p>
                </div>
            </div>

            <div>
                <h4 class="font-semibold text-gray-800 mb-2">AI Insights</h4>
                <div class="space-y-4 text-sm">
                    <div>
                        <strong class="text-gray-700">Personality:</strong>
                        ${Array.isArray(personality) && personality.length > 0
                            ? `<ul class="mt-1 ml-4 list-disc">${personality.map(p => `<li>${p}</li>`).join('')}</ul>`
                            : '<span class="text-gray-500">Not analyzed</span>'}
                    </div>
                    <div>
                        <strong class="text-gray-700">Core Values:</strong>
                        ${Array.isArray(values) && values.length > 0
                            ? `<ul class="mt-1 ml-4 list-disc">${values.map(v => `<li>${v}</li>`).join('')}</ul>`
                            : '<span class="text-gray-500">Not analyzed</span>'}
                    </div>
                    <div>
                        <strong class="text-gray-700">Market Positioning:</strong>
                        <p class="mt-1 text-gray-600">${positioning}</p>
                    </div>
                    <div>
                        <strong class="text-gray-700">Content Opportunities:</strong>
                        ${Array.isArray(opportunities) && opportunities.length > 0
                            ? `<ul class="mt-1 ml-4 list-disc">${opportunities.slice(0, 5).map(o => `<li>${o}</li>`).join('')}</ul>`
                            : '<span class="text-gray-500">Not analyzed</span>'}
                    </div>
                </div>
            </div>
        </div>

        <!-- SWOT Analysis -->
        ${data.aiInsights?.swot ? `
        <div class="mt-6">
            <h4 class="font-semibold text-gray-800 mb-4">SWOT Analysis</h4>
            <div class="grid md:grid-cols-2 gap-4">
                <div class="bg-green-50 p-4 rounded border border-green-200">
                    <h5 class="font-medium text-green-800 mb-2">Strengths</h5>
                    <ul class="text-sm text-green-700 space-y-1">
                        ${Array.isArray(data.aiInsights.swot.strengths) && data.aiInsights.swot.strengths.length > 0
                            ? data.aiInsights.swot.strengths.map(s => `<li>• ${s}</li>`).join('')
                            : '<li class="text-gray-500">No strengths identified</li>'}
                    </ul>
                </div>
                <div class="bg-red-50 p-4 rounded border border-red-200">
                    <h5 class="font-medium text-red-800 mb-2">Weaknesses</h5>
                    <ul class="text-sm text-red-700 space-y-1">
                        ${Array.isArray(data.aiInsights.swot.weaknesses) && data.aiInsights.swot.weaknesses.length > 0
                            ? data.aiInsights.swot.weaknesses.map(w => `<li>• ${w}</li>`).join('')
                            : '<li class="text-gray-500">No weaknesses identified</li>'}
                    </ul>
                </div>
                <div class="bg-blue-50 p-4 rounded border border-blue-200">
                    <h5 class="font-medium text-blue-800 mb-2">Opportunities</h5>
                    <ul class="text-sm text-blue-700 space-y-1">
                        ${Array.isArray(data.aiInsights.swot.opportunities) && data.aiInsights.swot.opportunities.length > 0
                            ? data.aiInsights.swot.opportunities.map(o => `<li>• ${o}</li>`).join('')
                            : '<li class="text-gray-500">No opportunities identified</li>'}
                    </ul>
                </div>
                <div class="bg-yellow-50 p-4 rounded border border-yellow-200">
                    <h5 class="font-medium text-yellow-800 mb-2">Threats</h5>
                    <ul class="text-sm text-yellow-700 space-y-1">
                        ${Array.isArray(data.aiInsights.swot.threats) && data.aiInsights.swot.threats.length > 0
                            ? data.aiInsights.swot.threats.map(t => `<li>• ${t}</li>`).join('')
                            : '<li class="text-gray-500">No threats identified</li>'}
                    </ul>
                </div>
            </div>
        </div>
        ` : ''}

        <!-- Brand Voice Recommendations -->
        ${data.aiInsights?.brandVoice ? `
        <div class="mt-6">
            <h4 class="font-semibold text-gray-800 mb-4">Brand Voice Recommendations</h4>
            <div class="grid md:grid-cols-2 gap-6">
                <div class="space-y-4">
                    <div>
                        <strong class="text-gray-700">Objective:</strong>
                        <p class="mt-1 text-gray-600">${data.aiInsights.brandVoice.objective || 'Not specified'}</p>
                    </div>
                    <div>
                        <strong class="text-gray-700">Recommended Tone:</strong>
                        ${Array.isArray(data.aiInsights.brandVoice.recommendedTone) && data.aiInsights.brandVoice.recommendedTone.length > 0
                            ? `<ul class="mt-1 ml-4 list-disc text-gray-600">${data.aiInsights.brandVoice.recommendedTone.map(t => `<li>${t}</li>`).join('')}</ul>`
                            : '<span class="text-gray-500">Not specified</span>'}
                    </div>
                    <div>
                        <strong class="text-gray-700">Personality Traits:</strong>
                        ${Array.isArray(data.aiInsights.brandVoice.recommendedPersonalityTraits) && data.aiInsights.brandVoice.recommendedPersonalityTraits.length > 0
                            ? `<ul class="mt-1 ml-4 list-disc text-gray-600">${data.aiInsights.brandVoice.recommendedPersonalityTraits.map(t => `<li>${t}</li>`).join('')}</ul>`
                            : '<span class="text-gray-500">Not specified</span>'}
                    </div>
                    <div>
                        <strong class="text-gray-700">Key Messages:</strong>
                        ${Array.isArray(data.aiInsights.brandVoice.improvedKeyMessages) && data.aiInsights.brandVoice.improvedKeyMessages.length > 0
                            ? `<ul class="mt-1 ml-4 list-disc text-gray-600">${data.aiInsights.brandVoice.improvedKeyMessages.map(m => `<li>${m}</li>`).join('')}</ul>`
                            : '<span class="text-gray-500">Not specified</span>'}
                    </div>
                </div>
                <div class="space-y-4">
                    <div>
                        <strong class="text-gray-700">Voice Guidelines:</strong>
                        <div class="mt-2 space-y-2">
                            ${data.aiInsights.brandVoice.voiceGuidelines?.dos && Array.isArray(data.aiInsights.brandVoice.voiceGuidelines.dos)
                                ? `<div><strong class="text-green-700">Do:</strong><ul class="mt-1 ml-4 list-disc text-green-600">${data.aiInsights.brandVoice.voiceGuidelines.dos.map(d => `<li>${d}</li>`).join('')}</ul></div>`
                                : ''}
                            ${data.aiInsights.brandVoice.voiceGuidelines?.donts && Array.isArray(data.aiInsights.brandVoice.voiceGuidelines.donts)
                                ? `<div><strong class="text-red-700">Don't:</strong><ul class="mt-1 ml-4 list-disc text-red-600">${data.aiInsights.brandVoice.voiceGuidelines.donts.map(d => `<li>${d}</li>`).join('')}</ul></div>`
                                : ''}
                        </div>
                    </div>
                    <div>
                        <strong class="text-gray-700">Sample Copy:</strong>
                        ${data.aiInsights.brandVoice.sampleCopy ? `
                        <div class="mt-2 p-3 bg-gray-50 rounded text-sm">
                            ${data.aiInsights.brandVoice.sampleCopy.headline ? `<div class="font-medium">${data.aiInsights.brandVoice.sampleCopy.headline}</div>` : ''}
                            ${data.aiInsights.brandVoice.sampleCopy.shortParagraph ? `<p class="mt-1 text-gray-600">${data.aiInsights.brandVoice.sampleCopy.shortParagraph}</p>` : ''}
                            ${data.aiInsights.brandVoice.sampleCopy.callToAction ? `<div class="mt-2 text-blue-600 font-medium">${data.aiInsights.brandVoice.sampleCopy.callToAction}</div>` : ''}
                        </div>
                        ` : '<span class="text-gray-500">Not provided</span>'}
                    </div>
                    <div>
                        <strong class="text-gray-700">Positioning Shift:</strong>
                        <p class="mt-1 text-gray-600">${data.aiInsights.brandVoice.positioningShift || 'Not specified'}</p>
                    </div>
                </div>
            </div>
        </div>
        ` : ''}

        <div class="grid md:grid-cols-2 gap-6">
        </div>

        <div class="mt-6">
            <h4 class="font-semibold text-gray-800 mb-3">Website Analysis Details</h4>
            <div class="space-y-3 text-sm max-h-40 overflow-y-auto">
                ${Object.entries(websiteContent).map(([url, content]) => {
                    const insights = content.insights || [];
                    return `<div class="bg-white p-3 rounded border">
                        <div class="font-medium text-blue-600 mb-1">${url}</div>
                        <div class="text-gray-600 text-xs mb-2">${content.title || 'No title'}</div>
                        ${Array.isArray(insights) && insights.length > 0
                            ? `<ul class="text-gray-700">${insights.slice(0, 3).map(insight => `<li class="text-xs">• ${insight}</li>`).join('')}</ul>`
                            : '<span class="text-gray-500 text-xs">Analysis in progress...</span>'}
                    </div>`;
                }).join('')}
            </div>
        </div>

        <div class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs">
            <strong>Analysis Summary:</strong>
            <span class="ml-2">Processed ${Object.keys(websiteContent).length} websites</span>
            <span class="ml-4">AI Insights: ${personality.length + values.length + opportunities.length} items extracted</span>
            <span class="ml-4">Confidence: ${data.confidence || 0}%</span>
        </div>

        <div class="mt-2 p-2 bg-gray-100 rounded text-xs font-mono">
            <strong>Debug:</strong> Check browser console for detailed AI response logs
        </div>
    `;
}

function proceedToPhase2() {
    document.getElementById('phase1').classList.add('hidden');
    document.getElementById('phase2').classList.remove('hidden');
    updateStepIndicator(2);
    currentPhase = 2;

    // Populate phase 2 with scraped data
    const voiceContent = document.getElementById('voiceGenerationContent');
    voiceContent.innerHTML = `
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 class="text-lg font-semibold text-blue-800 mb-2">Brand Profile Summary</h3>
            <div class="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                    <p><strong>Brand:</strong> ${scrapedData.brandName}</p>
                    <p><strong>Industry:</strong> ${scrapedData.industry}</p>
                    <p><strong>Target:</strong> ${scrapedData.targetAudience}</p>
                </div>
                <div>
                    <p><strong>Personality:</strong> ${scrapedData.aiInsights.personality.join(', ')}</p>
                    <p><strong>Values:</strong> ${scrapedData.aiInsights.values.join(', ')}</p>
                </div>
            </div>
        </div>

        <p class="text-gray-600 mb-4">
            Based on the website analysis above, we'll generate a comprehensive brand voice that captures your unique personality,
            values, and communication style. This voice will be used to generate all your content.
        </p>
    `;
}
