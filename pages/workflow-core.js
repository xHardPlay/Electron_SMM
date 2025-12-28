// Workflow Core JavaScript - global variables and initialization
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
