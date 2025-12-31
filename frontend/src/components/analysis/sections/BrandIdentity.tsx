import type { BrandProfile } from '../../../utils/analysisParser'
import SectionCard from '../SectionCard'

interface BrandIdentityProps {
  brandProfile: BrandProfile
  isEditing?: boolean
  onChange?: (field: string, value: any) => void
}

export default function BrandIdentity({ brandProfile, isEditing = false, onChange }: BrandIdentityProps) {
  return (
    <SectionCard
      title="Brand Identity"
      description="Core foundation and market positioning"
      icon={
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      }
      gradientFrom="from-blue-600"
      gradientTo="to-blue-700"
    >
      <div className="space-y-6">
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
              {isEditing ? (
                <textarea
                  value={brandProfile.brand_identity.business_overview}
                  onChange={(e) => onChange?.('brand_identity.business_overview', e.target.value)}
                  className="w-full p-2 border border-blue-300 rounded-md text-blue-800 bg-white"
                  rows={3}
                  placeholder="Enter business overview..."
                />
              ) : (
                <p className="text-blue-800 leading-relaxed">{brandProfile.brand_identity.business_overview}</p>
              )}
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
              {isEditing ? (
                <textarea
                  value={brandProfile.brand_identity.core_identity}
                  onChange={(e) => onChange?.('brand_identity.core_identity', e.target.value)}
                  className="w-full p-2 border border-indigo-300 rounded-md text-indigo-800 bg-white"
                  rows={3}
                  placeholder="Enter core identity..."
                />
              ) : (
                <p className="text-indigo-800 leading-relaxed">{brandProfile.brand_identity.core_identity}</p>
              )}
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
              {isEditing ? (
                <textarea
                  value={brandProfile.brand_identity.market_positioning}
                  onChange={(e) => onChange?.('brand_identity.market_positioning', e.target.value)}
                  className="w-full p-2 border border-green-300 rounded-md text-green-800 bg-white"
                  rows={3}
                  placeholder="Enter market positioning..."
                />
              ) : (
                <p className="text-green-800 leading-relaxed">{brandProfile.brand_identity.market_positioning}</p>
              )}
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
              {isEditing ? (
                <textarea
                  value={brandProfile.brand_identity.customer_profile}
                  onChange={(e) => onChange?.('brand_identity.customer_profile', e.target.value)}
                  className="w-full p-2 border border-purple-300 rounded-md text-purple-800 bg-white"
                  rows={3}
                  placeholder="Enter customer profile..."
                />
              ) : (
                <p className="text-purple-800 leading-relaxed">{brandProfile.brand_identity.customer_profile}</p>
              )}
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
            {isEditing ? (
              <div className="space-y-3">
                {Array.isArray(brandProfile.brand_identity.competitive_landscape) ? (
                  brandProfile.brand_identity.competitive_landscape.map((competitor: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-red-600">{index + 1}</span>
                      </div>
                      <input
                        type="text"
                        value={competitor}
                        onChange={(e) => {
                          const newCompetitors = [...brandProfile.brand_identity.competitive_landscape]
                          newCompetitors[index] = e.target.value
                          onChange?.('brand_identity.competitive_landscape', newCompetitors)
                        }}
                        className="flex-1 p-2 border border-red-300 rounded-md text-red-800 bg-white"
                        placeholder={`Competitor ${index + 1}...`}
                      />
                      <button
                        onClick={() => {
                          const newCompetitors = brandProfile.brand_identity.competitive_landscape.filter((_, i) => i !== index)
                          onChange?.('brand_identity.competitive_landscape', newCompetitors)
                        }}
                        className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded"
                        title="Remove competitor"
                      >
                        ×
                      </button>
                    </div>
                  ))
                ) : (
                  <textarea
                    value={brandProfile.brand_identity.competitive_landscape || ''}
                    onChange={(e) => onChange?.('brand_identity.competitive_landscape', e.target.value)}
                    className="w-full p-2 border border-red-300 rounded-md text-red-800 bg-white"
                    rows={3}
                    placeholder="Enter competitive landscape..."
                  />
                )}
                <button
                  onClick={() => {
                    const current = brandProfile.brand_identity.competitive_landscape || []
                    const newCompetitors = Array.isArray(current) ? [...current, ''] : ['']
                    onChange?.('brand_identity.competitive_landscape', newCompetitors)
                  }}
                  className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded"
                >
                  + Add Competitor
                </button>
              </div>
            ) : (
              Array.isArray(brandProfile.brand_identity.competitive_landscape) ? (
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
              ) : (
                <p className="text-red-800 leading-relaxed">{brandProfile.brand_identity.competitive_landscape}</p>
              )
            )}
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
              {isEditing ? (
                <textarea
                  value={brandProfile.brand_identity.brand_story}
                  onChange={(e) => onChange?.('brand_identity.brand_story', e.target.value)}
                  className="w-full p-2 border border-yellow-300 rounded-md text-yellow-800 bg-white"
                  rows={3}
                  placeholder="Enter brand story..."
                />
              ) : (
                <p className="text-yellow-800 leading-relaxed text-sm">{brandProfile.brand_identity.brand_story}</p>
              )}
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
              {isEditing ? (
                <textarea
                  value={brandProfile.brand_identity.brand_personality}
                  onChange={(e) => onChange?.('brand_identity.brand_personality', e.target.value)}
                  className="w-full p-2 border border-pink-300 rounded-md text-pink-800 bg-white"
                  rows={3}
                  placeholder="Enter brand personality..."
                />
              ) : (
                <p className="text-pink-800 leading-relaxed text-sm">{brandProfile.brand_identity.brand_personality}</p>
              )}
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
            {isEditing ? (
              <textarea
                value={brandProfile.brand_identity.emotional_benefits}
                onChange={(e) => onChange?.('brand_identity.emotional_benefits', e.target.value)}
                className="w-full p-2 border border-emerald-300 rounded-md text-emerald-800 bg-white"
                rows={3}
                placeholder="Enter emotional benefits..."
              />
            ) : (
              <p className="text-emerald-800 leading-relaxed">{brandProfile.brand_identity.emotional_benefits}</p>
            )}
          </div>
        )}
      </div>
    </SectionCard>
  )
}
