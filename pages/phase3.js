// Phase 3 JavaScript - Bulk Content Generation functions
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
