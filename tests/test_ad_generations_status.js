/**
 * Electron Marketing Tool - Ad Generation Status Tests
 * Tests for the asynchronous ad generation with status phases
 */

const {
  TestResults,
  registerUser,
  loginUser,
  createWorkspace,
  createAnalysis,
  getAnalyses,
  generateCharacters,
  getCharacters,
  generateAds,
  getAds,
  makeRequest,
  sleep,
  waitForCompletion,
  generateRandomEmail
} = require('./test_utils');

/**
 * Test ad generation with status phases
 */
async function testAdGenerationStatusPhases() {
  const results = new TestResults();

  try {
    console.log('📢 Testing Ad Generation Status Phases');

    // Setup: Create user, workspace, characters
    const email = generateRandomEmail();
    const password = 'testpass123';

    console.log('Creating test user...');
    await registerUser(email, password);
    results.pass('User registration');

    console.log('Logging in...');
    const token = await loginUser(email, password);
    results.pass('User login');

    console.log('Creating workspace...');
    const workspace = await createWorkspace(token, `Ad Test Workspace ${Date.now()}`);
    const workspaceId = workspace.id;
    results.pass('Workspace creation');

    console.log('Generating characters...');
    await generateCharacters(token, workspaceId);
    results.pass('Character generation initiation');

    // Wait for characters to be created
    const characters = await waitForCompletion(async () => {
      const chars = await getCharacters(token, workspaceId);
      return chars.characters && chars.characters.length > 0 ? chars.characters : null;
    }, 60, 5000); // Wait up to 5 minutes

    if (!characters || characters.length === 0) {
      throw new Error('Characters were not created within timeout');
    }
    results.pass('Characters available for ad generation');

    const characterIds = characters.slice(0, 2).map(c => c.id); // Use first 2 characters

    // Test ad generation initiation
    console.log('Starting ad generation...');
    const adResponse = await generateAds(token, workspaceId, characterIds, 'linkedin_post', 'Test Product Launch', 2);
    results.pass('Ad generation initiation');

    // Test ad generation status tracking
    console.log('Testing ad generation status phase progression...');
    const generationId = adResponse.generation_id || adResponse.id;

    // Wait for processing phase to change
    await waitForCompletion(async () => {
      const gens = await makeRequest('/api/ad-generations?workspace_id=' + workspaceId, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const gen = gens.generations.find(g => g.id === generationId);
      return gen && gen.status !== 'processing';
    }, 30, 2000);

    // Check that we progressed through phases
    const finalStatus = await waitForCompletion(async () => {
      const gens = await makeRequest('/api/ad-generations?workspace_id=' + workspaceId, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const gen = gens.generations.find(g => g.id === generationId);
      if (gen && (gen.status === 'completed' || gen.status === 'failed')) {
        return gen.status;
      }
      return null;
    }, 180, 5000); // Wait up to 15 minutes for completion

    if (finalStatus === 'completed') {
      results.pass('Ad generation completed successfully');

      // Verify ads were created
      const ads = await getAds(token, workspaceId);
      if (ads.ads && ads.ads.length >= 2) { // Should have at least 2 ads
        results.pass('Ads created and retrievable');
      } else {
        results.fail('Ads created and retrievable', `Expected at least 2 ads, got ${ads.ads ? ads.ads.length : 0}`);
      }
    } else if (finalStatus === 'failed') {
      results.fail('Ad generation completion', 'Generation failed');
    } else {
      results.fail('Ad generation completion', 'Generation did not complete within timeout');
    }

  } catch (error) {
    results.fail('Ad generation status phases test', error.message);
  }

  return results;
}

/**
 * Test ad generation API endpoints
 */
async function testAdGenerationAPI() {
  const results = new TestResults();

  try {
    console.log('🔌 Testing Ad Generation API Endpoints');

    // Setup
    const email = generateRandomEmail();
    const password = 'testpass123';
    await registerUser(email, password);
    const token = await loginUser(email, password);
    const workspace = await createWorkspace(token, `Ad API Test ${Date.now()}`);
    const workspaceId = workspace.id;

    // Create characters first
    await generateCharacters(token, workspaceId);
    const characters = await waitForCompletion(async () => {
      const chars = await getCharacters(token, workspaceId);
      return chars.characters && chars.characters.length > 0 ? chars.characters : null;
    }, 60, 5000);

    if (!characters || characters.length === 0) {
      throw new Error('Characters not available for testing');
    }

    const characterIds = characters.slice(0, 1).map(c => c.id);

    // Test GET ad generations (empty)
    console.log('Testing GET ad generations (empty)...');
    const emptyResponse = await makeRequest('/api/ad-generations?workspace_id=' + workspaceId, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (emptyResponse.generations && Array.isArray(emptyResponse.generations)) {
      results.pass('GET ad generations returns array');
    } else {
      results.fail('GET ad generations returns array', 'Invalid response format');
    }

    // Test POST ad generation
    console.log('Testing POST ad generation...');
    const postResponse = await generateAds(token, workspaceId, characterIds, 'twitter', 'Test Campaign', 1);

    if (postResponse.message || postResponse.generation_id) {
      results.pass('POST ad generation accepted');
    } else {
      results.fail('POST ad generation accepted', 'Invalid response');
    }

    // Test GET ad generations (with data)
    console.log('Testing GET ad generations (with data)...');
    const populatedResponse = await makeRequest('/api/ad-generations?workspace_id=' + workspaceId, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (populatedResponse.generations && populatedResponse.generations.length > 0) {
      const generation = populatedResponse.generations[0];
      if (generation.id && generation.status && generation.created_at && generation.topic) {
        results.pass('GET ad generations returns valid data');
      } else {
        results.fail('GET ad generations returns valid data', 'Missing required fields');
      }
    } else {
      results.fail('GET ad generations returns valid data', 'No generations found');
    }

    // Test error cases
    console.log('Testing error cases...');

    // Invalid character IDs
    try {
      await generateAds(token, workspaceId, [99999], 'linkedin_post', 'Test', 1);
      results.fail('Error handling for invalid character IDs', 'Should have failed');
    } catch (error) {
      if (error.message.includes('404') || error.message.includes('not found') || error.message.includes('character')) {
        results.pass('Error handling for invalid character IDs');
      } else {
        results.fail('Error handling for invalid character IDs', error.message);
      }
    }

    // Missing required parameters
    try {
      await makeRequest('/api/ads', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: { workspace_id: workspaceId } // Missing character_ids, ad_type, etc.
      });
      results.fail('Error handling for missing parameters', 'Should have failed');
    } catch (error) {
      if (error.message.includes('400') || error.message.includes('required')) {
        results.pass('Error handling for missing parameters');
      } else {
        results.fail('Error handling for missing parameters', error.message);
      }
    }

  } catch (error) {
    results.fail('Ad generation API test', error.message);
  }

  return results;
}

/**
 * Test ad generation polling behavior
 */
async function testAdGenerationPolling() {
  const results = new TestResults();

  try {
    console.log('🔄 Testing Ad Generation Polling');

    // Setup
    const email = generateRandomEmail();
    const password = 'testpass123';
    await registerUser(email, password);
    const token = await loginUser(email, password);
    const workspace = await createWorkspace(token, `Ad Polling Test ${Date.now()}`);
    const workspaceId = workspace.id;

    // Create characters
    await generateCharacters(token, workspaceId);
    const characters = await waitForCompletion(async () => {
      const chars = await getCharacters(token, workspaceId);
      return chars.characters && chars.characters.length > 0 ? chars.characters : null;
    }, 60, 5000);

    if (!characters || characters.length === 0) {
      throw new Error('Characters not available');
    }

    const characterIds = characters.slice(0, 1).map(c => c.id);

    // Start ad generation
    await generateAds(token, workspaceId, characterIds, 'email', 'Polling Test', 1);

    // Test polling behavior
    console.log('Testing ad generation polling behavior...');
    let statusChanges = new Set();
    let pollCount = 0;

    while (pollCount < 15) { // Poll 15 times
      const response = await makeRequest('/api/ad-generations?workspace_id=' + workspaceId, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.generations && response.generations.length > 0) {
        const generation = response.generations[0];
        statusChanges.add(generation.status);

        // If completed or failed, stop polling
        if (generation.status === 'completed' || generation.status === 'failed') {
          break;
        }
      }

      pollCount++;
      await sleep(2000); // Wait 2 seconds between polls
    }

    // Verify we saw status changes (should see multiple phases)
    if (statusChanges.size >= 3) { // Should see processing, analyzing_brand_data, planning_content_mix, etc.
      results.pass('Ad generation polling shows status progression');
    } else {
      results.fail('Ad generation polling shows status progression', `Only saw ${statusChanges.size} status(es): ${Array.from(statusChanges).join(', ')}`);
    }

    // Verify content_mix is stored
    const finalResponse = await makeRequest('/api/ad-generations?workspace_id=' + workspaceId, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (finalResponse.generations && finalResponse.generations.length > 0) {
      const generation = finalResponse.generations[0];
      if (generation.content_mix && typeof generation.content_mix === 'object') {
        results.pass('Content mix data is properly stored');
      } else {
        results.fail('Content mix data is properly stored', 'Missing or invalid content_mix');
      }

      // Check timestamps
      if (generation.updated_at && generation.created_at) {
        const updated = new Date(generation.updated_at);
        const created = new Date(generation.created_at);
        if (updated >= created) {
          results.pass('Ad generation timestamps are properly updated');
        } else {
          results.fail('Ad generation timestamps are properly updated', 'Updated time is before created time');
        }
      } else {
        results.fail('Ad generation timestamps are properly updated', 'Missing timestamp fields');
      }
    }

  } catch (error) {
    results.fail('Ad generation polling test', error.message);
  }

  return results;
}

/**
 * Test ad generation with custom content mix
 */
async function testAdGenerationCustomContentMix() {
  const results = new TestResults();

  try {
    console.log('🎨 Testing Ad Generation with Custom Content Mix');

    // Setup
    const email = generateRandomEmail();
    const password = 'testpass123';
    await registerUser(email, password);
    const token = await loginUser(email, password);
    const workspace = await createWorkspace(token, `Content Mix Test ${Date.now()}`);
    const workspaceId = workspace.id;

    // Create characters
    await generateCharacters(token, workspaceId);
    const characters = await waitForCompletion(async () => {
      const chars = await getCharacters(token, workspaceId);
      return chars.characters && chars.characters.length > 0 ? chars.characters : null;
    }, 60, 5000);

    if (!characters || characters.length === 0) {
      throw new Error('Characters not available');
    }

    const characterIds = characters.slice(0, 1).map(c => c.id);

    // Test with custom content mix
    const customMix = {
      education: 60,
      story: 20,
      proof: 15,
      promotion: 5
    };

    console.log('Testing custom content mix...');
    const adResponse = await makeRequest('/api/ads', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: {
        workspace_id: workspaceId,
        character_ids: characterIds,
        ad_type: 'linkedin_post',
        topic: 'Custom Content Mix Test',
        quantity: 4,
        content_mix: customMix
      }
    });

    if (adResponse.message || adResponse.generation_id) {
      results.pass('Custom content mix accepted');

      // Wait for completion and verify content mix was stored
      const finalStatus = await waitForCompletion(async () => {
        const gens = await makeRequest('/api/ad-generations?workspace_id=' + workspaceId, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const gen = gens.generations.find(g => g.topic === 'Custom Content Mix Test');
        if (gen && (gen.status === 'completed' || gen.status === 'failed')) {
          return gen;
        }
        return null;
      }, 180, 5000);

      if (finalStatus && finalStatus.content_mix) {
        const storedMix = finalStatus.content_mix;
        if (JSON.stringify(storedMix) === JSON.stringify(customMix)) {
          results.pass('Custom content mix properly stored');
        } else {
          results.fail('Custom content mix properly stored', `Expected ${JSON.stringify(customMix)}, got ${JSON.stringify(storedMix)}`);
        }
      } else {
        results.fail('Custom content mix properly stored', 'Content mix not found in completed generation');
      }
    } else {
      results.fail('Custom content mix accepted', 'Invalid response');
    }

  } catch (error) {
    results.fail('Ad generation custom content mix test', error.message);
  }

  return results;
}

/**
 * Main test function for ad generations
 */
async function testAdGenerationsStatus() {
  const results = new TestResults();

  console.log('📢 Ad Generation Status Tests');
  console.log('=' .repeat(40));

  // Run all ad generation tests
  const statusPhasesResults = await testAdGenerationStatusPhases();
  const apiResults = await testAdGenerationAPI();
  const pollingResults = await testAdGenerationPolling();
  const contentMixResults = await testAdGenerationCustomContentMix();

  // Aggregate results
  results.passed += statusPhasesResults.passed + apiResults.passed + pollingResults.passed + contentMixResults.passed;
  results.failed += statusPhasesResults.failed + apiResults.failed + pollingResults.failed + contentMixResults.failed;
  results.errors.push(...statusPhasesResults.errors, ...apiResults.errors, ...pollingResults.errors, ...contentMixResults.errors);

  return results;
}

module.exports = { testAdGenerationsStatus };
