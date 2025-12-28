// Phase 5 JavaScript - Approval System functions
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
