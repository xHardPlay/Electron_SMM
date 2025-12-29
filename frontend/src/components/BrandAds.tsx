'use client'

interface BrandAdsProps {
  showAdForm: boolean
  setShowAdForm: (show: boolean) => void
  adType: string
  setAdType: (type: string) => void
  adTopic: string
  setAdTopic: (topic: string) => void
  adQuantity: number
  setAdQuantity: (quantity: number) => void
  characters: any[]
  selectedCharacters: number[]
  handleCharacterCheckbox: (characterId: number, checked: boolean) => void
  loading: boolean
  handleGenerateAds: (e: React.FormEvent) => void
}

export default function BrandAds({
  showAdForm,
  setShowAdForm,
  adType,
  setAdType,
  adTopic,
  setAdTopic,
  adQuantity,
  setAdQuantity,
  characters,
  selectedCharacters,
  handleCharacterCheckbox,
  loading,
  handleGenerateAds
}: BrandAdsProps) {
  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Brand Ads</h2>
        <p className="text-gray-600 mb-4">Generate ads using AI characters</p>
        <button
          onClick={() => setShowAdForm(!showAdForm)}
          className="bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600"
        >
          {showAdForm ? 'Cancel' : 'Generate Ads'}
        </button>
      </div>

      {showAdForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold mb-4">Generate Marketing Ads</h3>
          <form onSubmit={handleGenerateAds}>
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
                      onChange={(e) => handleCharacterCheckbox(character.id, e.target.checked)}
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

            <button
              type="submit"
              disabled={loading || selectedCharacters.length === 0}
              className="bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
            >
              {loading ? 'Generating Ads...' : 'Generate Ads'}
            </button>
          </form>
        </div>
      )}
    </>
  )
}
