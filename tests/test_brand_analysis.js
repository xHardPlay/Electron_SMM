/**
 * Brand Analysis Test
 * Tests URL analysis functionality and AI processing
 */

const {
  TestResults,
  registerUser,
  loginUser,
  createWorkspace,
  createAnalysis,
  getAnalyses,
  generateRandomEmail,
  waitForCompletion
} = require('./test_utils');

async function testBrandAnalysis() {
  const results = new TestResults();

  try {
    console.log('Testing brand analysis functionality...');

    // Create test user and workspace
    const email = generateRandomEmail();
    const password = 'testpassword123';

    await registerUser(email, password);
    const token = await loginUser(email, password);
    const workspaceResult = await createWorkspace(token, `Analysis Test ${Date.now()}`);
    const workspaceId = workspaceResult.workspace.id;

    results.pass('Setup for brand analysis test');

    // Test analysis creation
    const testUrl = 'https://httpbin.org/html'; // Test URL with actual HTML content
    const analysisResult = await createAnalysis(token, workspaceId, testUrl);

    if (!analysisResult.analysis || analysisResult.analysis.status !== 'processing') {
      throw new Error('Analysis creation failed');
    }

    results.pass('Brand analysis creation');

    // Wait for analysis completion (with timeout)
    console.log('Waiting for AI analysis to complete...');
    const completedAnalysis = await waitForCompletion(async () => {
      const analyses = await getAnalyses(token, workspaceId);
      const analysis = analyses.analyses.find(a => a.id === analysisResult.analysis.id);
      return analysis && analysis.status === 'completed' ? analysis : null;
    }, 30, 3000); // 30 attempts, 3 second delay

    if (!completedAnalysis || !completedAnalysis.ai_analysis) {
      throw new Error('Analysis did not complete or returned no AI content');
    }

    results.pass('AI analysis completion');

    // Verify analysis content
    if (completedAnalysis.ai_analysis.length < 10) {
      throw new Error('AI analysis content too short');
    }

    results.pass('Analysis content validation');

    console.log('✅ Brand analysis test completed successfully');
    return results;

  } catch (error) {
    results.fail('Brand analysis test', error.message);
    return results;
  }
}

// Export for use in main test runner
module.exports = { testBrandAnalysis };

// Run standalone if called directly
if (require.main === module) {
  testBrandAnalysis().then(results => {
    results.summary();
    process.exit(results.failed === 0 ? 0 : 1);
  });
}
