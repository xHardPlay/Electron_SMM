#!/usr/bin/env node

/**
 * Electron Marketing Tool - Test Runner
 * Orchestrates and runs all individual test suites
 */

const { TestResults } = require('./test_utils');

// Import all test modules
const { testUserRegistration } = require('./test_auth');
const { testWorkspaceManagement } = require('./test_workspaces');
const { testBrandAnalysis } = require('./test_brand_analysis');
const { testCharacterManagement } = require('./test_characters');
const { testAdGeneration } = require('./test_ads');
const { testCharacterImageManagement } = require('./test_character_images');
const { testAnalysisDeletion } = require('./test_analysis_deletion');
const { testFileAnalysis } = require('./test_file_analysis');
const { testHealthEndpoint } = require('./test_health');

/**
 * Test suite configuration
 */
const TEST_SUITES = [
  {
    name: 'Authentication Tests',
    description: 'User registration and login functionality',
    testFunction: testUserRegistration,
    timeout: 30000, // 30 seconds
  },
  {
    name: 'Workspace Tests',
    description: 'Workspace creation and management',
    testFunction: testWorkspaceManagement,
    timeout: 30000,
  },
  {
    name: 'Brand Analysis Tests',
    description: 'URL analysis and AI processing',
    testFunction: testBrandAnalysis,
    timeout: 120000, // 2 minutes for AI processing
  },
  {
    name: 'Character Tests',
    description: 'AI character generation and management',
    testFunction: testCharacterManagement,
    timeout: 60000, // 1 minute
  },
  {
    name: 'Ad Generation Tests',
    description: 'AI-powered ad creation',
    testFunction: testAdGeneration,
    timeout: 120000, // 2 minutes for AI processing
  },
  {
    name: 'Character Image Tests',
    description: 'Character image upload and retrieval',
    testFunction: testCharacterImageManagement,
    timeout: 30000,
  },
  {
    name: 'Analysis Deletion Tests',
    description: 'Analysis deletion functionality',
    testFunction: testAnalysisDeletion,
    timeout: 120000, // 2 minutes for AI processing
  },
  {
    name: 'File Analysis Tests',
    description: 'File upload analysis functionality',
    testFunction: testFileAnalysis,
    timeout: 180000, // 3 minutes for AI processing
  },
  {
    name: 'Health Endpoint Tests',
    description: 'Basic health check and CORS functionality',
    testFunction: testHealthEndpoint,
    timeout: 10000, // 10 seconds
  },
];

/**
 * Run all test suites
 */
async function runAllTests() {
  console.log('🚀 Electron Marketing Tool - Test Suite');
  console.log('=' .repeat(50));

  const overallResults = new TestResults();
  let suiteIndex = 1;

  for (const suite of TEST_SUITES) {
    console.log(`\n📋 Running Test Suite ${suiteIndex}/${TEST_SUITES.length}`);
    console.log(`Suite: ${suite.name}`);
    console.log(`Description: ${suite.description}`);
    console.log('-'.repeat(40));

    try {
      // Run test with timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`Test suite timed out after ${suite.timeout}ms`)), suite.timeout);
      });

      const testPromise = suite.testFunction();
      const suiteResults = await Promise.race([testPromise, timeoutPromise]);

      // Aggregate results
      overallResults.passed += suiteResults.passed;
      overallResults.failed += suiteResults.failed;
      overallResults.errors.push(...suiteResults.errors);

    } catch (error) {
      overallResults.fail(suite.name, error.message);
    }

    suiteIndex++;
  }

  // Final summary
  console.log('\n🎯 FINAL TEST RESULTS');
  console.log('='.repeat(50));
  const success = overallResults.summary();

  if (success) {
    console.log('\n🎉 All tests passed! The system is working correctly.');
  } else {
    console.log('\n❌ Some tests failed. Please check the errors above.');
  }

  return success;
}

/**
 * Run specific test suite
 */
async function runSpecificTest(suiteName) {
  const suite = TEST_SUITES.find(s => s.name.toLowerCase().includes(suiteName.toLowerCase()));

  if (!suite) {
    console.error(`❌ Test suite "${suiteName}" not found.`);
    console.log('\nAvailable test suites:');
    TEST_SUITES.forEach(s => console.log(`  - ${s.name}`));
    process.exit(1);
  }

  console.log(`🎯 Running specific test suite: ${suite.name}`);
  console.log(`Description: ${suite.description}`);
  console.log('-'.repeat(40));

  try {
    const results = await suite.testFunction();
    const success = results.summary();
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error(`❌ Test suite failed: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Display help information
 */
function showHelp() {
  console.log('Electron Marketing Tool - Test Runner');
  console.log('='.repeat(40));
  console.log('');
  console.log('Usage:');
  console.log('  node test_runner.js              # Run all tests');
  console.log('  node test_runner.js <suite>      # Run specific test suite');
  console.log('  node test_runner.js --help       # Show this help');
  console.log('');
  console.log('Available test suites:');
  TEST_SUITES.forEach(suite => {
    console.log(`  ${suite.name.toLowerCase().replace(/\s+/g, '_')}: ${suite.description}`);
  });
  console.log('');
  console.log('Examples:');
  console.log('  node test_runner.js auth         # Run authentication tests');
  console.log('  node test_runner.js workspace    # Run workspace tests');
  console.log('  node test_runner.js analysis     # Run brand analysis tests');
}

/**
 * Main entry point
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    // Run all tests
    const success = await runAllTests();
    process.exit(success ? 0 : 1);

  } else if (args[0] === '--help' || args[0] === '-h') {
    // Show help
    showHelp();

  } else {
    // Run specific test suite
    await runSpecificTest(args[0]);
  }
}

// Handle process signals for clean shutdown
process.on('SIGINT', () => {
  console.log('\n⚠️  Test runner interrupted. Exiting...');
  process.exit(130);
});

process.on('SIGTERM', () => {
  console.log('\n⚠️  Test runner terminated. Exiting...');
  process.exit(143);
});

// Run the test runner
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Fatal error in test runner:', error);
    process.exit(1);
  });
}

module.exports = { runAllTests, runSpecificTest, TEST_SUITES };
