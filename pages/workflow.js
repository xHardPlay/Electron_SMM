// Workflow JavaScript - handles brand content generation phases
let currentPhase = 1;
let scrapedData = null;
let brandVoice = null;
let generatedContent = [];
let generatedImages = [];
let urlCount = 1;

// Initialize
document.addEventListener('DOMContentLoaded', async function() {
    await loadPhases();
    attachEventListeners();
    updateStepIndicator(1);
});

// Load phase HTML fragments
async function loadPhases() {
    const phases = [1, 2, 3, 4, 5];
    for (const phase of phases) {
        try {
            const response = await fetch(`phase${phase}.html`);
            const html = await response.text();
            document.getElementById(`phase${phase}-container`).innerHTML = html;
        } catch (error) {
            console.error(`Failed to load phase ${phase}:`, error);
        }
    }
}

// Attach event listeners after phases are loaded
function attachEventListeners() {
    // Phase 1 form listener
    document.getElementById('brandProfileForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const urls = Array.from(document.querySelectorAll('.url-input'))
            .map(input => input.value)
            .filter(url => url.trim());

        if (urls.length === 0) {
            alert('Please enter at least one URL');
            return;
        }

        const scrapeBtn = document.getElementById('scrapeBtn');
        const loadingDiv = document.getElementById('scrapingLoading');
        const resultsDiv = document.getElementById('scrapingResults');

        scrapeBtn.disabled = true;
        scrapeBtn.textContent = 'Analyzing...';
        loadingDiv.classList.remove('hidden');
        resultsDiv.classList.add('hidden');

        try {
            const response = await fetch('/api/workflow/scrape', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    urls: urls,
                    industry: document.getElementById('industry').value
                })
            });

            const result = await response.json();

            if (response.ok) {
                scrapedData = result;
                displayScrapedData(result);
                resultsDiv.classList.remove('hidden');
            } else {
                throw new Error(result.error || 'Failed to scrape websites');
            }

        } catch (error) {
            alert('Error: ' + error.message);
        } finally {
            scrapeBtn.disabled = false;
            scrapeBtn.textContent = 'Analyze Websites & Extract Brand Data';
            loadingDiv.classList.add('hidden');
        }
    });
}

function updateStepIndicator(activeStep) {
    for (let i = 1; i <= 5; i++) {
        const stepEl = document.getElementById(`step${i}`);
        if (i < activeStep) {
            stepEl.className = 'step-completed w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300';
        } else if (i === activeStep) {
            stepEl.className = 'step-active w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300';
        } else {
            stepEl.className = 'step-inactive w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300';
        }
    }
}

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

// Phase 2: Brand Voice Generation
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

function displayBrandVoice(result) {
    console.log('Displaying brand voice result:', result);

    const voiceDisplay = document.getElementById('voiceDisplay');

    // Safely access SWOT data
    const swot = result.analysis?.swot || {};
    const strengths = Array.isArray(swot.strengths) ? swot.strengths : [];
    const weaknesses = Array.isArray(swot.weaknesses) ? swot.weaknesses : [];
    const threats = Array.isArray(swot.threats) ? swot.threats : [];
    const opportunities = Array.isArray(swot.opportunities) ? swot.opportunities : [];

    voiceDisplay.innerHTML = `
        <div class="space-y-4">
            <div>
                <h4 class="font-semibold text-gray-800">Brand Voice Guidelines</h4>
                <div class="bg-white p-3 rounded border mt-2">
                    ${result.brandVoice ? result.brandVoice.replace(/\n/g, '<br>') : 'Brand voice generation in progress...'}
                </div>
            </div>

            <div>
                <h4 class="font-semibold text-gray-800">SWOT Analysis</h4>
                <div class="grid md:grid-cols-2 gap-4 mt-2">
                    <div class="bg-green-50 p-3 rounded border border-green-200">
                        <h5 class="font-medium text-green-800">Strengths</h5>
                        <ul class="text-sm text-green-700 mt-1">
                            ${strengths.length > 0 ? strengths.map(s => `<li>• ${s}</li>`).join('') : '<li>No strengths identified</li>'}
                        </ul>
                    </div>
                    <div class="bg-red-50 p-3 rounded border border-red-200">
                        <h5 class="font-medium text-red-800">Weaknesses</h5>
                        <ul class="text-sm text-red-700 mt-1">
                            ${weaknesses.length > 0 ? weaknesses.map(s => `<li>• ${s}</li>`).join('') : '<li>No weaknesses identified</li>'}
                        </ul>
                    </div>
                    <div class="bg-blue-50 p-3 rounded border border-blue-200">
                        <h5 class="font-medium text-blue-800">Opportunities</h5>
                        <ul class="text-sm text-blue-700 mt-1">
                            ${opportunities.length > 0 ? opportunities.map(s => `<li>• ${s}</li>`).join('') : '<li>No opportunities identified</li>'}
                        </ul>
                    </div>
                    <div class="bg-yellow-50 p-3 rounded border border-yellow-200">
                        <h5 class="font-medium text-yellow-800">Threats</h5>
                        <ul class="text-sm text-yellow-700 mt-1">
                            ${threats.length > 0 ? threats.map(s => `<li>• ${s}</li>`).join('') : '<li>No threats identified</li>'}
                        </ul>
                    </div>
                </div>
            </div>

            <div class="mt-4">
                <h4 class="font-semibold text-gray-800">Recommendations</h4>
                <ul class="text-sm text-gray-700 mt-2">
                    ${result.analysis?.recommendations ? result.analysis.recommendations.map(r => `<li>• ${r}</li>`).join('') : '<li>No recommendations available</li>'}
                </ul>
            </div>

            <div class="mt-4 p-3 bg-gray-100 rounded text-xs">
                <strong>Debug Info:</strong> SWOT parsed - ${strengths.length} strengths, ${weaknesses.length} weaknesses, ${opportunities.length} opportunities, ${threats.length} threats
            </div>
        </div>
    `;
}

function proceedToPhase3() {
    document.getElementById('phase2').classList.add('hidden');
    document.getElementById('phase3').classList.remove('hidden');
    updateStepIndicator(3);
    currentPhase = 3;
}

// Phase 3: Bulk Content Generation
async function generateBulkContent() {
    const bulkBtn = document.getElementById('bulkContentBtn');
    const contentResults = document.getElementById('contentResults');

    bulkBtn.disabled = true;
    bulkBtn.textContent = 'Generating Content...';

    try {
        const categories = Array.from(document.querySelectorAll('.content-category:checked')).map(cb => cb.value);
        const platforms = Array.from(document.querySelectorAll('.platform:checked')).map(cb => cb.value);
        const postCount = parseInt(document.getElementById('postCount').value);
        const contentGoal = document.getElementById('contentGoal').value;

        if (!brandVoice) {
            throw new Error('Brand voice is required. Please complete Phase 2 first.');
        }

        // Call the real bulk content generation API
        const response = await fetch('/api/workflow/content-bulk-generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                brandVoice: brandVoice,
                categories: categories,
                platforms: platforms,
                count: postCount,
                goals: [contentGoal],
                brandData: scrapedData
            })
        });

        const result = await response.json();

        if (response.ok) {
            generatedContent = result.posts;
            displayContentPreview(generatedContent);
            contentResults.classList.remove('hidden');
        } else {
            throw new Error(result.error || 'Failed to generate bulk content');
        }

    } catch (error) {
        alert('Error generating content: ' + error.message);
    } finally {
        bulkBtn.disabled = false;
        bulkBtn.textContent = 'Generate Content Posts';
    }
}

function generateSampleContent(count, categories, platforms, goal) {
    const content = [];
    for (let i = 0; i < count; i++) {
        content.push({
            id: `post_${i + 1}`,
            text: `Sample post ${i + 1} about ${categories[Math.floor(Math.random() * categories.length)]} for ${platforms[Math.floor(Math.random() * platforms.length)]}`,
            category: categories[Math.floor(Math.random() * categories.length)],
            platform: platforms[Math.floor(Math.random() * platforms.length)],
            goal: goal,
            approved: true
        });
    }
    return content;
}

function displayContentPreview(content) {
    const preview = document.getElementById('contentPreview');
    preview.innerHTML = `
        <div class="space-y-2">
            <p class="text-sm text-gray-600 mb-3">Generated ${content.length} content posts:</p>
            ${content.slice(0, 10).map(post =>
                `<div class="bg-white p-3 rounded border text-sm">
                    <strong>${post.platform}:</strong> ${post.text}
                    <span class="text-xs text-gray-500 ml-2">(${post.category})</span>
                </div>`
            ).join('')}
            ${content.length > 10 ? `<p class="text-xs text-gray-500 mt-2">... and ${content.length - 10} more posts</p>` : ''}
        </div>
    `;
}

function proceedToPhase4() {
    document.getElementById('phase3').classList.add('hidden');
    document.getElementById('phase4').classList.remove('hidden');
    updateStepIndicator(4);
    currentPhase = 4;
}

// Phase 4: Visual Assets Generation
async function generateVisualAssets() {
    const visualBtn = document.getElementById('visualAssetsBtn');
    const visualResults = document.getElementById('visualResults');

    visualBtn.disabled = true;
    visualBtn.textContent = 'Generating Visual Assets...';

    try {
        // Simulate visual asset generation
        generatedImages = generatedContent.map((post, index) => ({
            id: `image_${index + 1}`,
            postId: post.id,
            url: `/placeholder-image-${index + 1}.png`,
            type: 'generated',
            overlays: {
                clientImage: document.getElementById('clientImageUrl').value,
                phoneNumber: document.getElementById('phoneNumber').value,
                logo: 'PopKornMachine logo'
            }
        }));

        // Simulate delay for generation
        await new Promise(resolve => setTimeout(resolve, 2000));

        visualResults.classList.remove('hidden');

    } catch (error) {
        alert('Error generating visual assets: ' + error.message);
    } finally {
        visualBtn.disabled = false;
        visualBtn.textContent = 'Generate 100 Visual Assets';
    }
}

function proceedToPhase5() {
    document.getElementById('phase4').classList.add('hidden');
    document.getElementById('phase5').classList.remove('hidden');
    updateStepIndicator(5);
    currentPhase = 5;

    // Initialize approval interface
    setTimeout(() => {
        document.getElementById('approvalContent').classList.add('hidden');
        document.getElementById('approvalInterface').classList.remove('hidden');
        initializeApprovalGrid();
    }, 2000);
}

// Phase 5: Approval System
function initializeApprovalGrid() {
    const grid = document.getElementById('contentGrid');
    const totalPostsCount = document.getElementById('totalPostsCount');
    const approvedCount = document.getElementById('approvedCount');

    grid.innerHTML = '';
    totalPostsCount.textContent = generatedContent.length;
    approvedCount.textContent = generatedContent.length; // Start with all approved

    generatedContent.forEach((post, index) => {
        const item = document.createElement('div');
        item.className = 'bg-white border rounded-lg p-4';
        item.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <span class="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">${post.platform}</span>
                <div class="flex space-x-1">
                    <button onclick="approvePost('${post.id}')" class="text-green-600 hover:text-green-800">✅</button>
                    <button onclick="rejectPost('${post.id}')" class="text-red-600 hover:text-red-800">❌</button>
                </div>
            </div>
            <p class="text-sm text-gray-800 mb-2">${post.text}</p>
            <div class="flex justify-between items-center text-xs text-gray-500">
                <span>${post.category}</span>
                <span id="status_${post.id}">Approved</span>
            </div>
        `;
        grid.appendChild(item);
    });

    updateApprovedCount();
}

function approvePost(postId) {
    const post = generatedContent.find(p => p.id === postId);
    if (post) {
        post.approved = true;
        document.getElementById(`status_${postId}`).textContent = 'Approved';
        document.getElementById(`status_${postId}`).className = 'text-green-600 font-medium';
    }
    updateApprovedCount();
}

function rejectPost(postId) {
    const post = generatedContent.find(p => p.id === postId);
    if (post) {
        post.approved = false;
        document.getElementById(`status_${postId}`).textContent = 'Rejected';
        document.getElementById(`status_${postId}`).className = 'text-red-600 font-medium';
    }
    updateApprovedCount();
}

function approveAll() {
    generatedContent.forEach(post => {
        post.approved = true;
        document.getElementById(`status_${post.id}`).textContent = 'Approved';
        document.getElementById(`status_${post.id}`).className = 'text-green-600 font-medium';
    });
    updateApprovedCount();
}

function rejectAll() {
    generatedContent.forEach(post => {
        post.approved = false;
        document.getElementById(`status_${post.id}`).textContent = 'Rejected';
        document.getElementById(`status_${post.id}`).className = 'text-red-600 font-medium';
    });
    updateApprovedCount();
}

function updateApprovedCount() {
    const approved = generatedContent.filter(p => p.approved).length;
    document.getElementById('approvedCount').textContent = approved;

    const exportBtn = document.getElementById('exportBtn');
    exportBtn.disabled = approved === 0;
}

function exportApproved() {
    const approvedPosts = generatedContent.filter(p => p.approved);
    const exportData = {
        brandProfile: scrapedData,
        brandVoice: brandVoice,
        approvedContent: approvedPosts,
        generatedImages: generatedImages,
        exportDate: new Date().toISOString(),
        totalApproved: approvedPosts.length
    };

    // Create download link
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportLink = document.createElement('a');
    exportLink.setAttribute('href', dataUri);
    exportLink.setAttribute('download', 'approved_content_export.json');
    exportLink.click();

    alert(`✅ Successfully exported ${approvedPosts.length} approved posts!\n\nYour content is ready for posting.`);
}
