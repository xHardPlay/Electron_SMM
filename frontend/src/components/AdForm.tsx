import { useState } from 'react'

interface Character {
  id: number
  name: string
  description: string
  personality?: string
  status: string
}

interface AdFormProps {
  characters: Character[]
  selectedCharacters: number[]
  onCharacterSelect: (characterId: number, checked: boolean) => void
  onGenerateAds: (adType: string, topic: string, quantity: number) => void
  loading: boolean
}

export default function AdForm({
  characters,
  selectedCharacters,
  onCharacterSelect,
  onGenerateAds,
  loading,
}: AdFormProps) {
  const [adType, setAdType] = useState<string>('linkedin_post')
  const [adTopic, setAdTopic] = useState('')
  const [adQuantity, setAdQuantity] = useState<number>(1)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedCharacters.length === 0 || !adTopic.trim()) return
    onGenerateAds(adType, adTopic, adQuantity)
    setAdTopic('')
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

        <button
          type="submit"
          disabled={loading || selectedCharacters.length === 0}
          className="bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
        >
          {loading ? 'Generating Ads...' : 'Generate Ads'}
        </button>
      </form>
    </div>
  )
}
