'use client'

import { Ad } from '../types/common'
import StatusBadge from './analysis/StatusBadge'

interface AdsDisplayProps {
  ads: Ad[]
}

function getContentCategoryInfo(category?: string) {
  switch (category) {
    case 'education':
      return {
        label: 'Education',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: '📚',
        description: 'Educational content explaining prevention and insights'
      }
    case 'story':
      return {
        label: 'Story',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: '📖',
        description: 'Narrative content sharing experiences and connections'
      }
    case 'proof':
      return {
        label: 'Proof',
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: '✅',
        description: 'Authority content demonstrating expertise and results'
      }
    case 'promotion':
      return {
        label: 'Promotion',
        color: 'bg-orange-100 text-orange-800 border-orange-200',
        icon: '🎯',
        description: 'Direct promotion with calls-to-action and services'
      }
    default:
      return {
        label: 'General',
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: '📄',
        description: 'General marketing content'
      }
  }
}

function formatAdContent(content: string, adType: string) {
  const charCount = content.length

  switch (adType) {
    case 'twitter':
      return {
        content,
        limit: 280,
        platform: 'Twitter/X',
        icon: '🐦'
      }
    case 'linkedin_post':
      return {
        content,
        limit: 2000,
        platform: 'LinkedIn',
        icon: '💼'
      }
    case 'email':
      return {
        content,
        limit: null,
        platform: 'Email',
        icon: '📧'
      }
    default:
      return {
        content,
        limit: null,
        platform: adType.replace('_', ' ').toUpperCase(),
        icon: '📢'
      }
  }
}

export default function AdsDisplay({ ads }: AdsDisplayProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-semibold mb-4">Generated Ads</h3>
      {ads.length === 0 ? (
        <p className="text-gray-600">No ads generated yet. Create ads above!</p>
      ) : (
        <div className="space-y-6">
          {ads.map((ad) => {
            const categoryInfo = getContentCategoryInfo(ad.content_category)
            const formattedAd = ad.status === 'completed' ? formatAdContent(ad.content, ad.ad_type) : null

            return (
              <div key={ad.id} className="border border-gray-200 rounded-lg p-6 bg-gradient-to-r from-gray-50 to-white">
                {/* Header Section */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-xl font-semibold text-gray-900">{ad.topic}</h4>
                      {ad.content_category && (
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${categoryInfo.color} flex items-center gap-1`}>
                          <span>{categoryInfo.icon}</span>
                          {categoryInfo.label}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <span className="font-medium">Character:</span> {ad.character_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="font-medium">Platform:</span> {ad.ad_type.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="font-medium">Created:</span> {new Date(ad.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <StatusBadge status={ad.status} />
                  </div>
                </div>

                {/* Content Category Description */}
                {ad.content_category && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Content Strategy:</span> {categoryInfo.description}
                    </p>
                  </div>
                )}

                {/* Processing Status */}
                {ad.status === 'processing' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
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
                  <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 mb-4">
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
                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-4">
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
                  <div className="bg-lime-50 border border-lime-200 rounded-lg p-4 mb-4">
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
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
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
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-600"></div>
                      <div>
                        <p className="text-amber-800 font-medium">✍️ Creating Content</p>
                        <p className="text-amber-600 text-sm">Writing ad copy...</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Completed Ad Content */}
                {ad.status === 'completed' && formattedAd && (
                  <div className="space-y-4">
                    {/* Platform Info */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-lg">{formattedAd.icon}</span>
                      <span className="font-medium">{formattedAd.platform}</span>
                      {formattedAd.limit && (
                        <span className={`px-2 py-1 rounded text-xs ${
                          formattedAd.content.length > formattedAd.limit
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {formattedAd.content.length}/{formattedAd.limit} chars
                        </span>
                      )}
                    </div>

                    {/* Ad Content */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <div className="text-gray-900 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                        {ad.content.split('\n').map((line, index) => (
                          <p key={index} className="mb-2 last:mb-0">
                            {line.trim() || '\u00A0'}
                          </p>
                        ))}
                      </div>
                      {ad.content.length > 500 && (
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          <p className="text-xs text-gray-500">
                            Content length: {ad.content.length} characters
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Image Prompt */}
                    {ad.image_prompt && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <span className="text-blue-600 text-lg">🖼️</span>
                          <div>
                            <p className="text-blue-800 font-medium mb-1">Suggested Image</p>
                            <p className="text-blue-700 text-sm">{ad.image_prompt}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Failed Status */}
                {ad.status === 'failed' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            )
          })}
        </div>
      )}
    </div>
  )
}
