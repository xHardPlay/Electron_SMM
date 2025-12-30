'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import AdForm from '../../components/AdForm'
import AnalysisForm from '../../components/AnalysisForm'
import AnalysisResultCard from '../../components/AnalysisResultCard'
import CharacterForm from '../../components/CharacterForm'
import WorkspaceForm from '../../components/WorkspaceForm'
import WorkspaceSidebar from '../../components/WorkspaceSidebar'
import { useAdGenerations } from '../../hooks/useAdGenerations'
import { useAds } from '../../hooks/useAds'
import { useAnalyses } from '../../hooks/useAnalyses'
import { useAuth } from '../../hooks/useAuth'
import { useCharacterImages } from '../../hooks/useCharacterImages'
import { useCharacters } from '../../hooks/useCharacters'
import { useWorkspaces } from '../../hooks/useWorkspaces'

export default function Dashboard() {
  const router = useRouter()
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('')
  const [selectedCharacters, setSelectedCharacters] = useState<number[]>([])
  const [activeFormTab, setActiveFormTab] = useState<'discovery' | 'voice' | 'adform'>('discovery')
  const [activeResultsTab, setActiveResultsTab] = useState<'analysis' | 'characters' | 'ads' | 'images'>('analysis')

  // Custom hooks for state management
  const { userId, token, isLoading, logout } = useAuth()
  const {
    workspaces,
    loading: workspaceLoading,
    message: workspaceMessage,
    showCreateForm: showCreateFormHook,
    newWorkspaceName,
    setShowCreateForm,
    setNewWorkspaceName,
    fetchWorkspaces,
    createWorkspace,
    deleteWorkspace,
    clearMessage: clearWorkspaceMessage,
  } = useWorkspaces(token)

  const {
    analyses,
    loading: analysisLoading,
    message: analysisMessage,
    fetchAnalyses,
    startAnalysis,
    deleteAnalysis,
    clearMessage: clearAnalysisMessage,
  } = useAnalyses(token, selectedWorkspace)

  const {
    characters,
    message: characterMessage,
    loading: characterLoading,
    fetchCharacters,
    generateCharacters,
    updateCharacterStatus,
    clearMessage: clearCharacterMessage,
  } = useCharacters(token, selectedWorkspace)

  const { ads, loading: adsLoading, message: adsMessage, fetchAds, generateAds, clearMessage: clearAdsMessage } = useAds(token, selectedWorkspace)
  const { generations, fetchGenerations } = useAdGenerations(token, selectedWorkspace)

  const { characterImages, fetchCharacterImages } = useCharacterImages(token, selectedWorkspace)

  // Refresh ads when generations complete
  useEffect(() => {
    if (generations.some(g => g.status === 'completed')) {
      fetchAds(selectedWorkspace)
    }
  }, [generations, fetchAds, selectedWorkspace])

  // Initialize data on mount
  useEffect(() => {
    if (token) {
      fetchWorkspaces()
    }
  }, [token, fetchWorkspaces])

  // Fetch all data when workspace changes
  useEffect(() => {
    if (selectedWorkspace && token) {
      fetchAnalyses(selectedWorkspace)
      fetchCharacters(selectedWorkspace)
      fetchAds(selectedWorkspace)
      fetchCharacterImages(selectedWorkspace)
    }
  }, [selectedWorkspace, token, fetchAnalyses, fetchCharacters, fetchAds, fetchCharacterImages])

  // Event handlers
  const handleWorkspaceSelect = (workspaceId: string) => {
    setSelectedWorkspace(workspaceId)
    // Reset selected characters when workspace changes
    setSelectedCharacters([])
  }

  const handleCharacterAction = (characterId: string, action: 'approved' | 'discarded') => {
    updateCharacterStatus(characterId, action)
  }

  const handleCharacterSelect = (characterId: number, checked: boolean) => {
    setSelectedCharacters(prev =>
      checked
        ? [...prev, characterId]
        : prev.filter(id => id !== characterId)
    )
  }

  const handleGenerateAds = (adType: string, topic: string, quantity: number, contentMix?: { education: number; story: number; proof: number; promotion: number }) => {
    generateAds(selectedCharacters, adType, topic, quantity, contentMix)
    // Switch to ads tab to show results
    setActiveResultsTab('ads')
  }

  if (isLoading || !userId) {
    return <div>Loading...</div>
  }

  return (
    <main className="flex min-h-screen">
      <WorkspaceSidebar
        workspaces={workspaces}
        selectedWorkspace={selectedWorkspace}
        onWorkspaceSelect={handleWorkspaceSelect}
        onDeleteWorkspace={deleteWorkspace}
        onCreateWorkspace={() => setShowCreateForm(true)}
      />

      {/* Main content */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <button
            onClick={logout}
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {(workspaceMessage || analysisMessage || characterMessage || adsMessage) && (
          <p className={`mb-4 text-center ${(workspaceMessage || analysisMessage || characterMessage || adsMessage).includes('successfully') || (adsMessage && adsMessage.includes('started')) ? 'text-green-600' : 'text-red-600'}`}>
            {workspaceMessage || analysisMessage || characterMessage || adsMessage}
          </p>
        )}

        {showCreateFormHook && (
          <WorkspaceForm
            onCreateWorkspace={(name) => {
              createWorkspace(name)
            }}
            loading={workspaceLoading}
          />
        )}

        {/* Welcome message for new users with no workspaces */}
        {workspaces.length === 0 && !showCreateFormHook && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="max-w-md mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Your Dashboard!</h2>
              <p className="text-gray-600 mb-6">
                Get started by creating your first workspace. A workspace helps you organize your brand discovery, voice creation, and ad generation activities.
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-teal-500 text-white py-3 px-6 rounded-lg hover:bg-teal-600 font-medium"
              >
                Create Your First Workspace
              </button>
            </div>
          </div>
        )}

        {selectedWorkspace && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Forms Section */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="border-b border-gray-200">
                <nav className="flex">
                  <button
                    onClick={() => setActiveFormTab('discovery')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 ${
                      activeFormTab === 'discovery'
                        ? 'border-teal-500 text-teal-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Brand Discovery
                  </button>
                  <button
                    onClick={() => setActiveFormTab('voice')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 ${
                      activeFormTab === 'voice'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Brand Voice
                  </button>
                  <button
                    onClick={() => setActiveFormTab('adform')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 ${
                      activeFormTab === 'adform'
                        ? 'border-pink-500 text-pink-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Brand Ads
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeFormTab === 'discovery' && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Brand Discovery</h3>
                    <p className="text-gray-600 mb-4">Get comprehensive information about brands or products</p>
                    <AnalysisForm
                      workspaces={workspaces}
                      selectedWorkspace={selectedWorkspace}
                      onWorkspaceSelect={handleWorkspaceSelect}
                      onStartAnalysis={startAnalysis}
                      loading={workspaceLoading || analysisLoading}
                    />
                  </div>
                )}

                {activeFormTab === 'voice' && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Brand Voice</h3>
                    <p className="text-gray-600 mb-4">Create AI brand characters</p>
                    <CharacterForm
                      workspaces={workspaces}
                      analyses={analyses}
                      selectedWorkspace={selectedWorkspace}
                      onWorkspaceSelect={handleWorkspaceSelect}
                      onGenerateCharacters={(analysisId) => {
                        generateCharacters(analysisId)
                      }}
                      onUploadImage={(image) => {
                        // TODO: Implement image upload
                        console.log('Upload image', image)
                      }}
                      loading={workspaceLoading || analysisLoading || characterLoading}
                    />
                  </div>
                )}

                {activeFormTab === 'adform' && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Brand Ads</h3>
                    <p className="text-gray-600 mb-4">Generate ads using AI characters</p>
                    <AdForm
                      characters={characters}
                      selectedCharacters={selectedCharacters}
                      onCharacterSelect={handleCharacterSelect}
                      onGenerateAds={handleGenerateAds}
                      loading={workspaceLoading || analysisLoading || adsLoading}
                      adGenerations={generations}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Results Section */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="border-b border-gray-200">
                <nav className="flex">
                  <button
                    onClick={() => setActiveResultsTab('analysis')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 ${
                      activeResultsTab === 'analysis'
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Analysis Results ({analyses.length})
                  </button>
                  <button
                    onClick={() => setActiveResultsTab('characters')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 ${
                      activeResultsTab === 'characters'
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Characters ({characters.length})
                  </button>
                  <button
                    onClick={() => setActiveResultsTab('ads')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 ${
                      activeResultsTab === 'ads'
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Ads ({ads.length})
                  </button>
                  <button
                    onClick={() => setActiveResultsTab('images')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 ${
                      activeResultsTab === 'images'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Images ({characterImages.length})
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeResultsTab === 'analysis' && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Analysis Results</h3>
                    {analyses.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="max-w-sm mx-auto">
                          <p className="text-gray-600 mb-4">No analysis results yet.</p>
                          <p className="text-sm text-gray-500 mb-4">
                            Start by running Brand Discovery to gather insights about your brand or product. This will help you create better characters and ads.
                          </p>
                          <button
                            onClick={() => setActiveFormTab('discovery')}
                            className="bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600 text-sm font-medium"
                          >
                            Go to Brand Discovery
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {analyses.map((analysis) => (
                          <AnalysisResultCard
                            key={analysis.id}
                            analysis={analysis}
                            onDelete={deleteAnalysis}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeResultsTab === 'characters' && (
                  <div>
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
                )}

                {activeResultsTab === 'ads' && (
                  <div>
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
                              <div className="flex gap-2">
                                <span className="px-2 py-1 rounded text-sm bg-orange-100 text-orange-800">
                                  {ad.ad_type.replace('_', ' ')}
                                </span>
                                {ad.content_category && (
                                  <span className={`px-2 py-1 rounded text-sm ${
                                    ad.content_category === 'education' ? 'bg-blue-100 text-blue-800' :
                                    ad.content_category === 'story' ? 'bg-green-100 text-green-800' :
                                    ad.content_category === 'proof' ? 'bg-purple-100 text-purple-800' :
                                    ad.content_category === 'promotion' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {ad.content_category}
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              Created: {new Date(ad.created_at).toLocaleDateString()}
                            </p>
                            <div className="bg-gray-50 p-3 rounded mb-3">
                              <p className="text-sm whitespace-pre-wrap">{ad.content}</p>
                            </div>
                            {ad.image_prompt && (
                              <div className="bg-blue-50 p-3 rounded">
                                <p className="text-xs text-blue-600 font-medium mb-1">Image Prompt:</p>
                                <p className="text-sm text-blue-800">{ad.image_prompt}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeResultsTab === 'images' && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Character Images</h3>
                    {characterImages.length === 0 ? (
                      <p className="text-gray-600">No images uploaded yet. Upload images above!</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {characterImages.map((image) => (
                          <div key={image.id} className="border border-gray-200 rounded-md p-4">
                            <div className="mb-2">
                              <img
                                src={`data:${image.file_type};base64,${image.file_data}`}
                                alt={image.file_name}
                                className="w-full h-32 object-cover rounded-md"
                              />
                            </div>
                            <div className="text-sm text-gray-600">
                              <p className="font-medium truncate">{image.file_name}</p>
                              <p className="text-xs">{(image.file_size / 1024).toFixed(1)} KB</p>
                              <p className="text-xs">
                                {image.character_id ? `Character ID: ${image.character_id}` : 'Unassigned'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {workspaces.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Workspace Details</h3>
            <div className="space-y-4">
              {workspaces.map((workspace) => (
                <div
                  key={workspace.id}
                  onClick={() => handleWorkspaceSelect(workspace.id.toString())}
                  className={`border border-gray-200 rounded-md p-4 cursor-pointer transition-colors ${
                    selectedWorkspace === workspace.id.toString()
                      ? 'border-teal-500 bg-teal-50'
                      : 'hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <h4 className="text-lg font-medium">{workspace.name}</h4>
                  <p className="text-sm text-gray-600">
                    Created: {new Date(workspace.created_at).toLocaleDateString()}
                  </p>
                  {selectedWorkspace === workspace.id.toString() && (
                    <span className="inline-block mt-2 px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded-full">
                      Currently Selected
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
