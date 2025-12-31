import type { BrandProfile } from '../../../utils/analysisParser'
import SectionCard from '../SectionCard'

interface BrandVoiceGuideProps {
  brandProfile: BrandProfile
  isEditing?: boolean
  onChange?: (field: string, value: any) => void
}

export default function BrandVoiceGuide({ brandProfile, isEditing = false, onChange }: BrandVoiceGuideProps) {
  return (
    <SectionCard
      title="Brand Voice Guide"
      description="Communication standards and personality"
      icon={
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      }
      gradientFrom="from-indigo-600"
      gradientTo="to-purple-600"
    >
      <div className="space-y-6">
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
              {isEditing ? (
                <textarea
                  value={brandProfile.brand_voice_guide.purpose}
                  onChange={(e) => onChange?.('brand_voice_guide.purpose', e.target.value)}
                  className="w-full p-2 border border-indigo-300 rounded-md text-indigo-800 bg-white"
                  rows={3}
                  placeholder="Enter purpose..."
                />
              ) : (
                <p className="text-indigo-800 leading-relaxed text-sm">{brandProfile.brand_voice_guide.purpose}</p>
              )}
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
              {isEditing ? (
                <textarea
                  value={brandProfile.brand_voice_guide.audience}
                  onChange={(e) => onChange?.('brand_voice_guide.audience', e.target.value)}
                  className="w-full p-2 border border-purple-300 rounded-md text-purple-800 bg-white"
                  rows={3}
                  placeholder="Enter audience..."
                />
              ) : (
                <p className="text-purple-800 leading-relaxed text-sm">{brandProfile.brand_voice_guide.audience}</p>
              )}
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
              {isEditing ? (
                <textarea
                  value={brandProfile.brand_voice_guide.tone}
                  onChange={(e) => onChange?.('brand_voice_guide.tone', e.target.value)}
                  className="w-full p-2 border border-blue-300 rounded-md text-blue-800 bg-white"
                  rows={3}
                  placeholder="Enter tone..."
                />
              ) : (
                <p className="text-blue-800 leading-relaxed text-sm">{brandProfile.brand_voice_guide.tone}</p>
              )}
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
              {isEditing ? (
                <textarea
                  value={brandProfile.brand_voice_guide.emotional_tone}
                  onChange={(e) => onChange?.('brand_voice_guide.emotional_tone', e.target.value)}
                  className="w-full p-2 border border-green-300 rounded-md text-green-800 bg-white"
                  rows={3}
                  placeholder="Enter emotional tone..."
                />
              ) : (
                <p className="text-green-800 leading-relaxed text-sm">{brandProfile.brand_voice_guide.emotional_tone}</p>
              )}
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
              {isEditing ? (
                <textarea
                  value={brandProfile.brand_voice_guide.character}
                  onChange={(e) => onChange?.('brand_voice_guide.character', e.target.value)}
                  className="w-full p-2 border border-yellow-300 rounded-md text-yellow-800 bg-white"
                  rows={3}
                  placeholder="Enter character..."
                />
              ) : (
                <p className="text-yellow-800 leading-relaxed text-sm">{brandProfile.brand_voice_guide.character}</p>
              )}
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
              {isEditing ? (
                <textarea
                  value={brandProfile.brand_voice_guide.syntax}
                  onChange={(e) => onChange?.('brand_voice_guide.syntax', e.target.value)}
                  className="w-full p-2 border border-red-300 rounded-md text-red-800 bg-white"
                  rows={3}
                  placeholder="Enter syntax..."
                />
              ) : (
                <p className="text-red-800 leading-relaxed text-sm">{brandProfile.brand_voice_guide.syntax}</p>
              )}
            </div>
          )}
        </div>

        {/* Language Elements */}
        <div className="space-y-6">
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
              {isEditing ? (
                <textarea
                  value={brandProfile.brand_voice_guide.language_choices}
                  onChange={(e) => onChange?.('brand_voice_guide.language_choices', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-gray-800 bg-white"
                  rows={3}
                  placeholder="Enter language choices..."
                />
              ) : (
                <p className="text-gray-800 leading-relaxed">{brandProfile.brand_voice_guide.language_choices}</p>
              )}
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
                {isEditing ? (
                  <div className="space-y-2">
                    {brandProfile.brand_voice_guide.words_to_use.map((word: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={word}
                          onChange={(e) => {
                            const newWords = [...brandProfile.brand_voice_guide.words_to_use]
                            newWords[index] = e.target.value
                            onChange?.('brand_voice_guide.words_to_use', newWords)
                          }}
                          className="flex-1 p-1 border border-green-300 rounded-md text-green-800 bg-white text-sm"
                          placeholder={`Word ${index + 1}...`}
                        />
                        <button
                          onClick={() => {
                            const newWords = brandProfile.brand_voice_guide.words_to_use.filter((_, i) => i !== index)
                            onChange?.('brand_voice_guide.words_to_use', newWords)
                          }}
                          className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded"
                          title="Remove word"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newWords = [...brandProfile.brand_voice_guide.words_to_use, '']
                        onChange?.('brand_voice_guide.words_to_use', newWords)
                      }}
                      className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded"
                    >
                      + Add Word
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {brandProfile.brand_voice_guide.words_to_use.map((word: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-green-200 text-green-800 text-sm rounded-full font-medium">
                        {word}
                      </span>
                    ))}
                  </div>
                )}
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
                {isEditing ? (
                  <div className="space-y-2">
                    {brandProfile.brand_voice_guide.words_to_avoid.map((word: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={word}
                          onChange={(e) => {
                            const newWords = [...brandProfile.brand_voice_guide.words_to_avoid]
                            newWords[index] = e.target.value
                            onChange?.('brand_voice_guide.words_to_avoid', newWords)
                          }}
                          className="flex-1 p-1 border border-red-300 rounded-md text-red-800 bg-white text-sm"
                          placeholder={`Word ${index + 1}...`}
                        />
                        <button
                          onClick={() => {
                            const newWords = brandProfile.brand_voice_guide.words_to_avoid.filter((_, i) => i !== index)
                            onChange?.('brand_voice_guide.words_to_avoid', newWords)
                          }}
                          className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded"
                          title="Remove word"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newWords = [...brandProfile.brand_voice_guide.words_to_avoid, '']
                        onChange?.('brand_voice_guide.words_to_avoid', newWords)
                      }}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded"
                    >
                      + Add Word
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {brandProfile.brand_voice_guide.words_to_avoid.map((word: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-red-200 text-red-800 text-sm rounded-full font-medium">
                        {word}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </SectionCard>
  )
}
