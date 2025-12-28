// Phase 4 JavaScript - Visual Assets Generation functions

// Logo preview functionality - runs when phase 4 is loaded
function initializePhase4() {
    const clientImageUrl = document.getElementById('clientImageUrl');
    const logoImage = document.getElementById('logoImage');

    if (clientImageUrl && logoImage) {
        clientImageUrl.addEventListener('input', function() {
            const url = this.value.trim();
            if (url) {
                logoImage.src = url;
            } else {
                hideLogoPreview();
            }
        });
    }
}

// Try to initialize immediately, and also listen for phase changes
document.addEventListener('DOMContentLoaded', function() {
    initializePhase4();
});

// Also try to initialize when the phase becomes visible
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
            const phase4Container = document.getElementById('phase4-container');
            if (phase4Container && phase4Container.innerHTML.includes('phase4')) {
                setTimeout(initializePhase4, 100); // Small delay to ensure DOM is ready
            }
        }
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

function showLogoPreview() {
    document.getElementById('logoPreview').classList.remove('hidden');
}

function hideLogoPreview() {
    document.getElementById('logoPreview').classList.add('hidden');
}
async function generateVisualAssets() {
    const visualBtn = document.getElementById('visualAssetsBtn');
    const visualResults = document.getElementById('visualResults');

    visualBtn.disabled = true;
    visualBtn.textContent = 'Selecting Stock Photos...';

    try {
        if (!generatedContent || generatedContent.length === 0) {
            throw new Error('No content available. Please complete Phase 3 first.');
        }

        console.log('Generated content from Phase 3:', generatedContent);

        // Prepare posts for stock photo selection
        const postsForImages = generatedContent.map(post => ({
            id: post.id,
            text: post.text,
            category: post.category,
            platform: post.platform
        }));

        console.log('Posts being sent to stock photo API:', postsForImages);

        // Call the stock photo selection API
        const response = await fetch('/api/workflow/stock-photos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                posts: postsForImages,
                brandData: scrapedData
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Failed to select stock photos');
        }

        console.log('Stock photo API results:', result.results);

        // Transform the results into our expected format
        generatedImages = result.results.map((photoResult, index) => ({
            id: `image_${index + 1}`,
            postId: photoResult.postId,
            url: photoResult.selectedImage.url,
            thumb: photoResult.selectedImage.thumb,
            type: 'stock',
            description: photoResult.selectedImage.description,
            photographer: photoResult.selectedImage.photographer,
            keywords: photoResult.keywords,
            postText: generatedContent.find(p => p.id === photoResult.postId)?.text || 'Post text not found',
            overlays: {
                clientImage: document.getElementById('clientImageUrl').value,
                phoneNumber: document.getElementById('phoneNumber').value,
                logo: 'PopKornMachine logo'
            }
        }));

        // Display the selected stock images
        displayVisualAssets(generatedImages);

        visualResults.classList.remove('hidden');

    } catch (error) {
        alert('Error selecting stock photos: ' + error.message);
        console.error('Stock photo selection error:', error);
    } finally {
        visualBtn.disabled = false;
        visualBtn.textContent = 'Select 100 Stock Photos';
    }
}

function displayVisualAssets(images) {
    const imageGrid = document.getElementById('imageGrid');
    imageGrid.innerHTML = '';

    // Display first 12 images as a preview (since 100 would be too many)
    const previewImages = images.slice(0, 12);

    previewImages.forEach(image => {
        const imageCard = document.createElement('div');
        imageCard.className = 'bg-white p-2 rounded border shadow-sm hover:shadow-md transition-shadow cursor-pointer';
        imageCard.onclick = () => showPostDetailModal(image);
        imageCard.innerHTML = `
            <img src="${image.thumb || image.url}" alt="${image.description || 'Stock photo'}" class="w-full h-24 object-cover rounded mb-2" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOUI5QkE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4=';">
            <div class="text-xs text-gray-600 space-y-1">
                <div class="font-medium">Post ${image.postId.split('_')[1]}</div>
                <div class="truncate text-xs" title="${image.postText}">${image.postText ? image.postText.substring(0, 30) + '...' : 'No post text'}</div>
                <div class="text-gray-400">by ${image.photographer}</div>
                ${image.keywords ? `<div class="text-blue-500 text-xs">#${image.keywords.slice(0, 2).join(' #')}</div>` : ''}
            </div>
        `;
        imageGrid.appendChild(imageCard);
    });

    if (images.length > 12) {
        const moreIndicator = document.createElement('div');
        moreIndicator.className = 'bg-gray-100 p-4 rounded border text-center text-sm text-gray-500 hover:bg-gray-200 cursor-pointer transition-colors';
        moreIndicator.innerHTML = `
            <div class="font-medium">+${images.length - 12} more images</div>
            <div class="text-xs mt-1">Click to see all selected stock photos</div>
        `;
        moreIndicator.onclick = () => showAllImagesModal(images);
        imageGrid.appendChild(moreIndicator);
    }
}

function showPostDetailModal(image) {
    // Create a modal to show full post details
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-lg max-w-2xl max-h-[90vh] overflow-auto p-6">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold">Post ${image.postId.split('_')[1]} Details</h3>
                <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
            </div>
            <div class="space-y-4">
                <div>
                    <img src="${image.url}" alt="${image.description}" class="w-full max-h-64 object-cover rounded-lg cursor-pointer" onclick="window.open('${image.url}', '_blank')">
                </div>
                <div class="grid md:grid-cols-2 gap-4">
                    <div>
                        <h4 class="font-medium text-gray-900 mb-2">Stock Photo Info</h4>
                        <div class="text-sm text-gray-600 space-y-1">
                            <div><strong>Description:</strong> ${image.description || 'No description'}</div>
                            <div><strong>Photographer:</strong> ${image.photographer || 'Unknown'}</div>
                            <div><strong>Keywords:</strong> ${image.keywords ? image.keywords.join(', ') : 'None'}</div>
                        </div>
                    </div>
                    <div>
                        <h4 class="font-medium text-gray-900 mb-2">Post Content</h4>
                        <div class="text-sm text-gray-600">
                            <div class="bg-gray-50 p-3 rounded max-h-32 overflow-y-auto">
                                ${image.postText || 'Post text not available'}
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <h4 class="font-medium text-gray-900 mb-2">Brand Overlays</h4>
                    <div class="text-sm text-gray-600 space-y-1">
                        <div><strong>Phone:</strong> ${image.overlays.phoneNumber || 'Not set'}</div>
                        <div><strong>Logo:</strong> ${image.overlays.logo || 'Not set'}</div>
                        <div><strong>Client Image:</strong> ${image.overlays.clientImage || 'Not set'}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Global variable to store current images for modal functions
let currentImagesForModal = [];

function showAllImagesModal(images) {
    currentImagesForModal = images;
    // Create a simple modal to show all images
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto p-6">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold">All Selected Stock Photos (${images.length})</h3>
                <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                ${images.map((image, index) => `
                    <div class="bg-white p-2 rounded border shadow-sm cursor-pointer hover:shadow-md transition-shadow" onclick="showPostDetailModalByIndex(${index})">
                        <img src="${image.thumb || image.url}" alt="${image.description}" class="w-full h-24 object-cover rounded mb-2">
                        <div class="text-xs text-gray-600 space-y-1">
                            <div class="font-medium">Post ${image.postId.split('_')[1]}</div>
                            <div class="truncate" title="${image.postText}">${image.postText ? image.postText.substring(0, 25) + '...' : 'No post text'}</div>
                            <div class="text-gray-400">by ${image.photographer}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function showPostDetailModalByIndex(index) {
    if (currentImagesForModal[index]) {
        showPostDetailModal(currentImagesForModal[index]);
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
