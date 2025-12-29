/**
 * Authentication Test
 * Tests user registration, login, and token validation
 */

const {
  TestResults,
  registerUser,
  loginUser,
  generateRandomEmail
} = require('./test_utils');

async function testUserRegistration() {
  const results = new TestResults();

  try {
    const email = generateRandomEmail();
    const password = 'testpassword123';

    console.log(`Testing user registration with email: ${email}`);

    // Test registration
    const registerResult = await registerUser(email, password);
    console.log('Registration result:', registerResult);

    if (!registerResult.userId) {
      throw new Error('Registration did not return userId');
    }

    results.pass('User registration');

    // Test login
    const token = await loginUser(email, password);
    console.log('Login token received:', token ? 'Yes' : 'No');

    if (!token || typeof token !== 'string') {
      throw new Error('Login did not return valid token');
    }

    results.pass('User login');

    console.log('✅ Authentication test completed successfully');
    return results;

  } catch (error) {
    results.fail('Authentication test', error.message);
    return results;
  }
}

// Export for use in main test runner
module.exports = { testUserRegistration };

// Run standalone if called directly
if (require.main === module) {
  testUserRegistration().then(results => {
    results.summary();
    process.exit(results.failed === 0 ? 0 : 1);
  });
}
