'use client'

interface Analysis {
  id: number
  name: string
  analysis_type: string
  urls: string[]
  file_names: string[]
  ai_analysis: string
  structured_data?: any
  status: string
  created_at: string
}

interface AnalysisResultCardProps {
  analysis: Analysis
  onDelete: (analysisId: string) => Promise<void>
}

export default function AnalysisResultCard({ analysis, onDelete }: AnalysisResultCardProps) {
  // Parse and fix the AI analysis JSON response
  const parseAnalysisJSON = (text: string) => {
    try {
      // First attempt: direct JSON parse
      const parsed = JSON.parse(text)
      if (parsed.brand_profile) {
        return parsed.brand_profile
      }
      return null
    } catch (error) {
      console.error('Error parsing analysis JSON:', error)

      // Second attempt: try to extract JSON from markdown code blocks or mixed content
      try {
        // Look for JSON in markdown code blocks first
        const markdownJsonMatch = text.match(/```(?:json)?\s*\n?(\{[\s\S]*?\})\s*\n?```/)
        if (markdownJsonMatch && markdownJsonMatch[1]) {
          console.log('Found JSON in markdown code block, attempting to parse...')
          const extractedJson = fixMalformedJSON(markdownJsonMatch[1])
          const parsed = JSON.parse(extractedJson)
          if (parsed.brand_profile) {
            console.log('Successfully parsed JSON from markdown!')
            return parsed.brand_profile
          }
        }

        // Third attempt: try to fix common JSON issues on the whole text
        const fixedText = fixMalformedJSON(text)
        if (fixedText !== text) {
          console.log('Attempting to fix malformed JSON...')
          const parsed = JSON.parse(fixedText)
          if (parsed.brand_profile) {
            console.log('Successfully fixed and parsed JSON!')
            return parsed.brand_profile
          }
        }
      } catch (fixError) {
        console.error('Failed to fix JSON:', fixError)
      }

      // Fourth attempt: try to extract JSON from mixed content (fallback)
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const extractedJson = fixMalformedJSON(jsonMatch[0])
          const parsed = JSON.parse(extractedJson)
          if (parsed.brand_profile) {
            console.log('Successfully extracted and parsed JSON!')
            return parsed.brand_profile
          }
        }
      } catch (extractError) {
        console.error('Failed to extract JSON:', extractError)
      }

      return null
    }
  }

  // Fix common JSON formatting issues
  const fixMalformedJSON = (jsonString: string): string => {
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
        // Find the last quote and add closing quote at end of line
        const lastQuoteIndex = line.lastIndexOf('"')
        if (lastQuoteIndex !== -1) {
          const beforeQuote = line.substring(0, lastQuoteIndex + 1)
          const afterQuote = line.substring(lastQuoteIndex + 1)
          // If there's content after the quote without a closing quote, add it
          if (afterQuote.trim() && !afterQuote.includes('"')) {
            lines[i] = beforeQuote + afterQuote + '"'
          }
        }
      }
    }
    fixed = lines.join('\n')

    // Fix trailing commas
    fixed = fixed.replace(/,(\s*[}\]])/g, '$1')

    // Fix missing commas between properties (look for } followed by " without comma)
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
      // Last resort: try to extract the most complete JSON object
      const jsonMatch = fixed.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/)
      if (jsonMatch) {
        return jsonMatch[0]
      }
      return fixed
    }
  }

  const brandProfile = analysis.ai_analysis ? parseAnalysisJSON(analysis.ai_analysis) : null

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{analysis.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                analysis.analysis_type === 'brand'
                  ? 'bg-blue-100 text-blue-800'
                  : analysis.analysis_type === 'product'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {analysis.analysis_type === 'brand' ? '🏷️ Brand' :
                 analysis.analysis_type === 'product' ? '📦 Product' : '📄 Analysis'}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                analysis.status === 'completed' ? 'bg-green-100 text-green-800' :
                analysis.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {analysis.status === 'completed' ? '✅ Complete' :
                 analysis.status === 'processing' ? '⚡ Processing' : '❌ Failed'}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right flex flex-col items-end gap-2">
          <button
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete the analysis "${analysis.name}"? This action cannot be undone.`)) {
                onDelete(analysis.id.toString());
              }
            }}
            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-md transition-colors duration-200 flex items-center gap-1"
            title="Delete this analysis"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
          <div>
            <p className="text-sm text-gray-500">
              {new Date(analysis.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(analysis.created_at).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Sources */}
      {(analysis.urls.length > 0 || analysis.file_names.length > 0) && (
        <div className="mb-4 p-3 bg-white/60 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Analysis Sources
          </h4>
          <div className="flex flex-wrap gap-2">
            {analysis.urls.map((url, index) => (
              <span key={`url-${index}`} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                {url.length > 30 ? `${url.substring(0, 30)}...` : url}
              </span>
            ))}
            {analysis.file_names.map((fileName, index) => (
              <span key={`file-${index}`} className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs rounded-md">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {fileName}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Analysis Content */}
      {analysis.ai_analysis && analysis.status === 'completed' ? (
        <div className="space-y-8">
          {brandProfile ? (
            <>
              {/* Executive Summary - Key Highlights */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Brand Analysis Complete</h3>
                    <p className="text-blue-100">Comprehensive brand intelligence for {brandProfile.brand_name || analysis.name}</p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold">{brandProfile.brand_identity?.competitive_landscape?.length || 0}</div>
                    <div className="text-sm text-blue-100">Competitors Identified</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold">{brandProfile.brand_voice_guide?.words_to_use?.length || 0}</div>
                    <div className="text-sm text-blue-100">Brand Words</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold">4</div>
                    <div className="text-sm text-blue-100">Content Pillars</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold">100%</div>
                    <div className="text-sm text-blue-100">Complete Analysis</div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Fallback: Display Raw AI Response when JSON parsing fails */
            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Analysis Results</h3>
                  <p className="text-orange-100">Raw AI response (JSON parsing failed - showing complete analysis)</p>
                </div>
              </div>
            </div>
          )}

          {/* Show structured content if JSON parsed successfully, otherwise show raw response */}
          {brandProfile ? (
            <>

              {/* Brand Identity Section */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Brand Identity</h3>
                      <p className="text-blue-100 text-sm">Core foundation and market positioning</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {brandProfile.brand_identity?.business_overview && (
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                          <h4 className="font-bold text-blue-900">Business Overview</h4>
                        </div>
                        <p className="text-blue-800 leading-relaxed">{brandProfile.brand_identity.business_overview}</p>
                      </div>
                    )}

                    {brandProfile.brand_identity?.core_identity && (
                      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 border border-indigo-200">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </div>
                          <h4 className="font-bold text-indigo-900">Core Identity</h4>
                        </div>
                        <p className="text-indigo-800 leading-relaxed">{brandProfile.brand_identity.core_identity}</p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {brandProfile.brand_identity?.market_positioning && (
                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h4 className="font-bold text-green-900">Market Positioning</h4>
                        </div>
                        <p className="text-green-800 leading-relaxed">{brandProfile.brand_identity.market_positioning}</p>
                      </div>
                    )}

                    {brandProfile.brand_identity?.customer_profile && (
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                          </div>
                          <h4 className="font-bold text-purple-900">Customer Profile</h4>
                        </div>
                        <p className="text-purple-800 leading-relaxed">{brandProfile.brand_identity.customer_profile}</p>
                      </div>
                    )}
                  </div>

                  {/* Competitive Landscape */}
                  {brandProfile.brand_identity?.competitive_landscape && (
                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <h4 className="font-bold text-red-900">Competitive Landscape</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {brandProfile.brand_identity.competitive_landscape.map((competitor: string, index: number) => (
                          <div key={index} className="bg-white rounded-lg p-3 shadow-sm border border-red-200">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-bold text-red-600">{index + 1}</span>
                              </div>
                              <span className="text-sm font-medium text-red-800">{competitor}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Brand Story & Personality */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {brandProfile.brand_identity?.brand_story && (
                      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                          <h4 className="font-bold text-yellow-900">Brand Story</h4>
                        </div>
                        <p className="text-yellow-800 leading-relaxed text-sm">{brandProfile.brand_identity.brand_story}</p>
                      </div>
                    )}

                    {brandProfile.brand_identity?.brand_personality && (
                      <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4 border border-pink-200">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h4 className="font-bold text-pink-900">Brand Personality</h4>
                        </div>
                        <p className="text-pink-800 leading-relaxed text-sm">{brandProfile.brand_identity.brand_personality}</p>
                      </div>
                    )}
                  </div>

                  {/* Emotional Benefits */}
                  {brandProfile.brand_identity?.emotional_benefits && (
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 border border-emerald-200">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </div>
                        <h4 className="font-bold text-emerald-900">Emotional Benefits</h4>
                      </div>
                      <p className="text-emerald-800 leading-relaxed">{brandProfile.brand_identity.emotional_benefits}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Brand Strategy Section */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Brand Strategy</h3>
                      <p className="text-green-100 text-sm">Growth drivers and strategic positioning</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {brandProfile.brand_strategy?.most_popular_products_services && (
                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center gap-2 mb-3">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          <h4 className="font-bold text-green-900">Popular Products & Services</h4>
                        </div>
                        <p className="text-green-800 leading-relaxed text-sm">{brandProfile.brand_strategy.most_popular_products_services}</p>
                      </div>
                    )}

                    {brandProfile.brand_strategy?.top_revenue_drivers && (
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-center gap-2 mb-3">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <h4 className="font-bold text-blue-900">Top Revenue Drivers</h4>
                        </div>
                        <p className="text-blue-800 leading-relaxed text-sm">{brandProfile.brand_strategy.top_revenue_drivers}</p>
                      </div>
                    )}

                    {brandProfile.brand_strategy?.emerging_growth_areas && (
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                        <div className="flex items-center gap-2 mb-3">
                          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                          <h4 className="font-bold text-purple-900">Emerging Growth Areas</h4>
                        </div>
                        <p className="text-purple-800 leading-relaxed text-sm">{brandProfile.brand_strategy.emerging_growth_areas}</p>
                      </div>
                    )}

                    {brandProfile.brand_strategy?.why_customers_choose && (
                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                        <div className="flex items-center gap-2 mb-3">
                          <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <h4 className="font-bold text-orange-900">Why Customers Choose</h4>
                        </div>
                        <p className="text-orange-800 leading-relaxed text-sm">{brandProfile.brand_strategy.why_customers_choose}</p>
                      </div>
                    )}
                  </div>

                  {brandProfile.brand_strategy?.primary_value_drivers && (
                    <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 11V9a2 2 0 00-2-2H7a2 2 0 00-2 2v2m6 0V9a2 2 0 012-2h2a2 2 0 012 2v2m-6 0h6m6 4v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h14a2 2 0 012 2z" />
                          </svg>
                        </div>
                        <h4 className="font-bold text-indigo-900">Primary Value Drivers</h4>
                      </div>
                      <p className="text-indigo-800 leading-relaxed">{brandProfile.brand_strategy.primary_value_drivers}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Brand Voice Guide */}
              {brandProfile.brand_voice_guide && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Brand Voice Guide</h3>
                        <p className="text-indigo-100 text-sm">Communication standards and personality</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {brandProfile.brand_voice_guide.purpose && (
                        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 border border-indigo-200">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                              </svg>
                            </div>
                            <h4 className="font-bold text-indigo-900">Purpose</h4>
                          </div>
                          <p className="text-indigo-800 leading-relaxed text-sm">{brandProfile.brand_voice_guide.purpose}</p>
                        </div>
                      )}

                      {brandProfile.brand_voice_guide.audience && (
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                              </svg>
                            </div>
                            <h4 className="font-bold text-purple-900">Audience</h4>
                          </div>
                          <p className="text-purple-800 leading-relaxed text-sm">{brandProfile.brand_voice_guide.audience}</p>
                        </div>
                      )}

                      {brandProfile.brand_voice_guide.tone && (
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                              </svg>
                            </div>
                            <h4 className="font-bold text-blue-900">Tone</h4>
                          </div>
                          <p className="text-blue-800 leading-relaxed text-sm">{brandProfile.brand_voice_guide.tone}</p>
                        </div>
                      )}

                      {brandProfile.brand_voice_guide.emotional_tone && (
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                            </div>
                            <h4 className="font-bold text-green-900">Emotional Tone</h4>
                          </div>
                          <p className="text-green-800 leading-relaxed text-sm">{brandProfile.brand_voice_guide.emotional_tone}</p>
                        </div>
                      )}

                      {brandProfile.brand_voice_guide.character && (
                        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <h4 className="font-bold text-yellow-900">Character</h4>
                          </div>
                          <p className="text-yellow-800 leading-relaxed text-sm">{brandProfile.brand_voice_guide.character}</p>
                        </div>
                      )}

                      {brandProfile.brand_voice_guide.syntax && (
                        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0V1m10 3V1m0 3l1 1v16a2 2 0 01-2 2H6a2 2 0 01-2-2V5l1-1z" />
                              </svg>
                            </div>
                            <h4 className="font-bold text-red-900">Syntax</h4>
                          </div>
                          <p className="text-red-800 leading-relaxed text-sm">{brandProfile.brand_voice_guide.syntax}</p>
                        </div>
                      )}
                    </div>

                    {/* Language Elements */}
                    <div className="mt-6 space-y-6">
                      {brandProfile.brand_voice_guide.language_choices && (
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0V1m10 3V1m0 3l1 1v16a2 2 0 01-2 2H6a2 2 0 01-2-2V5l1-1z" />
                              </svg>
                            </div>
                            <h4 className="font-bold text-gray-900">Language Choices</h4>
                          </div>
                          <p className="text-gray-800 leading-relaxed">{brandProfile.brand_voice_guide.language_choices}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {brandProfile.brand_voice_guide.words_to_use && (
                          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <h4 className="font-bold text-green-900">Words to Use</h4>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {brandProfile.brand_voice_guide.words_to_use.map((word: string, index: number) => (
                                <span key={index} className="px-3 py-1 bg-green-200 text-green-800 text-sm rounded-full font-medium">
                                  {word}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {brandProfile.brand_voice_guide.words_to_avoid && (
                          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </div>
                              <h4 className="font-bold text-red-900">Words to Avoid</h4>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {brandProfile.brand_voice_guide.words_to_avoid.map((word: string, index: number) => (
                                <span key={index} className="px-3 py-1 bg-red-200 text-red-800 text-sm rounded-full font-medium">
                                  {word}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Social Media Content Strategy */}
              {brandProfile.social_media_content_mix && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-pink-600 to-rose-600 text-white p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0V1m10 3V1m0 3l1 1v16a2 2 0 01-2 2H6a2 2 0 01-2-2V5l1-1z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Social Media Strategy</h3>
                        <p className="text-pink-100 text-sm">Content pillars and distribution strategy</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                      <div className="text-center">
                        <div className="relative w-20 h-20 mx-auto mb-3">
                          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#e5e7eb"
                              strokeWidth="3"
                            />
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#3b82f6"
                              strokeWidth="3"
                              strokeDasharray={`${parseInt(brandProfile.social_media_content_mix.value_education.replace(' percent', '')) * 1.1}, 110`}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-lg font-bold text-blue-600">{brandProfile.social_media_content_mix.value_education}</span>
                          </div>
                        </div>
                        <h4 className="font-semibold text-gray-900">Value & Education</h4>
                        <p className="text-sm text-gray-600">Educational content</p>
                      </div>

                      <div className="text-center">
                        <div className="relative w-20 h-20 mx-auto mb-3">
                          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#e5e7eb"
                              strokeWidth="3"
                            />
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#10b981"
                              strokeWidth="3"
                              strokeDasharray={`${parseInt(brandProfile.social_media_content_mix.connection_story.replace(' percent', '')) * 1.1}, 110`}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-lg font-bold text-green-600">{brandProfile.social_media_content_mix.connection_story}</span>
                          </div>
                        </div>
                        <h4 className="font-semibold text-gray-900">Connection & Story</h4>
                        <p className="text-sm text-gray-600">Relationship content</p>
                      </div>

                      <div className="text-center">
                        <div className="relative w-20 h-20 mx-auto mb-3">
                          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#e5e7eb"
                              strokeWidth="3"
                            />
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#8b5cf6"
                              strokeWidth="3"
                              strokeDasharray={`${parseInt(brandProfile.social_media_content_mix.proof_authority.replace(' percent', '')) * 1.1}, 110`}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-lg font-bold text-purple-600">{brandProfile.social_media_content_mix.proof_authority}</span>
                          </div>
                        </div>
                        <h4 className="font-semibold text-gray-900">Proof & Authority</h4>
                        <p className="text-sm text-gray-600">Credibility content</p>
                      </div>

                      <div className="text-center">
                        <div className="relative w-20 h-20 mx-auto mb-3">
                          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#e5e7eb"
                              strokeWidth="3"
                            />
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#f59e0b"
                              strokeWidth="3"
                              strokeDasharray={`${parseInt(brandProfile.social_media_content_mix.direct_promotion.replace(' percent', '')) * 1.1}, 110`}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-lg font-bold text-orange-600">{brandProfile.social_media_content_mix.direct_promotion}</span>
                          </div>
                        </div>
                        <h4 className="font-semibold text-gray-900">Direct Promotion</h4>
                        <p className="text-sm text-gray-600">Sales content</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
                      <h4 className="font-bold text-gray-900 mb-2">Content Strategy Summary</h4>
                      <p className="text-gray-700 text-sm">
                        Your social media content should be distributed as:
                        <strong> {brandProfile.social_media_content_mix.value_education}</strong> educational value,
                        <strong> {brandProfile.social_media_content_mix.connection_story}</strong> relationship building,
                        <strong> {brandProfile.social_media_content_mix.proof_authority}</strong> credibility and expertise, and
                        <strong> {brandProfile.social_media_content_mix.direct_promotion}</strong> promotional content.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Operations & Additional Notes */}
              {(brandProfile.products_services || brandProfile.areas_served || brandProfile.additional_notes) && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Operations & Insights</h3>
                        <p className="text-gray-200 text-sm">Products, services, and additional recommendations</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {brandProfile.products_services && (
                        <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-4 border border-cyan-200">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                              </svg>
                            </div>
                            <h4 className="font-bold text-cyan-900">Products & Services</h4>
                          </div>
                          <p className="text-cyan-800 leading-relaxed text-sm">{brandProfile.products_services}</p>
                        </div>
                      )}

                      {brandProfile.areas_served && (
                        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-4 border border-teal-200">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                            <h4 className="font-bold text-teal-900">Areas Served</h4>
                          </div>
                          <p className="text-teal-800 leading-relaxed text-sm">{brandProfile.areas_served}</p>
                        </div>
                      )}
                    </div>

                    {brandProfile.additional_notes && (
                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                          </div>
                          <h4 className="font-bold text-amber-900">Additional Notes & Recommendations</h4>
                        </div>
                        <p className="text-amber-800 leading-relaxed">{brandProfile.additional_notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Fallback: Display Raw AI Response when JSON parsing fails */
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-orange-800">JSON Parsing Failed</p>
                    <p className="text-xs text-orange-700">Showing raw AI response below</p>
                  </div>
                </div>
              </div>
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm max-h-96 overflow-y-auto border border-gray-200 rounded-md p-4 bg-gray-50">
                {analysis.ai_analysis}
              </div>
            </div>
          )}
        </div>
      ) : analysis.status === 'processing' ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600"></div>
            <div>
              <p className="text-yellow-800 font-medium">Analysis in Progress</p>
              <p className="text-yellow-600 text-sm">AI is processing your content. This may take a few minutes...</p>
            </div>
          </div>
        </div>
      ) : analysis.status === 'failed' ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-red-800 font-medium">Analysis Failed</p>
              <p className="text-red-600 text-sm">There was an error processing your analysis. Please try again.</p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Structured Data Summary */}
      {analysis.structured_data && (
        <div className="mt-6 bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Key Insights
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.structured_data.key_insights?.map((insight: string, index: number) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-purple-600">✓</span>
                </div>
                <p className="text-sm text-gray-700">{insight}</p>
              </div>
            ))}
          </div>
          {analysis.structured_data.target_audience && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-900 mb-1">Target Audience:</p>
              <p className="text-sm text-blue-800">{analysis.structured_data.target_audience}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
