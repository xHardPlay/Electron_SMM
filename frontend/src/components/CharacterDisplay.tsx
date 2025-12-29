'use client'

interface CharacterDisplayProps {
  characters: any[]
  handleCharacterAction: (characterId: string, action: 'approved' | 'discarded') => void
}

export default function CharacterDisplay({ characters, handleCharacterAction }: CharacterDisplayProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-semibold mb-4">Brand Voice Characters</h3>
      {characters.length === 0 ? (
        <p className="text-gray-600">No characters yet. Generate characters above!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {characters.map((character) => (
            <div key={character.id} className="border border-gray-200 rounded-md p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-lg font-medium">{character.name}</h4>
                <span className={`px-2 py-1 rounded text-sm ${
                  character.status === 'approved' ? 'bg-green-100 text-green-800' :
                  character.status === 'discarded' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {character.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{character.description}</p>
              {character.personality && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">Personality:</p>
                  <p className="text-sm bg-gray-50 p-2 rounded">{character.personality}</p>
                </div>
              )}
              <div className="flex gap-2">
                {character.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleCharacterAction(character.id.toString(), 'approved')}
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleCharacterAction(character.id.toString(), 'discarded')}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Discard
                    </button>
                  </>
                )}
                {character.status === 'approved' && (
                  <span className="text-green-600 text-sm">✓ Approved for use</span>
                )}
                {character.status === 'discarded' && (
                  <span className="text-red-600 text-sm">✗ Discarded</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
