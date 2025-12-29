/**
 * Electron Marketing Tool - Test Utilities
 * Shared utilities for testing the Electron API
 */

const BASE_URL = 'https://electron-backend.carlos-mdtz9.workers.dev';

/**
 * Test result tracking
 */
class TestResults {
  constructor() {
    this.passed = 0;
    this.failed = 0;
    this.errors = [];
    this.startTime = Date.now();
  }

  pass(testName) {
    this.passed++;
    console.log(`✅ ${testName}`);
  }

  fail(testName, error) {
    this.failed++;
    this.errors.push({ test: testName, error });
    console.log(`❌ ${testName}: ${error}`);
  }

  summary() {
    const duration = Date.now() - this.startTime;
    const total = this.passed + this.failed;

    console.log('\n' + '='.repeat(50));
    console.log(`Test Results: ${this.passed}/${total} passed (${duration}ms)`);

    if (this.errors.length > 0) {
      console.log('\n❌ Failed Tests:');
      this.errors.forEach(({ test, error }) => {
        console.log(`  - ${test}: ${error}`);
      });
    }

    return this.failed === 0;
  }
}

/**
 * HTTP request utilities
 */
async function makeRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`${response.status}: ${error}`);
  }

  return response.json();
}

/**
 * Authentication utilities
 */
async function registerUser(email, password) {
  return makeRequest('/api/register', {
    method: 'POST',
    body: { email, password },
  });
}

async function loginUser(email, password) {
  const response = await makeRequest('/api/login', {
    method: 'POST',
    body: { email, password },
  });
  return response.token;
}

/**
 * Workspace utilities
 */
async function createWorkspace(token, name) {
  return makeRequest('/api/workspaces', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: { name },
  });
}

async function getWorkspaces(token) {
  return makeRequest('/api/workspaces', {
    headers: { 'Authorization': `Bearer ${token}` },
  });
}

/**
 * Brand analysis utilities
 */
async function createAnalysis(token, workspaceId, url) {
  return makeRequest('/api/analyses', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: { workspace_id: workspaceId, url, analysis_type: 'url' },
  });
}

async function getAnalyses(token, workspaceId) {
  return makeRequest(`/api/analyses?workspace_id=${workspaceId}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
}

/**
 * Character utilities
 */
async function generateCharacters(token, workspaceId, brandAnalysisId = null) {
  return makeRequest('/api/characters', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: { workspace_id: workspaceId, brand_analysis: brandAnalysisId },
  });
}

async function getCharacters(token, workspaceId) {
  return makeRequest(`/api/characters?workspace_id=${workspaceId}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
}

async function updateCharacter(token, characterId, status) {
  return makeRequest(`/api/characters/${characterId}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
    body: { status },
  });
}

/**
 * Ad utilities
 */
async function generateAds(token, workspaceId, characterIds, adType, topic, quantity) {
  return makeRequest('/api/ads', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: { workspace_id: workspaceId, character_ids: characterIds, ad_type: adType, topic, quantity },
  });
}

async function getAds(token, workspaceId) {
  return makeRequest(`/api/ads?workspace_id=${workspaceId}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
}

/**
 * Utility functions
 */
function generateRandomEmail() {
  return `test-${Date.now()}-${Math.random().toString(36).substring(7)}@electron.test`;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForCompletion(checkFunction, maxAttempts = 30, delay = 2000) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const result = await checkFunction();
      if (result) return result;
    } catch (error) {
      // Continue polling
    }
    await sleep(delay);
  }
  throw new Error('Timeout waiting for completion');
}

module.exports = {
  TestResults,
  makeRequest,
  registerUser,
  loginUser,
  createWorkspace,
  getWorkspaces,
  createAnalysis,
  getAnalyses,
  generateCharacters,
  getCharacters,
  updateCharacter,
  generateAds,
  getAds,
  generateRandomEmail,
  sleep,
  waitForCompletion,
};
