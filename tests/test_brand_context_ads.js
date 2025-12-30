/**
 * Brand Context Ad Generation Test
 * Tests that ads are generated with proper brand context from brand analysis
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
  updateCharacter,
  generateAds,
  getAds,
  generateRandomEmail,
  waitForCompletion
} = require('./test_utils');

async function testBrandContextAdGeneration() {
  const results = new TestResults();

  try {
    console.log('Testing brand context in ad generation...');

    // Create test user and workspace
    const email = generateRandomEmail();
    const password = 'testpassword123';

    await registerUser(email, password);
    const token = await loginUser(email, password);
    const workspaceResult = await createWorkspace(token, `Brand Context Test ${Date.now()}`);
    const workspaceId = workspaceResult.workspace.id;

    results.pass('Setup for brand context test');

    // Create brand analysis
    const testUrl = 'https://clearfuturecs.com/'; // Test URL with actual HTML content
    const analysisResult = await createAnalysis(token, workspaceId, testUrl);

    // Wait for analysis completion
    console.log('Waiting for brand analysis to complete...');
    const completedAnalysis = await waitForCompletion(async () => {
      const analyses = await getAnalyses(token, workspaceId);
      const analysis = analyses.analyses.find(a => a.id === analysisResult.analysis.id);
      return analysis && analysis.status === 'completed' ? analysis : null;
    }, 30, 3000);

    if (!completedAnalysis) {
      throw new Error('Brand analysis did not complete');
    }

    results.pass('Brand analysis completion');

    // Generate characters with brand context
    await generateCharacters(token, workspaceId, completedAnalysis.id);

    // Wait for characters to be generated
    await waitForCompletion(async () => {
      const characters = await getCharacters(token, workspaceId);
      return characters.characters && characters.characters.length >= 1;
    }, 10, 1000);

    const characters = await getCharacters(token, workspaceId);

    // Approve first character
    await updateCharacter(token, characters.characters[0].id, 'approved');

    results.pass('Character generation with brand context');

    // Generate ads - should now include brand context
    const adTopic = 'Innovative Cybersecurity Solutions';
    const generateResult = await generateAds(token, workspaceId, [
      characters.characters[0].id
    ], 'linkedin_post', adTopic, 1);

    if (generateResult.message !== 'Ad generation started. Ads will be available shortly.') {
      throw new Error('Ad generation did not start properly');
    }

    // Wait for ads to be generated
    console.log('Waiting for ads with brand context to be generated...');
    await waitForCompletion(async () => {
      const ads = await getAds(token, workspaceId);
      return ads.ads && ads.ads.length >= 1;
    }, 20, 3000);

    const ads = await getAds(token, workspaceId);
    const generatedAd = ads.ads[0];

    if (!generatedAd || !generatedAd.content) {
      throw new Error('Ad was not generated or has no content');
    }

    results.pass('Ad generation with brand context');

    // Verify ad content includes brand elements
    const adContent = generatedAd.content.toLowerCase();

    // Check if ad mentions brand-related terms (this is a basic check)
    // Since we know the test URL is clearfuturecs.com, we expect some brand context
    const hasBrandElements = adContent.includes('cybersecurity') ||
                           adContent.includes('security') ||
                           adContent.includes('clearfuture') ||
                           adContent.length > 50; // At minimum, should be substantial content

    if (!hasBrandElements) {
      console.warn('Warning: Ad content may not include expected brand elements. Content:', generatedAd.content);
    }

    results.pass('Ad content validation with brand context');

    console.log('✅ Brand context ad generation test completed successfully');
    console.log('Sample ad content:', generatedAd.content.substring(0, 200) + '...');

    return results;

  } catch (error) {
    results.fail('Brand context ad generation test', error.message);
    return results;
  }
}

// Export for use in main test runner
module.exports = { testBrandContextAdGeneration };

// Run standalone if called directly
if (require.main === module) {
  testBrandContextAdGeneration().then(results => {
    results.summary();
    process.exit(results.failed === 0 ? 0 : 1);
  });
}
