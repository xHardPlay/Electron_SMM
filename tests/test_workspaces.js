/**
 * Workspace Test
 * Tests workspace creation, retrieval, and management
 */

const {
  TestResults,
  registerUser,
  loginUser,
  createWorkspace,
  getWorkspaces,
  generateRandomEmail
} = require('./test_utils');

const BASE_URL = 'https://electron-backend.carlos-mdtz9.workers.dev';

async function testWorkspaceManagement() {
  const results = new TestResults();

  try {
    console.log('Testing workspace management...');

    // Create test user
    const email = generateRandomEmail();
    const password = 'testpassword123';

    await registerUser(email, password);
    const token = await loginUser(email, password);

    results.pass('User setup for workspace test');

    // Test workspace creation
    const workspaceName = `Test Workspace ${Date.now()}`;
    const createResult = await createWorkspace(token, workspaceName);

    if (!createResult.workspace || createResult.workspace.name !== workspaceName) {
      throw new Error('Workspace creation failed or returned incorrect data');
    }

    results.pass('Workspace creation');

    // Test workspace retrieval
    const workspaces = await getWorkspaces(token);

    if (!workspaces.workspaces || workspaces.workspaces.length === 0) {
      throw new Error('No workspaces returned');
    }

    const createdWorkspace = workspaces.workspaces.find(w => w.name === workspaceName);
    if (!createdWorkspace) {
      throw new Error('Created workspace not found in list');
    }

    results.pass('Workspace retrieval');

    // Test multiple workspace creation
    const workspaceName2 = `Test Workspace 2 ${Date.now()}`;
    await createWorkspace(token, workspaceName2);

    const workspacesAfter = await getWorkspaces(token);
    if (workspacesAfter.workspaces.length !== 2) {
      throw new Error('Second workspace creation failed');
    }

    results.pass('Multiple workspace creation');

    // Test workspace deletion
    const workspaceToDelete = workspacesAfter.workspaces.find(w => w.name === workspaceName2);
    if (!workspaceToDelete) {
      throw new Error('Workspace to delete not found');
    }

    const deleteResponse = await fetch(`${BASE_URL}/api/workspaces/${workspaceToDelete.id}`, {
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
    if (deleteResult.message !== 'Workspace and all associated data deleted successfully') {
      throw new Error('Unexpected delete response message');
    }

    results.pass('Workspace deletion');

    // Verify workspace is gone
    const workspacesAfterDelete = await getWorkspaces(token);
    if (workspacesAfterDelete.workspaces.length !== 1) {
      throw new Error('Workspace still exists after deletion');
    }

    const deletedWorkspaceStillExists = workspacesAfterDelete.workspaces.some(w => w.id === workspaceToDelete.id);
    if (deletedWorkspaceStillExists) {
      throw new Error('Deleted workspace still exists in list');
    }

    results.pass('Workspace deletion verification');

    // Test deleting non-existent workspace
    const nonexistentId = 999999;
    const deleteNonexistentResponse = await fetch(`${BASE_URL}/api/workspaces/${nonexistentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (deleteNonexistentResponse.status !== 404) {
      throw new Error(`Expected 404 for non-existent workspace, got ${deleteNonexistentResponse.status}`);
    }

    results.pass('Non-existent workspace deletion handling');

    console.log('✅ Workspace management test completed successfully');
    return results;

  } catch (error) {
    results.fail('Workspace management test', error.message);
    return results;
  }
}

// Export for use in main test runner
module.exports = { testWorkspaceManagement };

// Run standalone if called directly
if (require.main === module) {
  testWorkspaceManagement().then(results => {
    results.summary();
    process.exit(results.failed === 0 ? 0 : 1);
  });
}
