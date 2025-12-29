/**
 * Electron Marketing Tool - Health Endpoint Test
 * Tests the basic health check functionality
 */

const { TestResults } = require('./test_utils');

const BASE_URL = 'https://electron-backend.carlos-mdtz9.workers.dev';

/**
 * Test health endpoint functionality
 */
async function testHealthEndpoint() {
  const results = new TestResults();

  try {
    console.log('Testing health endpoint...');

    // Test GET request to health endpoint
    const healthResponse = await fetch(`${BASE_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!healthResponse.ok) {
      throw new Error(`Health endpoint failed: ${healthResponse.status}`);
    }

    const healthData = await healthResponse.json();

    // Verify response structure
    if (!healthData.status) {
      throw new Error('Health response missing status field');
    }

    if (healthData.status !== 'ok') {
      throw new Error(`Health status is not 'ok': ${healthData.status}`);
    }

    results.pass('Health endpoint response');

    if (!healthData.message) {
      throw new Error('Health response missing message field');
    }

    if (!healthData.message.includes('running')) {
      throw new Error(`Health message doesn't indicate running status: ${healthData.message}`);
    }

    results.pass('Health endpoint message validation');

    // Test OPTIONS request (CORS preflight)
    const optionsResponse = await fetch(`${BASE_URL}/api/health`, {
      method: 'OPTIONS',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (optionsResponse.status !== 200) {
      throw new Error(`OPTIONS request failed: ${optionsResponse.status}`);
    }

    results.pass('CORS preflight request handling');

    // Test non-existent endpoint
    const notFoundResponse = await fetch(`${BASE_URL}/api/nonexistent`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (notFoundResponse.status !== 404) {
      throw new Error(`Expected 404 for non-existent endpoint, got ${notFoundResponse.status}`);
    }

    results.pass('404 handling for non-existent endpoints');

    console.log('✅ Health endpoint test completed successfully');

  } catch (error) {
    results.fail('Health Endpoint Test', error.message);
    console.error('Health endpoint test error:', error);
  }

  return results;
}

module.exports = { testHealthEndpoint };
