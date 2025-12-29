/**
 * Ad Generation Test
 * Tests AI-powered ad creation using approved characters
 */

const {
  TestResults,
  registerUser,
  loginUser,
  createWorkspace,
  generateCharacters,
  getCharacters,
  updateCharacter,
  generateAds,
  getAds,
  generateRandomEmail,
  waitForCompletion
} = require('./test_utils');

async function testAdGeneration() {
  const results = new TestResults();

  try {
    console.log('Testing ad generation functionality...');

    // Create test user, workspace, and characters
    const email = generateRandomEmail();
    const password = 'testpassword123';

    await registerUser(email, password);
    const token = await loginUser(email, password);
    const workspaceResult = await createWorkspace(token, `Ad Test ${Date.now()}`);
    const workspaceId = workspaceResult.workspace.id;

    // Generate characters
    await generateCharacters(token, workspaceId);

    // Wait for characters and approve some
    await waitForCompletion(async () => {
      const characters = await getCharacters(token, workspaceId);
      return characters.characters && characters.characters.length >= 3;
    }, 10, 1000);

    const characters = await getCharacters(token, workspaceId);

    // Approve first two characters
    await updateCharacter(token, characters.characters[0].id, 'approved');
    await updateCharacter(token, characters.characters[1].id, 'approved');

    results.pass('Setup for ad generation test');

    // Test ad generation
    const adTopic = 'Revolutionary AI Marketing Tool';
    const generateResult = await generateAds(token, workspaceId, [
      characters.characters[0].id,
      characters.characters[1].id
    ], 'linkedin_post', adTopic, 2);

    if (generateResult.message !== 'Ad generation started. Ads will be available shortly.') {
      throw new Error('Ad generation did not start properly');
    }

    results.pass('Ad generation initiation');

    // Wait for ads to be generated
    console.log('Waiting for ads to be generated...');
    await waitForCompletion(async () => {
      const ads = await getAds(token, workspaceId);
      console.log('Found ads:', ads.ads?.length || 0);
      return ads.ads && ads.ads.length >= 2;
    }, 20, 3000); // 20 attempts, 3 second delay = 60 seconds total

    const ads = await getAds(token, workspaceId);

    if (!ads.ads || ads.ads.length < 2) {
      throw new Error('Expected at least 2 ads to be generated');
    }

    results.pass('Ad generation completion');

    // Verify ad content
    const firstAd = ads.ads[0];
    if (!firstAd.content || firstAd.content.length < 20) {
      throw new Error('Ad content too short or missing');
    }

    if (firstAd.ad_type !== 'linkedin_post') {
      throw new Error('Ad type not set correctly');
    }

    if (!firstAd.character_name) {
      throw new Error('Character name not associated with ad');
    }

    results.pass('Ad content validation');

    // Test different ad types
    await generateAds(token, workspaceId, [characters.characters[0].id], 'twitter', adTopic, 1);

    await waitForCompletion(async () => {
      const updatedAds = await getAds(token, workspaceId);
      return updatedAds.ads && updatedAds.ads.some(ad => ad.ad_type === 'twitter');
    }, 15, 2000);

    const updatedAds = await getAds(token, workspaceId);
    const twitterAd = updatedAds.ads.find(ad => ad.ad_type === 'twitter');

    if (!twitterAd) {
      throw new Error('Twitter ad was not generated');
    }

    results.pass('Multiple ad type generation');

    console.log('✅ Ad generation test completed successfully');
    return results;

  } catch (error) {
    results.fail('Ad generation test', error.message);
    return results;
  }
}

// Export for use in main test runner
module.exports = { testAdGeneration };

// Run standalone if called directly
if (require.main === module) {
  testAdGeneration().then(results => {
    results.summary();
    process.exit(results.failed === 0 ? 0 : 1);
  });
}
