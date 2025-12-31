'use client'

import StatusBadge from './analysis/StatusBadge'

interface AdsDisplayProps {
  ads: any[]
}

export default function AdsDisplay({ ads }: AdsDisplayProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-semibold mb-4">Generated Ads</h3>
      {ads.length === 0 ? (
        <p className="text-gray-600">No ads generated yet. Create ads above!</p>
      ) : (
        <div className="space-y-4">
          {ads.map((ad) => (
            <div key={ad.id} className="border border-gray-200 rounded-md p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-lg font-medium">{ad.topic}</h4>
                  <p className="text-sm text-gray-600">{ad.character_name} • {ad.ad_type.replace('_', ' ')}</p>
                </div>
                <StatusBadge status={ad.status || 'completed'} />
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Created: {new Date(ad.created_at).toLocaleDateString()}
              </p>

              {/* Processing Status */}
              {ad.status === 'processing' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600"></div>
                    <div>
                      <p className="text-yellow-800 font-medium">⚡ Processing</p>
                      <p className="text-yellow-600 text-sm">Preparing ad generation...</p>
                    </div>
                  </div>
                </div>
              )}

              {ad.status === 'preparing_brand_context' && (
                <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cyan-600"></div>
                    <div>
                      <p className="text-cyan-800 font-medium">📋 Preparing Context</p>
                      <p className="text-cyan-600 text-sm">Analyzing brand information...</p>
                    </div>
                  </div>
                </div>
              )}

              {ad.status === 'analyzing_brand_data' && (
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-600"></div>
                    <div>
                      <p className="text-teal-800 font-medium">🔍 Analyzing Data</p>
                      <p className="text-teal-600 text-sm">Processing brand context...</p>
                    </div>
                  </div>
                </div>
              )}

              {ad.status === 'planning_content_mix' && (
                <div className="bg-lime-50 border border-lime-200 rounded-lg p-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-lime-600"></div>
                    <div>
                      <p className="text-lime-800 font-medium">📝 Planning Mix</p>
                      <p className="text-lime-600 text-sm">Designing content strategy...</p>
                    </div>
                  </div>
                </div>
              )}

              {ad.status === 'generating' && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="animate-pulse">
                      <div className="w-5 h-5 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-orange-800 font-medium">🎨 Generating Content</p>
                      <p className="text-orange-600 text-sm">Creating ad content...</p>
                    </div>
                  </div>
                </div>
              )}

              {ad.status === 'generating_content' && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-600"></div>
                    <div>
                      <p className="text-amber-800 font-medium">✍️ Creating Content</p>
                      <p className="text-amber-600 text-sm">Writing ad copy...</p>
                    </div>
                  </div>
                </div>
              )}

              {ad.status === 'completed' && (
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm whitespace-pre-wrap">{ad.content}</p>
                </div>
              )}

              {ad.status === 'failed' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-red-800 font-medium">❌ Generation Failed</p>
                      <p className="text-red-600 text-sm">There was an error creating this ad.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
