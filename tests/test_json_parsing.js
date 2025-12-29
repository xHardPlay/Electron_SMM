// Pure JavaScript implementation for testing (no React dependencies)
console.log('🧪 Starting JSON Parsing Tests...\n');

// Test data that mimics AI responses
const testCases = [
  {
    name: 'Perfect JSON',
    input: JSON.stringify({
      brand_profile: {
        brand_identity: {
          business_overview: 'Test overview',
          core_identity: 'Test identity'
        }
      }
    }),
    expected: 'should parse correctly'
  },

  {
    name: 'Markdown wrapped JSON (common AI format)',
    input: `Based on the provided content, here is the comprehensive brand profile in JSON format:

\`\`\`json
{
  "brand_name": "Test Brand",
  "brand_profile": {
    "brand_identity": {
      "business_overview": "Test business overview with detailed information about the company and its operations.",
      "core_identity": "Test core identity describing the fundamental values and mission.",
      "market_positioning": "Test market positioning explaining competitive advantages.",
      "competitive_landscape": ["Competitor A", "Competitor B", "Competitor C"],
      "customer_profile": "Test customer profile describing target audience.",
      "emotional_benefits": "Test emotional benefits that customers receive.",
      "brand_story": "Test brand story explaining company history.",
      "brand_personality": "Test brand personality traits."
    },
    "brand_strategy": {
      "most_popular_products_services": "Test popular products and services.",
      "top_revenue_drivers": "Test revenue drivers analysis.",
      "emerging_growth_areas": "Test emerging growth opportunities.",
      "why_customers_choose": "Test reasons customers choose this brand.",
      "primary_value_drivers": "Test primary value propositions."
    },
    "products_services": "Test products and services offered.",
    "areas_served": "Test geographic areas served.",
    "brand_voice_guide": {
      "purpose": "Test communication purpose.",
      "audience": "Test target audience for messaging.",
      "tone": "Test communication tone.",
      "emotional_tone": "Test emotional tone used.",
      "character": "Test brand character.",
      "syntax": "Test writing syntax preferences.",
      "language_choices": "Test language choice guidelines.",
      "words_to_use": ["innovative", "reliable", "expert"],
      "words_to_avoid": ["cheap", "basic", "low-quality"]
    },
    "social_media_content_mix": {
      "value_education": "40 percent",
      "connection_story": "30 percent",
      "proof_authority": "20 percent",
      "direct_promotion": "10 percent"
    },
    "additional_notes": "Test additional recommendations and insights."
  }
}
\`\`\`

This analysis provides comprehensive insights for brand development and marketing strategy.`,
    expected: 'should extract and parse JSON from markdown'
  },

  {
    name: 'Malformed JSON with single quotes',
    input: `{
      'brand_name': 'Test Brand',
      'brand_profile': {
        'brand_identity': {
          'business_overview': 'Test overview'
        }
      }
    }`,
    expected: 'should fix single quotes and parse'
  },

  {
    name: 'Truncated JSON (simulating the issue)',
    input: `Based on the provided content, here is the comprehensive brand profile in JSON format:

\`\`\`json
{
  "brand_name": "Clear Future Consulting Services",
  "brand_profile": {
    "brand_identity": {
      "business_overview": "Clear Future Consulting Services is a professional consulting firm that specializes in providing strategic guidance and support to businesses, organizations, and individuals. Our team of experts helps clients navigate complex challenges and achieve their goals through evidence-based solutions and innovative thinking.",
      "core_identity": "Clear Future Consulting Services is a values-driven organization that prioritizes integrity, expertise, and collaboration. We are committed to delivering high-quality services that meet the unique needs of each client, while fostering a culture of continuous learning and improvement.",
      "market_positioning": "Clear Future Consulting Services is a boutique consulting firm that offers specialized services in strategy development, organizational design, and change management. We differentiate ourselves through our expertise in data-driven decision making, creative problem-solving, and empathetic client relationships.",
      "competitive_landscape": [
        "McKinsey & Company",
        "Boston Consulting Group",
        "Bain & Company",
        "Deloitte Consulting",
        "Accenture Strategy"
      ],
      "customer_profile": "Our clients are forward-thinking organizations and leaders who recognize the value of strategic consulting in today's complex business environment. They include Fortune 500 companies, growing mid-market firms, non-profit organizations, and government agencies that are committed to excellence and innovation. These clients seek partners who can provide not just expertise, but also genuine collaboration and long-term value creation.`,
    expected: 'should handle truncated JSON gracefully'
  },

  {
    name: 'JSON with unterminated strings',
    input: `{
      "brand_profile": {
        "brand_identity": {
          "business_overview": "This string appears to be cut off mid-sentence
        }
      }
    }`,
    expected: 'should attempt to fix unterminated strings'
  }
];

// Mock functions for testing (since we're testing outside React)
function parseAnalysisJSON(text) {
  console.log(`🔍 Testing input (${text.length} chars):`, text.substring(0, 200) + (text.length > 200 ? '...' : ''));

  try {
    // First attempt: direct JSON parse
    console.log('  📋 Attempt 1: Direct JSON parse');
    const parsed = JSON.parse(text);
    if (parsed.brand_profile) {
      console.log('  ✅ Direct parse successful');
      return parsed.brand_profile;
    }
    console.log('  ⚠️  Direct parse: no brand_profile found');
    return null;
  } catch (error) {
    console.log('  ❌ Direct parse failed:', error.message);

    // Second attempt: try to extract JSON from markdown code blocks (most common AI format)
    try {
      console.log('  📋 Attempt 2: Markdown extraction');
      // Look for JSON in markdown code blocks first
      const markdownJsonMatch = text.match(/```(?:json)?\s*\n?(\{[\s\S]*?\})\s*\n?```/);
      if (markdownJsonMatch && markdownJsonMatch[1]) {
        console.log('  🎯 Found JSON in markdown code block');
        const extractedJson = fixMalformedJSON(markdownJsonMatch[1]);
        console.log('  🔧 Fixed extracted JSON, attempting parse...');
        const parsed = JSON.parse(extractedJson);
        if (parsed.brand_profile) {
          console.log('  ✅ Markdown extraction successful');
          return parsed.brand_profile;
        }
      } else {
        console.log('  ⚠️  No markdown code blocks found');
      }
    } catch (fixError) {
      console.log('  ❌ Markdown extraction failed:', fixError.message);
    }

    console.log('  🚫 All parsing attempts failed');
    return null;
  }
}

function fixMalformedJSON(jsonString) {
  let fixed = jsonString.trim();

  // Fix single quotes to double quotes for property names and string values
  fixed = fixed.replace(/'([^']*)'/g, '"$1"');
  fixed = fixed.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');

  // Fix unterminated strings by finding quotes that aren't closed
  const lines = fixed.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const quoteCount = (line.match(/"/g) || []).length;
    if (quoteCount % 2 !== 0) { // Odd number of quotes = unterminated string
      console.log(`  🔧 Fixing unterminated string on line ${i + 1}`);
      // Find the last quote and add closing quote at end of line
      const lastQuoteIndex = line.lastIndexOf('"');
      if (lastQuoteIndex !== -1) {
        const beforeQuote = line.substring(0, lastQuoteIndex + 1);
        const afterQuote = line.substring(lastQuoteIndex + 1);
        // If there's content after the quote without a closing quote, add it
        if (afterQuote.trim() && !afterQuote.includes('"')) {
          lines[i] = beforeQuote + afterQuote + '"';
        }
      }
    }
  }
  fixed = lines.join('\n');

  // Fix trailing commas
  fixed = fixed.replace(/,(\s*[}\]])/g, '$1');

  // Fix missing commas between properties
  fixed = fixed.replace(/}(\s*"[^"]*"\s*:)/g, '},$1');
  fixed = fixed.replace(/](\s*"[^"]*"\s*:)/g, '],$1');

  // Fix escaped quotes that might be causing issues
  fixed = fixed.replace(/\\"/g, '"');

  // Remove any extra quotes that might have been added incorrectly
  fixed = fixed.replace(/""/g, '"');

  // Ensure proper JSON structure
  if (!fixed.trim().startsWith('{')) {
    fixed = '{' + fixed;
  }
  if (!fixed.trim().endsWith('}')) {
    fixed = fixed + '}';
  }

  // Final cleanup: remove any remaining syntax errors
  try {
    JSON.parse(fixed); // Test if it's valid now
    console.log('  ✅ JSON validation passed after fixes');
    return fixed;
  } catch (finalError) {
    console.log('  ⚠️  JSON validation failed after fixes:', finalError.message);
    // Last resort: try to extract the most complete JSON object
    const jsonMatch = fixed.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/);
    if (jsonMatch) {
      console.log('  🎯 Extracting partial JSON as fallback');
      return jsonMatch[0];
    }
    return fixed;
  }
}

// Run tests
console.log('='.repeat(60));
console.log('🧪 JSON PARSING UNIT TESTS');
console.log('='.repeat(60));

let passedTests = 0;
let totalTests = testCases.length;

testCases.forEach((testCase, index) => {
  console.log(`\n📋 Test ${index + 1}: ${testCase.name}`);
  console.log('-'.repeat(40));

  const result = parseAnalysisJSON(testCase.input);

  if (result) {
    console.log('✅ PASSED: Successfully parsed JSON');
    console.log('📊 Parsed brand_profile keys:', Object.keys(result));

    // Check for truncation issues
    const jsonString = JSON.stringify(result);
    if (jsonString.length < 1000) {
      console.log('⚠️  WARNING: Parsed JSON is very short, might be truncated');
    }

    passedTests++;
  } else {
    console.log('❌ FAILED: Could not parse JSON');
    console.log('📄 Raw input preview:', testCase.input.substring(0, 300) + '...');
  }

  console.log('Expected:', testCase.expected);
});

console.log('\n' + '='.repeat(60));
console.log(`📊 TEST RESULTS: ${passedTests}/${totalTests} tests passed`);
console.log('='.repeat(60));

// Additional debugging for the specific truncation issue
console.log('\n🔍 DEBUGGING TRUNCATION ISSUE');
console.log('-'.repeat(30));

const truncatedExample = `Based on the provided content, here is the comprehensive brand profile in JSON format:

\`\`\`json
{
  "brand_name": "Clear Future Consulting Services",
  "brand_profile": {
    "brand_identity": {
      "business_overview": "Clear Future Consulting Services is a professional consulting firm that specializes in providing strategic guidance and support to businesses, organizations, and individuals. Our team of experts helps clients navigate complex challenges and achieve their goals through evidence-based solutions and innovative thinking.",
      "core_identity": "Clear Future Consulting Services is a values-driven organization that prioritizes integrity, expertise, and collaboration. We are committed to delivering high-quality services that meet the unique needs of each client, while fostering a culture of continuous learning and improvement.",
      "market_positioning": "Clear Future Consulting Services is a boutique consulting firm that offers specialized services in strategy development, organizational design, and change management. We differentiate ourselves through our expertise in data-driven decision making, creative problem-solving, and empathetic client relationships.",
      "competitive_landscape": [
        "McKinsey & Company",
        "Boston Consulting Group",
        "Bain & Company",
        "Deloitte Consulting",
        "Accenture Strategy"
      ],
      "customer_profile": "Our clients are forward-thinking organizations`;

console.log('Testing truncated example...');
const truncatedResult = parseAnalysisJSON(truncatedExample);

if (truncatedResult) {
  console.log('✅ Truncated JSON was parsed successfully');
  const resultString = JSON.stringify(truncatedResult, null, 2);
  console.log('📏 Result length:', resultString.length);
  console.log('🎯 Has brand_identity:', !!truncatedResult.brand_identity);
  console.log('🎯 Has competitive_landscape:', !!truncatedResult.brand_identity?.competitive_landscape);
  console.log('🎯 Customer profile ends with:', truncatedResult.brand_identity?.customer_profile?.slice(-50));
} else {
  console.log('❌ Truncated JSON parsing failed');
}

console.log('\n🧪 JSON parsing tests completed!');
console.log('💡 Check the logs above to identify the truncation issue and fix the parsing logic.');
