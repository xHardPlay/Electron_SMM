/**
 * Electron Marketing Tool - Analysis Deletion Test
 * Tests analysis deletion functionality
 */

const { TestResults, registerUser, loginUser, createWorkspace, createAnalysis, getAnalyses } = require('./test_utils');

const BASE_URL = 'https://electron-backend.carlos-mdtz9.workers.dev';

/**
 * Test analysis deletion functionality
 */
async function testAnalysisDeletion() {
  const results = new TestResults();

  try {
    console.log('Testing analysis deletion...');

    // Setup: Register and login user
    const email = `test-${Date.now()}-${Math.random().toString(36).substring(7)}@electron.test`;
    const password = 'testpass123';

    await registerUser(email, password);
    results.pass('User setup for analysis deletion test');

    const token = await loginUser(email, password);
    results.pass('User authentication for analysis deletion test');

    // Create workspace
    const workspace = await createWorkspace(token, `Test Workspace ${Date.now()}`);
    const workspaceId = workspace.workspace.id;
    results.pass('Workspace creation for analysis deletion test');

    // Create an analysis
    const analysis = await createAnalysis(token, workspaceId, 'https://example.com');
    const analysisId = analysis.analysis.id;
    results.pass('Analysis creation for deletion test');

    // Verify analysis exists
    const analysesBefore = await getAnalyses(token, workspaceId);
    const analysisExists = analysesBefore.analyses.some(a => a.id === analysisId);
    if (!analysisExists) {
      throw new Error('Analysis was not created properly');
    }
    results.pass('Analysis existence verification');

    // Delete the analysis
    const deleteResponse = await fetch(`${BASE_URL}/api/analyses/${analysisId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!deleteResponse.ok) {
      const error = await deleteResponse.text();
      throw new Error(`Delete failed: ${deleteResponse.status}: ${error}`);
    }

    const deleteResult = await deleteResponse.json();
    if (deleteResult.message !== 'Analysis deleted successfully') {
      throw new Error('Unexpected delete response message');
    }
    results.pass('Analysis deletion');

    // Verify analysis is gone
    const analysesAfter = await getAnalyses(token, workspaceId);
    const analysisStillExists = analysesAfter.analyses.some(a => a.id === analysisId);
    if (analysisStillExists) {
      throw new Error('Analysis still exists after deletion');
    }
    results.pass('Analysis deletion verification');

    // Test deleting non-existent analysis
    const nonexistentId = 999999;
    const deleteNonexistentResponse = await fetch(`${BASE_URL}/api/analyses/${nonexistentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (deleteNonexistentResponse.status !== 404) {
      throw new Error(`Expected 404 for non-existent analysis, got ${deleteNonexistentResponse.status}`);
    }
    results.pass('Non-existent analysis deletion handling');

    console.log('✅ Analysis deletion test completed successfully');

  } catch (error) {
    results.fail('Analysis Deletion Test', error.message);
    console.error('Analysis deletion test error:', error);
  }

  return results;
}

module.exports = { testAnalysisDeletion };
