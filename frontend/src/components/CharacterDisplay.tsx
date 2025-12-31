'use client'

import StatusBadge from './analysis/StatusBadge'

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
                <StatusBadge status={character.status} />
              </div>
              <p className="text-sm text-gray-600 mb-3">{character.description}</p>
              {character.personality && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">Personality:</p>
                  <p className="text-sm bg-gray-50 p-2 rounded">{character.personality}</p>
                </div>
              )}

              {/* Processing Status */}
              {character.status === 'processing' && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
                    <div>
                      <p className="text-purple-800 font-medium">🤖 AI Processing</p>
                      <p className="text-purple-600 text-sm">Generating character details...</p>
                    </div>
                  </div>
                </div>
              )}

              {character.status === 'generating' && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="animate-pulse">
                      <div className="w-5 h-5 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-orange-800 font-medium">🎨 Creating Character</p>
                      <p className="text-orange-600 text-sm">Finalizing character profile...</p>
                    </div>
                  </div>
                </div>
              )}

              {character.status === 'completed' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <p className="text-green-800 font-medium">✅ Character Ready</p>
                      <p className="text-green-600 text-sm">Character generation completed!</p>
                    </div>
                  </div>
                </div>
              )}

              {character.status === 'failed' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-red-800 font-medium">❌ Generation Failed</p>
                      <p className="text-red-600 text-sm">There was an error creating this character.</p>
                    </div>
                  </div>
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
