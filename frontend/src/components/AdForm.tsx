import { useState } from 'react'

interface Character {
  id: number
  name: string
  description: string
  personality?: string
  status: string
}

interface AdGeneration {
  id: number
  ad_type: string
  topic: string
  quantity: number
  content_mix?: { education: number; story: number; proof: number; promotion: number }
  status: string
  created_at: string
  updated_at: string
}

interface AdFormProps {
  characters: Character[]
  selectedCharacters: number[]
  onCharacterSelect: (characterId: number, checked: boolean) => void
  onGenerateAds: (adType: string, topic: string, quantity: number, contentMix?: { education: number; story: number; proof: number; promotion: number }) => void
  loading: boolean
  adGenerations?: AdGeneration[]
}

export default function AdForm({
  characters,
  selectedCharacters,
  onCharacterSelect,
  onGenerateAds,
  loading,
  adGenerations,
}: AdFormProps) {
  const [adType, setAdType] = useState<string>('linkedin_post')
  const [adTopic, setAdTopic] = useState('')
  const [adQuantity, setAdQuantity] = useState<number>(1)
  const [useCustomMix, setUseCustomMix] = useState<boolean>(false)
  const [contentMix, setContentMix] = useState<{ education: number; story: number; proof: number; promotion: number }>({
    education: 40,
    story: 30,
    proof: 20,
    promotion: 10
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedCharacters.length === 0 || !adTopic.trim()) return
    const mixToUse = useCustomMix ? contentMix : undefined
    onGenerateAds(adType, adTopic, adQuantity, mixToUse)
    setAdTopic('')
  }

  const handleMixChange = (category: keyof typeof contentMix, value: number) => {
    setContentMix(prev => ({ ...prev, [category]: value }))
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-semibold mb-4">Generate Marketing Ads</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Ad Type
          </label>
          <select
            value={adType}
            onChange={(e) => setAdType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="linkedin_post">LinkedIn Post</option>
            <option value="twitter">Twitter/X Post</option>
            <option value="email">Email Content</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Topic
          </label>
          <input
            type="text"
            value={adTopic}
            onChange={(e) => setAdTopic(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Enter the ad topic or product"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Quantity
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={adQuantity}
            onChange={(e) => setAdQuantity(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Select Characters (Approved only)
          </label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {characters.filter(c => c.status === 'approved').map((character) => (
              <label key={character.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedCharacters.includes(character.id)}
                  onChange={(e) => onCharacterSelect(character.id, e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">{character.name}</span>
              </label>
            ))}
          </div>
          {characters.filter(c => c.status === 'approved').length === 0 && (
            <p className="text-sm text-red-600">No approved characters available. Please approve some characters first.</p>
          )}
        </div>

        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={useCustomMix}
              onChange={(e) => setUseCustomMix(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm font-medium">Use Custom Content Mix</span>
          </label>
          <p className="text-xs text-gray-600 mt-1">
            Customize the distribution of content types (default: 40% education, 30% story, 20% proof, 10% promotion)
          </p>
        </div>

        {useCustomMix && (
          <div className="mb-4 p-4 bg-gray-50 rounded-md">
            <h4 className="text-sm font-medium mb-3">Content Mix Distribution (%)</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Education & Value (explaining mold, moisture, prevention, etc.)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={contentMix.education}
                  onChange={(e) => handleMixChange('education', parseInt(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{contentMix.education}%</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Story & Connection (experiences, community, relatable situations)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={contentMix.story}
                  onChange={(e) => handleMixChange('story', parseInt(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{contentMix.story}%</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Proof & Authority (certifications, results, expertise)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={contentMix.proof}
                  onChange={(e) => handleMixChange('proof', parseInt(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{contentMix.proof}%</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Promotion & Calls-to-Action (services, booking, offers)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={contentMix.promotion}
                  onChange={(e) => handleMixChange('promotion', parseInt(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{contentMix.promotion}%</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Total: {Object.values(contentMix).reduce((sum, val) => sum + val, 0)}% (should equal 100% for best results)
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || selectedCharacters.length === 0}
          className="bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
        >
          {loading ? 'Generating Ads...' : 'Generate Ads'}
        </button>
      </form>

      {/* Ad Generation Status */}
      {adGenerations && adGenerations.length > 0 && (
        <div className="mt-6 border-t pt-6">
          <h4 className="text-lg font-semibold mb-4">Ad Generation Status</h4>
          <div className="space-y-4">
            {adGenerations.slice(0, 3).map((generation) => (
              <div key={generation.id} className="border border-gray-200 rounded-md p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h5 className="text-md font-medium">{generation.topic}</h5>
                    <p className="text-sm text-gray-600">
                      {generation.ad_type.replace('_', ' ')} • {generation.quantity} ads
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded text-sm ${
                      generation.status === 'completed' ? 'bg-green-100 text-green-800' :
                      generation.status === 'failed' ? 'bg-red-100 text-red-800' :
                      generation.status === 'processing' || generation.status === 'preparing_brand_context' ||
                      generation.status === 'analyzing_brand_data' || generation.status === 'planning_content_mix' ||
                      generation.status === 'generating_content' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {generation.status === 'preparing_brand_context' ? 'Preparing Brand Context' :
                       generation.status === 'analyzing_brand_data' ? 'Analyzing Brand Data' :
                       generation.status === 'planning_content_mix' ? 'Planning Content Mix' :
                       generation.status === 'generating_content' ? 'Generating Content' :
                       generation.status === 'completed' ? 'Completed' :
                       generation.status === 'failed' ? 'Failed' :
                       generation.status}
                    </span>
                  </div>
                </div>
                {generation.content_mix && (
                  <div className="mt-2 text-xs text-gray-500">
                    Content Mix: Education {generation.content_mix.education}% •
                    Story {generation.content_mix.story}% •
                    Proof {generation.content_mix.proof}% •
                    Promotion {generation.content_mix.promotion}%
                  </div>
                )}
                <div className="mt-2 text-xs text-gray-500">
                  Started: {new Date(generation.created_at).toLocaleString()}
                  {generation.status !== 'processing' && generation.status !== 'preparing_brand_context' &&
                   generation.status !== 'analyzing_brand_data' && generation.status !== 'planning_content_mix' &&
                   generation.status !== 'generating_content' && (
                    <> • Updated: {new Date(generation.updated_at).toLocaleString()}</>
                  )}
                </div>
                {generation.status === 'processing' || generation.status === 'preparing_brand_context' ||
                 generation.status === 'analyzing_brand_data' || generation.status === 'planning_content_mix' ||
                 generation.status === 'generating_content' ? (
                  <div className="mt-3">
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500 mr-2"></div>
                      <span className="text-sm text-orange-600">Processing...</span>
                    </div>
                  </div>
                ) : generation.status === 'completed' ? (
                  <div className="mt-3">
                    <span className="text-sm text-green-600">✓ Ads generated successfully! Check the Ads tab to view results.</span>
                  </div>
                ) : generation.status === 'failed' ? (
                  <div className="mt-3">
                    <span className="text-sm text-red-600">✗ Generation failed. Please try again.</span>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
