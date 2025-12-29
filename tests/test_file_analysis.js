/**
 * Electron Marketing Tool - File Analysis Test
 * Tests analysis creation with file uploads instead of URLs
 */

const { TestResults, registerUser, loginUser, createWorkspace, getAnalyses } = require('./test_utils');

const BASE_URL = 'https://electron-backend.carlos-mdtz9.workers.dev';

/**
 * Test file-based analysis functionality
 */
async function testFileAnalysis() {
  const results = new TestResults();

  try {
    console.log('Testing file-based analysis...');

    // Setup: Register and login user
    const email = `test-${Date.now()}-${Math.random().toString(36).substring(7)}@electron.test`;
    const password = 'testpass123';

    await registerUser(email, password);
    results.pass('User setup for file analysis test');

    const token = await loginUser(email, password);
    results.pass('User authentication for file analysis test');

    // Create workspace
    const workspace = await createWorkspace(token, `Test Workspace ${Date.now()}`);
    const workspaceId = workspace.workspace.id;
    results.pass('Workspace creation for file analysis test');

    // Create a test file with some content
    const testContent = `
# Sample Brand Document

## Company Overview
Our company specializes in innovative marketing solutions that help businesses grow.

## Mission Statement
To empower brands with data-driven insights and creative strategies.

## Target Audience
Small to medium businesses looking to improve their online presence.

## Key Products
- Digital Marketing Services
- Brand Strategy Consulting
- Content Creation
- Social Media Management

## Contact Information
Email: info@company.com
Phone: (555) 123-4567
Website: www.company.com
`;

    const testFileBlob = new Blob([testContent], { type: 'text/plain' });
    const testFile = new File([testFileBlob], 'brand-document.txt', { type: 'text/plain' });

    // Create analysis with file upload
    const formData = new FormData();
    formData.append('workspace_id', workspaceId.toString());
    formData.append('analysis_type', 'brand');
    formData.append('name', `File Analysis ${Date.now()}`);
    formData.append('file_0', testFile);

    const analysisResponse = await fetch(`${BASE_URL}/api/analyses`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // Don't set Content-Type for FormData
      },
      body: formData
    });

    if (!analysisResponse.ok) {
      const error = await analysisResponse.text();
      throw new Error(`Analysis creation failed: ${analysisResponse.status}: ${error}`);
    }

    const analysisResult = await analysisResponse.json();
    const analysisId = analysisResult.analysis.id;
    results.pass('File-based analysis creation');

    // Wait for analysis to complete
    console.log('Waiting for file analysis to complete...');
    let attempts = 0;
    const maxAttempts = 30;

    while (attempts < maxAttempts) {
      const analysesResponse = await getAnalyses(token, workspaceId);
      const analysis = analysesResponse.analyses.find(a => a.id === analysisId);

      if (analysis && analysis.status === 'completed') {
        results.pass('File analysis completion');
        break;
      } else if (analysis && analysis.status === 'failed') {
        throw new Error('File analysis failed');
      }

      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
      attempts++;
    }

    if (attempts >= maxAttempts) {
      throw new Error('File analysis timed out');
    }

    // Verify analysis content
    const finalAnalyses = await getAnalyses(token, workspaceId);
    const completedAnalysis = finalAnalyses.analyses.find(a => a.id === analysisId);

    if (!completedAnalysis.ai_analysis) {
      throw new Error('Analysis completed but no AI analysis content found');
    }

    if (completedAnalysis.ai_analysis.includes('AI analysis failed')) {
      throw new Error('AI analysis failed to process file content');
    }

    results.pass('File analysis content validation');

    // Test with multiple files
    const testFile2Blob = new Blob(['Additional brand information and marketing strategies.'], { type: 'text/plain' });
    const testFile2 = new File([testFile2Blob], 'additional-info.txt', { type: 'text/plain' });

    const formData2 = new FormData();
    formData2.append('workspace_id', workspaceId.toString());
    formData2.append('analysis_type', 'brand');
    formData2.append('name', `Multi-File Analysis ${Date.now()}`);
    formData2.append('file_0', testFile);
    formData2.append('file_1', testFile2);

    const multiFileResponse = await fetch(`${BASE_URL}/api/analyses`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData2
    });

    if (!multiFileResponse.ok) {
      const error = await multiFileResponse.text();
      throw new Error(`Multi-file analysis creation failed: ${multiFileResponse.status}: ${error}`);
    }

    results.pass('Multi-file analysis creation');

    // Test with unsupported file type (should still work with text extraction)
    const binaryContent = new Uint8Array([0xFF, 0xFE, 0x00, 0x00]); // Fake binary data
    const binaryFileBlob = new Blob([binaryContent], { type: 'application/octet-stream' });
    const binaryFile = new File([binaryFileBlob], 'binary-file.dat', { type: 'application/octet-stream' });

    const formData3 = new FormData();
    formData3.append('workspace_id', workspaceId.toString());
    formData3.append('analysis_type', 'brand');
    formData3.append('name', `Binary File Analysis ${Date.now()}`);
    formData3.append('file_0', binaryFile);

    const binaryFileResponse = await fetch(`${BASE_URL}/api/analyses`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData3
    });

    if (!binaryFileResponse.ok) {
      const error = await binaryFileResponse.text();
      throw new Error(`Binary file analysis creation failed: ${binaryFileResponse.status}: ${error}`);
    }

    results.pass('Binary file analysis creation');

    console.log('✅ File analysis test completed successfully');

  } catch (error) {
    results.fail('File Analysis Test', error.message);
    console.error('File analysis test error:', error);
  }

  return results;
}

module.exports = { testFileAnalysis };
