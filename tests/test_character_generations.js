/**
 * Electron Marketing Tool - Character Generation Tests
 * Tests for the new asynchronous character generation with status phases
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
  makeRequest,
  sleep,
  waitForCompletion,
  generateRandomEmail
} = require('./test_utils');

/**
 * Test character generation with status phases
 */
async function testCharacterGenerationStatusPhases() {
  const results = new TestResults();

  try {
    console.log('🎭 Testing Character Generation Status Phases');

    // Setup: Create user and workspace
    const email = generateRandomEmail();
    const password = 'testpass123';

    console.log('Creating test user...');
    await registerUser(email, password);
    results.pass('User registration');

    console.log('Logging in...');
    const token = await loginUser(email, password);
    results.pass('User login');

    console.log('Creating workspace...');
    const workspaceResponse = await createWorkspace(token, `Test Workspace ${Date.now()}`);
    const workspaceId = workspaceResponse.workspace.id;
    results.pass('Workspace creation');

    // Test character generation initiation (without brand analysis for simplicity)
    console.log('Starting character generation...');
    console.log('Using workspaceId:', workspaceId);
    console.log('Request body will be:', { workspace_id: workspaceId });
    const genResponse = await makeRequest('/api/character-generations', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: { workspace_id: workspaceId }
    });
    console.log('Generation response:', genResponse);
    if (genResponse.message) {
      results.pass('Character generation initiation');
    } else {
      results.fail('Character generation initiation', 'Invalid response: ' + JSON.stringify(genResponse));
      return results;
    }

    // Test character generation status tracking
    console.log('Testing status phase progression...');
    const generationId = genResponse.generation_id || genResponse.id;
    console.log('Looking for generation with ID:', generationId);

    // Wait for completion - since generation is very fast, just wait a reasonable time
    const finalStatus = await waitForCompletion(async () => {
      const gens = await makeRequest('/api/character-generations?workspace_id=' + workspaceId, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // Find the most recent generation (should be ours)
      const sortedGens = gens.generations.sort((a, b) => b.id - a.id);
      const latestGen = sortedGens[0];

      console.log('Latest generation:', { id: latestGen?.id, status: latestGen?.status });

      if (latestGen && (latestGen.status === 'completed' || latestGen.status === 'failed')) {
        console.log('Generation completed with status:', latestGen.status);
        return latestGen.status;
      }
      // Log progress
      if (latestGen) {
        console.log('Current status:', latestGen.status);
      }
      return null;
    }, 15, 2000); // Wait up to 30 seconds for completion

    if (finalStatus === 'completed') {
      results.pass('Character generation completed successfully');

      // Verify characters were created
      const characters = await getCharacters(token, workspaceId);
      if (characters.characters && characters.characters.length > 0) {
        results.pass('Characters created and retrievable');
      } else {
        results.fail('Characters created and retrievable', 'No characters found after generation');
      }
    } else if (finalStatus === 'failed') {
      results.fail('Character generation completion', 'Generation failed');
    } else {
      results.fail('Character generation completion', 'Generation did not complete within timeout');
    }

  } catch (error) {
    results.fail('Character generation status phases test', error.message);
  }

  return results;
}

/**
 * Test character generation API endpoints
 */
async function testCharacterGenerationAPI() {
  const results = new TestResults();

  try {
    console.log('🔌 Testing Character Generation API Endpoints');

    // Setup
    const email = generateRandomEmail();
    const password = 'testpass123';
    await registerUser(email, password);
    const token = await loginUser(email, password);
    const workspaceResponse = await createWorkspace(token, `API Test ${Date.now()}`);
    const workspaceId = workspaceResponse.workspace.id;

    // Test GET character generations (empty)
    console.log('Testing GET character generations (empty)...');
    const emptyResponse = await makeRequest('/api/character-generations?workspace_id=' + workspaceId.toString(), {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (emptyResponse.generations && Array.isArray(emptyResponse.generations)) {
      results.pass('GET character generations returns array');
    } else {
      results.fail('GET character generations returns array', 'Invalid response format');
    }

    // Test POST character generation
    console.log('Testing POST character generation...');
    const postResponse = await makeRequest('/api/character-generations', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: { workspace_id: workspaceId }
    });

    if (postResponse.message && postResponse.workspace_id === workspaceId) {
      results.pass('POST character generation accepted');
    } else {
      results.fail('POST character generation accepted', 'Invalid response');
    }

    // Test GET character generations (with data)
    console.log('Testing GET character generations (with data)...');
    const populatedResponse = await makeRequest('/api/character-generations?workspace_id=' + workspaceId.toString(), {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (populatedResponse.generations && populatedResponse.generations.length > 0) {
      const generation = populatedResponse.generations[0];
      if (generation.id && generation.status && generation.created_at) {
        results.pass('GET character generations returns valid data');
      } else {
        results.fail('GET character generations returns valid data', 'Missing required fields');
      }
    } else {
      results.fail('GET character generations returns valid data', 'No generations found');
    }

    // Test error cases
    console.log('Testing error cases...');

    // Invalid workspace
    try {
      await makeRequest('/api/character-generations', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: { workspace_id: 99999 }
      });
      results.fail('Error handling for invalid workspace', 'Should have failed');
    } catch (error) {
      if (error.message.includes('404') || error.message.includes('not found')) {
        results.pass('Error handling for invalid workspace');
      } else {
        results.fail('Error handling for invalid workspace', error.message);
      }
    }

    // Missing workspace_id
    try {
      await makeRequest('/api/character-generations', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: {}
      });
      results.fail('Error handling for missing workspace_id', 'Should have failed');
    } catch (error) {
      if (error.message.includes('400') || error.message.includes('required')) {
        results.pass('Error handling for missing workspace_id');
      } else {
        results.fail('Error handling for missing workspace_id', error.message);
      }
    }

  } catch (error) {
    results.fail('Character generation API test', error.message);
  }

  return results;
}

/**
 * Test character generation polling behavior
 */
async function testCharacterGenerationPolling() {
  const results = new TestResults();

  try {
    console.log('🔄 Testing Character Generation Polling');

    // Setup
    const email = generateRandomEmail();
    const password = 'testpass123';
    await registerUser(email, password);
    const token = await loginUser(email, password);
    const workspaceResponse = await createWorkspace(token, `Polling Test ${Date.now()}`);
    const workspaceId = workspaceResponse.workspace.id;

    // Start generation
    await makeRequest('/api/character-generations', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: { workspace_id: workspaceId }
    });

    // Test polling behavior - check multiple times
    console.log('Testing polling behavior...');
    let statusChanges = new Set();
    let pollCount = 0;

    while (pollCount < 10) { // Poll 10 times
      const response = await makeRequest('/api/character-generations?workspace_id=' + workspaceId, {
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
      await sleep(1000); // Wait 1 second between polls
    }

    // Verify we saw status changes
    if (statusChanges.size >= 2) { // Should see at least 2 different statuses
      results.pass('Polling shows status progression');
    } else {
      results.fail('Polling shows status progression', `Only saw ${statusChanges.size} status(es): ${Array.from(statusChanges).join(', ')}`);
    }

    // Verify timestamps are updating
    const finalResponse = await makeRequest('/api/character-generations?workspace_id=' + workspaceId, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (finalResponse.generations && finalResponse.generations.length > 0) {
      const generation = finalResponse.generations[0];
      if (generation.updated_at && generation.created_at) {
        // Parse timestamps and compare (handle timezone issues)
        const updatedStr = generation.updated_at.replace('T', ' ').replace('Z', '');
        const createdStr = generation.created_at.replace('T', ' ').replace('Z', '');
        const updated = new Date(updatedStr);
        const created = new Date(createdStr);

        if (!isNaN(updated.getTime()) && !isNaN(created.getTime())) {
          if (updated >= created) {
            results.pass('Timestamps are properly updated');
          } else {
            results.fail('Timestamps are properly updated', `Updated: ${updated}, Created: ${created}`);
          }
        } else {
          results.fail('Timestamps are properly updated', 'Invalid date format');
        }
      } else {
        results.fail('Timestamps are properly updated', 'Missing timestamp fields');
      }
    }

  } catch (error) {
    results.fail('Character generation polling test', error.message);
  }

  return results;
}

/**
 * Main test function for character generations
 */
async function testCharacterGenerations() {
  const results = new TestResults();

  console.log('🎭 Character Generation Tests');
  console.log('=' .repeat(40));

  // Run all character generation tests
  const statusPhasesResults = await testCharacterGenerationStatusPhases();
  const apiResults = await testCharacterGenerationAPI();
  const pollingResults = await testCharacterGenerationPolling();

  // Aggregate results
  results.passed += statusPhasesResults.passed + apiResults.passed + pollingResults.passed;
  results.failed += statusPhasesResults.failed + apiResults.failed + pollingResults.failed;
  results.errors.push(...statusPhasesResults.errors, ...apiResults.errors, ...pollingResults.errors);

  return results;
}

module.exports = { testCharacterGenerations };
