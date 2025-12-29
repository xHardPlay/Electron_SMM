/**
 * Electron Marketing Tool - Character Images Test
 * Tests character image upload and retrieval functionality
 */

const { TestResults, registerUser, loginUser, createWorkspace, generateCharacters, getCharacters, updateCharacter } = require('./test_utils');

const BASE_URL = 'https://electron-backend.carlos-mdtz9.workers.dev';

/**
 * Test character image functionality
 */
async function testCharacterImageManagement() {
  const results = new TestResults();

  try {
    console.log('Testing character image management...');

    // Setup: Register and login user
    const email = `test-${Date.now()}-${Math.random().toString(36).substring(7)}@electron.test`;
    const password = 'testpass123';

    await registerUser(email, password);
    results.pass('User setup for character image test');

    const token = await loginUser(email, password);
    results.pass('User authentication for character image test');

    // Create workspace
    const workspace = await createWorkspace(token, `Test Workspace ${Date.now()}`);
    const workspaceId = workspace.workspace.id;
    results.pass('Workspace creation for character image test');

    // Generate characters
    await generateCharacters(token, workspaceId);
    results.pass('Character generation for character image test');

    // Get characters and approve one
    const charactersResponse = await getCharacters(token, workspaceId);
    const characters = charactersResponse.characters;
    if (characters.length === 0) {
      throw new Error('No characters were generated');
    }

    // Approve the first character
    await updateCharacter(token, characters[0].id, 'approved');
    results.pass('Character approval for character image test');

    // Test image upload - create a small test image
    const testImageBlob = new Blob(['fake image data'], { type: 'image/png' });
    const testImageFile = new File([testImageBlob], 'test-image.png', { type: 'image/png' });

    const formData = new FormData();
    formData.append('workspace_id', workspaceId.toString());
    formData.append('character_id', characters[0].id.toString());
    formData.append('image', testImageFile);

    const uploadResponse = await fetch(`${BASE_URL}/api/character-images`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // Don't set Content-Type for FormData
      },
      body: formData
    });

    if (!uploadResponse.ok) {
      const error = await uploadResponse.text();
      throw new Error(`Upload failed: ${uploadResponse.status}: ${error}`);
    }

    const uploadResult = await uploadResponse.json();
    results.pass('Character image upload');

    // Test image retrieval
    const getImagesResponse = await fetch(`${BASE_URL}/api/character-images?workspace_id=${workspaceId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!getImagesResponse.ok) {
      const error = await getImagesResponse.text();
      throw new Error(`Get images failed: ${getImagesResponse.status}: ${error}`);
    }

    const getImagesResult = await getImagesResponse.json();
    if (!getImagesResult.images || getImagesResult.images.length === 0) {
      throw new Error('No images found after upload');
    }

    results.pass('Character image retrieval');

    // Test upload without character_id (general workspace image)
    const formData2 = new FormData();
    formData2.append('workspace_id', workspaceId.toString());
    formData2.append('image', testImageFile);

    const uploadResponse2 = await fetch(`${BASE_URL}/api/character-images`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData2
    });

    if (!uploadResponse2.ok) {
      const error = await uploadResponse2.text();
      throw new Error(`Upload without character_id failed: ${uploadResponse2.status}: ${error}`);
    }

    results.pass('Character image upload without character association');

    console.log('✅ Character image management test completed successfully');

  } catch (error) {
    results.fail('Character Image Management Test', error.message);
    console.error('Character image test error:', error);
  }

  return results;
}

module.exports = { testCharacterImageManagement };
