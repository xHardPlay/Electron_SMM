// Phase 2 JavaScript - Brand Voice Generation functions
async function generateBrandVoice() {
    const voiceBtn = document.getElementById('voiceBtn');
    const voiceResults = document.getElementById('voiceResults');

    voiceBtn.disabled = true;
    voiceBtn.textContent = 'Generating Brand Voice...';

    try {
        // Use the existing consulting API to generate brand voice
        const response = await fetch('/api/consulting/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                urls: Object.keys(scrapedData.websiteContent),
                focus: scrapedData.industry || 'General Business',
                depth: 'comprehensive'
            })
        });

        const result = await response.json();

        if (response.ok) {
            brandVoice = result.brandVoice;
            displayBrandVoice(result);
            voiceResults.classList.remove('hidden');
        } else {
            throw new Error(result.error || 'Failed to generate brand voice');
        }

    } catch (error) {
        alert('Error generating brand voice: ' + error.message);
    } finally {
        voiceBtn.disabled = false;
        voiceBtn.textContent = 'Generate Brand Voice';
    }
}

function formatExampleAd(adText) {
    if (!adText || adText === 'Generating example advertisement...') {
        return adText;
    }

    // Format the ad with better typography and structure
    return adText
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-purple-800 font-semibold">$1</strong>') // Bold text with purple color
        .replace(/^### (.*$)/gim, '<h4 class="text-lg font-bold text-purple-900 mt-4 mb-2">$1</h4>') // Headlines
        .replace(/^## (.*$)/gim, '<h3 class="text-xl font-bold text-purple-900 mt-6 mb-3">$1</h3>') // Sub-headlines
        .replace(/^# (.*$)/gim, '<h2 class="text-2xl font-bold text-purple-900 mt-8 mb-4">$1</h2>') // Main headlines
        .replace(/^\*\s*(.*$)/gm, '<li class="mb-2 ml-4">• $1</li>') // Bullet points
        .replace(/^\d+\.\s*(.*$)/gm, '<div class="mb-2"><span class="font-semibold text-purple-700">$&</span></div>') // Numbered items
        .replace(/\n\n/g, '</p><p class="mb-3 leading-relaxed">') // Paragraphs
        .replace(/\n/g, '<br>') // Line breaks
        .replace(/^/, '<p class="mb-3 leading-relaxed">') // Start with paragraph
        .replace(/$/, '</p>'); // End with closing paragraph
}

function displayBrandVoice(result) {
    console.log('Displaying brand voice result:', result);

    const voiceDisplay = document.getElementById('voiceDisplay');

    // Safely access data
    const analysis = result.analysis || {};
    const swot = analysis.swot || {};
    const recommendations = analysis.recommendations || [];
    const metadata = result.metadata || {};

    // Filter out useless SWOT data (arrays with just "*")
    const filterValidItems = (arr) => Array.isArray(arr) ? arr.filter(item => item && item.trim() && item !== '*') : [];
    const strengths = filterValidItems(swot.strengths);
    const weaknesses = filterValidItems(swot.weaknesses);
    const opportunities = filterValidItems(swot.opportunities);
    const threats = filterValidItems(swot.threats);

    // Format brand voice with better markdown parsing
    let brandVoiceContent = 'Brand voice generation in progress...';
    if (result.brandVoice && typeof result.brandVoice === 'string') {
        // Parse markdown-style formatting
        brandVoiceContent = result.brandVoice
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
            .replace(/^### (.*$)/gim, '<h5 class="text-lg font-semibold mt-4 mb-2">$1</h5>') // H3
            .replace(/^## (.*$)/gim, '<h4 class="text-xl font-semibold mt-6 mb-3">$1</h4>') // H2
            .replace(/^# (.*$)/gim, '<h3 class="text-2xl font-bold mt-8 mb-4">$3</h3>') // H1
            .replace(/^\d+\. \*\*(.*?)\*\*/gm, '<li class="mb-2"><strong>$1</strong>') // Numbered bold items
            .replace(/^\d+\. (.*$)/gm, '<li class="mb-2">$1</li>') // Numbered items
            .replace(/\n\n/g, '</p><p class="mb-4">') // Paragraphs
            .replace(/\n/g, '<br>'); // Line breaks

        brandVoiceContent = `<div class="prose prose-sm max-w-none"><p class="mb-4">${brandVoiceContent}</p></div>`;
    }

    // Format recommendations better
    const formatRecommendations = (recs) => {
        if (!Array.isArray(recs) || recs.length === 0) {
            return '<p class="text-gray-500 italic">No specific recommendations available</p>';
        }

        return recs.map(rec => {
            // Clean up the recommendation text
            const cleanRec = rec.replace(/^\.\s*\*\*/, '').replace(/\*\*$/, '').trim();
            return `<li class="flex items-start mb-3">
                <span class="text-indigo-500 mr-3 mt-1">💡</span>
                <span class="text-sm leading-relaxed">${cleanRec}</span>
            </li>`;
        }).join('');
    };

    voiceDisplay.innerHTML = `
        <div class="space-y-8">
            <!-- Header with Metadata -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                <div class="flex items-center justify-between">
                    <div>
                        <h3 class="text-2xl font-bold text-gray-800 mb-2">🎯 Brand Voice Analysis Complete</h3>
                        <p class="text-gray-600">Comprehensive brand voice guidelines generated for your business</p>
                    </div>
                    <div class="text-right text-sm text-gray-500">
                        <p>Generated: ${new Date(metadata.createdAt || Date.now()).toLocaleString()}</p>
                        <p class="flex items-center mt-1">
                            <span class="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            Status: ${metadata.status || 'Completed'}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Brand Voice Guidelines Section -->
            <div>
                <h4 class="font-semibold text-gray-800 mb-4 text-xl">📝 Brand Voice Guidelines</h4>
                <div class="bg-white p-6 rounded-xl border border-blue-200 shadow-sm">
                    <div class="text-sm text-gray-700 leading-relaxed">
                        ${brandVoiceContent}
                    </div>
                </div>
            </div>

            <!-- Example Ad Section -->
            <div>
                <h4 class="font-semibold text-gray-800 mb-4 text-xl flex items-center justify-between">
                    <span>🎯 Example Advertisement</span>
                    <div class="flex space-x-2">
                        <button onclick="playTTS()" id="ttsBtn" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            🔊 Play Audio
                        </button>
                        <button onclick="regenerateExampleAd(this)" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium transition-colors">
                            🔄 Regenerate Ad
                        </button>
                    </div>
                </h4>
                <div class="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                    <div id="exampleAdContent" class="text-sm text-gray-700 leading-relaxed">
                        ${formatExampleAd(result.exampleAd || 'Generating example advertisement...')}
                    </div>
                </div>
                <p class="text-xs text-gray-500 mt-2">This ad demonstrates your brand voice in action. Click regenerate to create a different example.</p>
            </div>

            <!-- Analysis Summary Cards -->
            <div>
                <h4 class="font-semibold text-gray-800 mb-4 text-xl">📊 Analysis Overview</h4>
                <div class="grid md:grid-cols-3 gap-4">
                    <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h5 class="font-medium text-blue-800 mb-2 flex items-center">
                            <span class="mr-2">🌐</span> Websites Analyzed
                        </h5>
                        <p class="text-2xl font-bold text-blue-900">${(metadata.urlsAnalyzed || []).length}</p>
                        <p class="text-xs text-blue-600 mt-1">Source domains processed</p>
                    </div>

                    <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h5 class="font-medium text-green-800 mb-2 flex items-center">
                            <span class="mr-2">🎯</span> Brand Insights
                        </h5>
                        <p class="text-2xl font-bold text-green-900">${scrapedData?.aiInsights?.personality?.length || 0}</p>
                        <p class="text-xs text-green-600 mt-1">Personality traits identified</p>
                    </div>

                    <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <h5 class="font-medium text-purple-800 mb-2 flex items-center">
                            <span class="mr-2">💡</span> Recommendations
                        </h5>
                        <p class="text-2xl font-bold text-purple-900">${recommendations.length}</p>
                        <p class="text-xs text-purple-600 mt-1">Actionable insights provided</p>
                    </div>
                </div>
            </div>

            <!-- SWOT Analysis -->
            <div>
                <h4 class="font-semibold text-gray-800 mb-4 text-xl">🔍 SWOT Analysis</h4>
                <div class="grid md:grid-cols-2 gap-6">
                    <div class="bg-green-50 p-5 rounded-xl border border-green-200">
                        <h5 class="font-bold text-green-800 mb-4 flex items-center text-lg">
                            <span class="mr-3 text-2xl">💪</span> Strengths
                        </h5>
                        ${strengths.length > 0
                            ? `<ul class="space-y-3">${strengths.map(s =>
                                `<li class="flex items-start">
                                    <span class="text-green-600 mr-3 mt-1">✓</span>
                                    <span class="text-sm text-green-800 leading-relaxed">${s}</span>
                                </li>`
                            ).join('')}</ul>`
                            : '<p class="text-green-700 italic text-sm">Analysis in progress - detailed strengths will be identified</p>'}
                    </div>

                    <div class="bg-red-50 p-5 rounded-xl border border-red-200">
                        <h5 class="font-bold text-red-800 mb-4 flex items-center text-lg">
                            <span class="mr-3 text-2xl">⚠️</span> Areas for Improvement
                        </h5>
                        ${weaknesses.length > 0
                            ? `<ul class="space-y-3">${weaknesses.map(w =>
                                `<li class="flex items-start">
                                    <span class="text-red-600 mr-3 mt-1">→</span>
                                    <span class="text-sm text-red-800 leading-relaxed">${w}</span>
                                </li>`
                            ).join('')}</ul>`
                            : '<p class="text-red-700 italic text-sm">Analysis in progress - opportunities for improvement will be identified</p>'}
                    </div>

                    <div class="bg-blue-50 p-5 rounded-xl border border-blue-200">
                        <h5 class="font-bold text-blue-800 mb-4 flex items-center text-lg">
                            <span class="mr-3 text-2xl">🚀</span> Growth Opportunities
                        </h5>
                        ${opportunities.length > 0
                            ? `<ul class="space-y-3">${opportunities.map(o =>
                                `<li class="flex items-start">
                                    <span class="text-blue-600 mr-3 mt-1">★</span>
                                    <span class="text-sm text-blue-800 leading-relaxed">${o}</span>
                                </li>`
                            ).join('')}</ul>`
                            : '<p class="text-blue-700 italic text-sm">Analysis in progress - growth opportunities will be identified</p>'}
                    </div>

                    <div class="bg-yellow-50 p-5 rounded-xl border border-yellow-200">
                        <h5 class="font-bold text-yellow-800 mb-4 flex items-center text-lg">
                            <span class="mr-3 text-2xl">⚡</span> Market Considerations
                        </h5>
                        ${threats.length > 0
                            ? `<ul class="space-y-3">${threats.map(t =>
                                `<li class="flex items-start">
                                    <span class="text-yellow-600 mr-3 mt-1">⚠</span>
                                    <span class="text-sm text-yellow-800 leading-relaxed">${t}</span>
                                </li>`
                            ).join('')}</ul>`
                            : '<p class="text-yellow-700 italic text-sm">Analysis in progress - market considerations will be identified</p>'}
                    </div>
                </div>
            </div>

            <!-- Strategic Recommendations -->
            <div>
                <h4 class="font-semibold text-gray-800 mb-4 text-xl">🎯 Strategic Action Plan</h4>
                <div class="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200">
                    <p class="text-indigo-800 mb-4 font-medium">Here are specific, actionable recommendations to enhance your brand presence:</p>
                    <ol class="space-y-4">
                        ${formatRecommendations(recommendations)}
                    </ol>
                </div>
            </div>

            <!-- Implementation Timeline -->
            <div>
                <h4 class="font-semibold text-gray-800 mb-4 text-xl">⏰ Implementation Roadmap</h4>
                <div class="grid md:grid-cols-3 gap-4">
                    <div class="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
                        <h5 class="font-bold text-green-800 mb-2">Week 1-2</h5>
                        <p class="text-sm text-green-700">Quick wins: Update homepage CTA, refresh social profiles</p>
                    </div>
                    <div class="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
                        <h5 class="font-bold text-blue-800 mb-2">Month 1</h5>
                        <p class="text-sm text-blue-700">Content strategy: Develop case studies, improve services page</p>
                    </div>
                    <div class="bg-purple-50 p-4 rounded-lg border border-purple-200 text-center">
                        <h5 class="font-bold text-purple-800 mb-2">Month 2+</h5>
                        <p class="text-sm text-purple-700">Long-term: Content marketing, cybersecurity investments</p>
                    </div>
                </div>
            </div>

            <!-- Technical Details (Collapsible) -->
            <details class="bg-gray-50 p-4 rounded-lg border">
                <summary class="cursor-pointer font-medium text-gray-700 hover:text-gray-900 text-lg">
                    🔧 Technical Analysis Details
                </summary>
                <div class="mt-4 space-y-4">
                    <div class="grid md:grid-cols-2 gap-4">
                        <div class="bg-white p-3 rounded border">
                            <h6 class="font-semibold mb-2">Analysis Metadata</h6>
                            <pre class="text-xs text-gray-600 overflow-x-auto">${JSON.stringify(metadata, null, 2)}</pre>
                        </div>
                        <div class="bg-white p-3 rounded border">
                            <h6 class="font-semibold mb-2">Raw SWOT Data</h6>
                            <pre class="text-xs text-gray-600 overflow-x-auto">${JSON.stringify(swot, null, 2)}</pre>
                        </div>
                    </div>
                    <div class="bg-white p-3 rounded border">
                        <h6 class="font-semibold mb-2">Complete API Response</h6>
                        <pre class="text-xs text-gray-600 overflow-x-auto max-h-60">${JSON.stringify(result, null, 2)}</pre>
                    </div>
                </div>
            </details>

            <!-- Success Message -->
            <div class="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <h4 class="text-xl font-bold text-green-800 mb-2">✅ Brand Voice Analysis Complete!</h4>
                <p class="text-green-700">Your comprehensive brand voice guidelines are ready. Use these insights to create consistent, engaging content that resonates with your audience.</p>
            </div>
        </div>
    `;
}

async function regenerateExampleAd(button) {
    const adContent = document.getElementById('exampleAdContent');
    const regenerateBtn = button;

    regenerateBtn.disabled = true;
    regenerateBtn.textContent = '🔄 Regenerating...';

    adContent.textContent = 'Creating new example advertisement...';

    try {
        // Use the existing consulting API to regenerate brand voice and ad
        const response = await fetch('/api/consulting/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                urls: Object.keys(scrapedData.websiteContent),
                focus: scrapedData.industry || 'General Business',
                depth: 'comprehensive'
            })
        });

        const result = await response.json();

        if (response.ok) {
            // Update only the ad content with formatting
            adContent.innerHTML = formatExampleAd(result.exampleAd || 'Failed to generate new advertisement');
            // Optionally update the brandVoice if it changed
            brandVoice = result.brandVoice;
        } else {
            adContent.innerHTML = formatExampleAd('Error regenerating advertisement: ' + (result.error || 'Unknown error'));
        }

    } catch (error) {
        adContent.textContent = 'Error regenerating advertisement: ' + error.message;
    } finally {
        regenerateBtn.disabled = false;
        regenerateBtn.textContent = '🔄 Regenerate Ad';
    }
}

async function playTTS() {
    const ttsBtn = document.getElementById('ttsBtn');
    const exampleAdContent = document.getElementById('exampleAdContent');

    // Get the plain text from the formatted ad content
    const adText = extractPlainTextFromHTML(exampleAdContent.innerHTML);

    if (!adText || adText.trim() === '' || adText.includes('Generating') || adText.includes('Error')) {
        alert('Please wait for the advertisement to be generated before playing audio.');
        return;
    }

    ttsBtn.disabled = true;
    ttsBtn.textContent = '🔊 Generating Audio...';

    try {
        // Call the TTS API
        const response = await fetch('/api/tts/synthesize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: adText,
                voice: {
                    languageCode: 'en-US',
                    name: 'en-US-Neural2-D',
                    ssmlGender: 'NEUTRAL'
                },
                audioConfig: {
                    audioEncoding: 'MP3',
                    speakingRate: 0.9,
                    pitch: 0.0
                }
            })
        });

        const result = await response.json();

        if (response.ok && result.audioContent) {
            // Convert base64 to blob and play
            const audioBlob = base64ToBlob(result.audioContent, 'audio/mp3');
            const audioUrl = URL.createObjectURL(audioBlob);

            const audio = new Audio(audioUrl);
            audio.play();

            ttsBtn.textContent = '🔊 Playing...';
            audio.onended = () => {
                ttsBtn.disabled = false;
                ttsBtn.textContent = '🔊 Play Audio';
                URL.revokeObjectURL(audioUrl);
            };

            audio.onerror = () => {
                ttsBtn.disabled = false;
                ttsBtn.textContent = '🔊 Play Audio';
                URL.revokeObjectURL(audioUrl);
                alert('Error playing audio. Please try again.');
            };

        } else {
            throw new Error(result.error || 'Failed to generate audio');
        }

    } catch (error) {
        console.error('TTS error:', error);
        alert('Error generating audio: ' + error.message);
        ttsBtn.disabled = false;
        ttsBtn.textContent = '🔊 Play Audio';
    }
}

function extractPlainTextFromHTML(html) {
    // Create a temporary element to strip HTML tags
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
}

function base64ToBlob(base64, mimeType) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
}

function proceedToPhase3() {
    document.getElementById('phase2').classList.add('hidden');
    document.getElementById('phase3').classList.remove('hidden');
    updateStepIndicator(3);
    currentPhase = 3;
}
