/**
 * Character Test
 * Tests AI character generation and management
 */

const {
  TestResults,
  registerUser,
  loginUser,
  createWorkspace,
  generateCharacters,
  getCharacters,
  updateCharacter,
  generateRandomEmail,
  waitForCompletion
} = require('./test_utils');

async function testCharacterManagement() {
  const results = new TestResults();

  try {
    console.log('Testing character management...');

    // Create test user and workspace
    const email = generateRandomEmail();
    const password = 'testpassword123';

    await registerUser(email, password);
    const token = await loginUser(email, password);
    const workspaceResult = await createWorkspace(token, `Character Test ${Date.now()}`);
    const workspaceId = workspaceResult.workspace.id;

    results.pass('Setup for character test');

    // Test character generation
    console.log('Generating characters for workspace ID:', workspaceId);
    const generateResult = await generateCharacters(token, workspaceId);
    console.log('Generate result:', generateResult);

    if (generateResult.message !== 'Character generation completed. Characters are now available.') {
      throw new Error(`Character generation did not complete properly. Message: ${generateResult.message}`);
    }

    if (generateResult.characters_generated !== 3) {
      throw new Error(`Expected 3 characters to be generated, but got ${generateResult.characters_generated}`);
    }

    results.pass('Character generation completion');

    // Verify characters are retrievable
    const characters = await getCharacters(token, workspaceId);

    if (!characters.characters || characters.characters.length < 3) {
      throw new Error(`Expected at least 3 characters to be retrievable, but got ${characters.characters?.length || 0}`);
    }

    results.pass('Character retrieval verification');

    // Test character status validation
    const firstCharacter = characters.characters[0];
    if (!['pending', 'approved', 'discarded'].includes(firstCharacter.status)) {
      throw new Error('Character status is invalid');
    }

    results.pass('Character status validation');

    // Test character approval
    await updateCharacter(token, firstCharacter.id, 'approved');
    await updateCharacter(token, characters.characters[1].id, 'discarded');

    // Verify status updates
    const updatedCharacters = await getCharacters(token, workspaceId);
    const approvedChar = updatedCharacters.characters.find(c => c.id === firstCharacter.id);
    const discardedChar = updatedCharacters.characters.find(c => c.id === characters.characters[1].id);

    if (approvedChar.status !== 'approved') {
      throw new Error('Character approval failed');
    }
    if (discardedChar.status !== 'discarded') {
      throw new Error('Character discard failed');
    }

    results.pass('Character approval/discarding');

    console.log('✅ Character management test completed successfully');
    return results;

  } catch (error) {
    results.fail('Character management test', error.message);
    return results;
  }
}

// Export for use in main test runner
module.exports = { testCharacterManagement };

// Run standalone if called directly
if (require.main === module) {
  testCharacterManagement().then(results => {
    results.summary();
    process.exit(results.failed === 0 ? 0 : 1);
  });
}
