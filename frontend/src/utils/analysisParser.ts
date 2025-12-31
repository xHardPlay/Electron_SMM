/**
 * Utility functions for parsing and fixing AI analysis responses
 */

export interface BrandProfile {
  brand_name: string
  brand_identity: {
    business_overview?: string
    core_identity?: string
    market_positioning?: string
    customer_profile?: string
    competitive_landscape?: string[]
    brand_story?: string
    brand_personality?: string
    emotional_benefits?: string
    [key: string]: any
  }
  brand_strategy: {
    most_popular_products_services?: string
    top_revenue_drivers?: string
    emerging_growth_areas?: string
    why_customers_choose?: string
    primary_value_drivers?: string
    [key: string]: any
  }
  brand_voice_guide: {
    purpose?: string
    audience?: string
    tone?: string
    emotional_tone?: string
    character?: string
    syntax?: string
    language_choices?: string
    words_to_use?: string[]
    words_to_avoid?: string[]
    [key: string]: any
  }
  social_media_content_mix: {
    value_education?: string
    connection_story?: string
    proof_authority?: string
    direct_promotion?: string
    [key: string]: any
  }
  brand_contacts?: any[]
  products_services?: string
  areas_served?: string
  additional_notes?: string
  [key: string]: any
}

/**
 * Parse and fix the AI analysis JSON response
 */
export const parseAnalysisJSON = (text: string): BrandProfile | null => {
  console.log('🔍 PARSING ANALYSIS JSON - Starting parse process')
  console.log('  Raw text length:', text.length)

  try {
    // First attempt: direct JSON parse
    console.log('📋 ATTEMPT 1: Direct JSON parse')
    const parsed = JSON.parse(text)
    if (parsed.brand_profile) {
      console.log('✅ SUCCESS: Direct JSON parse worked!')
      return parsed.brand_profile
    }
    console.log('⚠️  Direct parse succeeded but no brand_profile found')
    return null
  } catch (error) {
    console.error('❌ ATTEMPT 1 FAILED: Direct JSON parse error:', error)

    // Second attempt: try to extract JSON from markdown code blocks
    console.log('📋 ATTEMPT 2: Markdown code block extraction')
    try {
      const markdownJsonMatch = text.match(/```(?:json)?\s*\n?(\{[\s\S]*?\})\s*\n?```/)
      if (markdownJsonMatch && markdownJsonMatch[1]) {
        console.log('  Found JSON in markdown code block, attempting to parse...')
        const extractedJson = fixMalformedJSON(markdownJsonMatch[1])
        const parsed = JSON.parse(extractedJson)
        if (parsed.brand_profile) {
          console.log('✅ SUCCESS: Parsed JSON from markdown!')
          return parsed.brand_profile
        }
        console.log('⚠️  Markdown extraction succeeded but no brand_profile found')
      } else {
        console.log('  No markdown code blocks found')
      }
    } catch (fixError) {
      console.error('❌ ATTEMPT 2 FAILED: Markdown extraction error:', fixError)
    }

    console.error('💥 ALL PARSING ATTEMPTS FAILED - Showing raw response as fallback')
    return null
  }
}

/**
 * Parse Markdown response and convert to brand profile JSON structure
 */
export const parseMarkdownToBrandProfile = (markdown: string): BrandProfile | null => {
  console.log('Parsing Markdown response to extract brand profile data')

  try {
    const profile: BrandProfile = {
      brand_name: '',
      brand_identity: {},
      brand_strategy: {},
      brand_voice_guide: {},
      social_media_content_mix: {}
    }

    // Extract brand name from title
    const titleMatch = markdown.match(/\*\*Brand Analysis:\s*([^*]+)\*\*/)
    if (titleMatch) {
      profile.brand_name = titleMatch[1].trim()
      console.log('Extracted brand name:', profile.brand_name)
    }

    // Extract sections using regex patterns
    const sections = markdown.split(/\*\*([^*]+)\*\*/).filter(s => s.trim())

    for (let i = 0; i < sections.length - 1; i += 2) {
      const sectionName = sections[i].trim()
      const sectionContent = sections[i + 1].trim()
      console.log(`Processing section: ${sectionName}`)

      switch (sectionName.toLowerCase()) {
        case 'overview':
          profile.brand_identity.business_overview = sectionContent
          break
        case 'brand identity':
          const identityItems = sectionContent.split(/\*\s*\*\*([^*]+):\*\*/).filter(s => s.trim())
          for (let j = 0; j < identityItems.length - 1; j += 2) {
            const itemName = identityItems[j].trim().toLowerCase().replace(/\s+/g, '_')
            const itemContent = identityItems[j + 1].trim()
            profile.brand_identity[itemName] = itemContent
          }
          break
        case 'target audience':
          const audienceItems = sectionContent.split(/\*\s*\*\*([^*]+):\*\*/).filter(s => s.trim())
          for (let j = 0; j < audienceItems.length - 1; j += 2) {
            const itemName = audienceItems[j].trim().toLowerCase().replace(/\s+/g, '_')
            const itemContent = audienceItems[j + 1].trim()
            profile.brand_identity[itemName] = itemContent
          }
          break
        case 'messaging':
          profile.messaging = sectionContent
          break
        default:
          console.log(`Unknown section: ${sectionName}`)
      }
    }

    // Set some defaults for required fields if missing
    if (!profile.brand_identity.competitive_landscape) {
      profile.brand_identity.competitive_landscape = []
    }
    if (!profile.brand_voice_guide.words_to_use) {
      profile.brand_voice_guide.words_to_use = []
    }

    console.log('Successfully parsed Markdown to profile:', profile)
    return profile

  } catch (error) {
    console.error('Error parsing Markdown to brand profile:', error)
    return null
  }
}

/**
 * Fix common JSON formatting issues
 */
export const fixMalformedJSON = (jsonString: string): string => {
  let fixed = jsonString.trim()

  // Fix single quotes to double quotes for property names and string values
  fixed = fixed.replace(/'([^']*)'/g, '"$1"')
  fixed = fixed.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')

  // Fix unterminated strings by finding quotes that aren't closed
  const lines = fixed.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const quoteCount = (line.match(/"/g) || []).length
    if (quoteCount % 2 !== 0) { // Odd number of quotes = unterminated string
      const lastQuoteIndex = line.lastIndexOf('"')
      if (lastQuoteIndex !== -1) {
        const beforeQuote = line.substring(0, lastQuoteIndex + 1)
        const afterQuote = line.substring(lastQuoteIndex + 1)
        if (afterQuote.trim() && !afterQuote.includes('"')) {
          lines[i] = beforeQuote + afterQuote + '"'
        }
      }
    }
  }
  fixed = lines.join('\n')

  // Fix trailing commas
  fixed = fixed.replace(/,(\s*[}\]])/g, '$1')

  // Fix missing commas between properties
  fixed = fixed.replace(/}(\s*"[^"]*"\s*:)/g, '},$1')
  fixed = fixed.replace(/](\s*"[^"]*"\s*:)/g, '],$1')

  // Fix escaped quotes that might be causing issues
  fixed = fixed.replace(/\\"/g, '"')

  // Remove any extra quotes that might have been added incorrectly
  fixed = fixed.replace(/""/g, '"')

  // Ensure proper JSON structure
  if (!fixed.trim().startsWith('{')) {
    fixed = '{' + fixed
  }
  if (!fixed.trim().endsWith('}')) {
    fixed = fixed + '}'
  }

  // Final cleanup: remove any remaining syntax errors
  try {
    JSON.parse(fixed) // Test if it's valid now
    return fixed
  } catch (finalError) {
    console.error('Final JSON fix attempt failed:', finalError)
    const jsonMatch = fixed.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/)
    if (jsonMatch) {
      return jsonMatch[0]
    }
    return fixed
  }
}
