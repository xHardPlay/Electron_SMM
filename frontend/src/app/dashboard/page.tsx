'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Workspace {
  id: number
  name: string
  created_at: string
}

export default function Dashboard() {
  const [userId, setUserId] = useState<string | null>(null)
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [analyses, setAnalyses] = useState<any[]>([])
  const [characters, setCharacters] = useState<any[]>([])
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showAnalysisForm, setShowAnalysisForm] = useState(false)
  const [showCharacterForm, setShowCharacterForm] = useState(false)
  const [showAdForm, setShowAdForm] = useState(false)
  const [newWorkspaceName, setNewWorkspaceName] = useState('')
  const [analysisUrl, setAnalysisUrl] = useState('')
  const [selectedAnalysis, setSelectedAnalysis] = useState<string>('')
  const [adType, setAdType] = useState<string>('linkedin_post')
  const [adTopic, setAdTopic] = useState('')
  const [adQuantity, setAdQuantity] = useState<number>(1)
  const [selectedCharacters, setSelectedCharacters] = useState<number[]>([])
  const [ads, setAds] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const storedUserId = localStorage.getItem('userId')

    if (!token || !storedUserId) {
      router.push('/login')
      return
    }

    setUserId(storedUserId)
    fetchWorkspaces(token)
  }, [router])

  const fetchWorkspaces = async (token: string) => {
    try {
      const response = await fetch('https://electron-backend.carlos-mdtz9.workers.dev/api/workspaces', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setWorkspaces(data.workspaces || [])
      } else {
        console.error('Failed to fetch workspaces')
      }
    } catch (error) {
      console.error('Error fetching workspaces:', error)
    }
  }

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newWorkspaceName.trim()) return

    setLoading(true)
    setMessage('')

    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const response = await fetch('https://electron-backend.carlos-mdtz9.workers.dev/api/workspaces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newWorkspaceName }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Workspace created successfully!')
        setNewWorkspaceName('')
        setShowCreateForm(false)
        fetchWorkspaces(token) // Refresh the list
      } else {
        setMessage(data.error || 'Failed to create workspace')
      }
    } catch (error) {
      setMessage('Network error')
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalyses = async (workspaceId: string, token: string) => {
    try {
      const response = await fetch(`https://electron-backend.carlos-mdtz9.workers.dev/api/analyses?workspace_id=${workspaceId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setAnalyses(data.analyses || [])
      } else {
        console.error('Failed to fetch analyses')
      }
    } catch (error) {
      console.error('Error fetching analyses:', error)
    }
  }

  const fetchCharacters = async (workspaceId: string, token: string) => {
    try {
      const response = await fetch(`https://electron-backend.carlos-mdtz9.workers.dev/api/characters?workspace_id=${workspaceId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setCharacters(data.characters || [])
      } else {
        console.error('Failed to fetch characters')
      }
    } catch (error) {
      console.error('Error fetching characters:', error)
    }
  }

  const handleGenerateCharacters = async () => {
    if (!selectedWorkspace) return

    setLoading(true)
    setMessage('')

    const token = localStorage.getItem('token')
    if (!token) return

    // Find completed analysis for context
    const completedAnalysis = analyses.find(a => a.status === 'completed')
    const brandAnalysisId = completedAnalysis?.id?.toString()

    try {
      const response = await fetch('https://electron-backend.carlos-mdtz9.workers.dev/api/characters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          workspace_id: parseInt(selectedWorkspace),
          brand_analysis: brandAnalysisId
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Character generation started! Characters will be available shortly.')
        setShowCharacterForm(false)
        // Refresh characters after a delay
        setTimeout(() => fetchCharacters(selectedWorkspace, token), 3000)
      } else {
        setMessage(data.error || 'Failed to generate characters')
      }
    } catch (error) {
      setMessage('Network error')
    } finally {
      setLoading(false)
    }
  }

  const handleCharacterAction = async (characterId: string, action: 'approved' | 'discarded') => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const response = await fetch(`https://electron-backend.carlos-mdtz9.workers.dev/api/characters/${characterId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: action }),
      })

      if (response.ok) {
        setMessage(`Character ${action} successfully!`)
        fetchCharacters(selectedWorkspace, token)
      } else {
        const data = await response.json()
        setMessage(data.error || 'Failed to update character')
      }
    } catch (error) {
      setMessage('Network error')
    }
  }

  const handleStartAnalysis = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedWorkspace || !analysisUrl.trim()) return

    setLoading(true)
    setMessage('')

    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const response = await fetch('https://electron-backend.carlos-mdtz9.workers.dev/api/analyses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          workspace_id: parseInt(selectedWorkspace),
          url: analysisUrl,
          analysis_type: 'url'
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Analysis started! Check back in a few moments for results.')
        setAnalysisUrl('')
        setShowAnalysisForm(false)
        fetchAnalyses(selectedWorkspace, token) // Refresh the list
      } else {
        setMessage(data.error || 'Failed to start analysis')
      }
    } catch (error) {
      setMessage('Network error')
    } finally {
      setLoading(false)
    }
  }

  const fetchAds = async (workspaceId: string, token: string) => {
    try {
      const response = await fetch(`https://electron-backend.carlos-mdtz9.workers.dev/api/ads?workspace_id=${workspaceId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setAds(data.ads || [])
      } else {
        console.error('Failed to fetch ads')
      }
    } catch (error) {
      console.error('Error fetching ads:', error)
    }
  }

  const handleGenerateAds = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedWorkspace || selectedCharacters.length === 0 || !adTopic.trim()) return

    setLoading(true)
    setMessage('')

    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const response = await fetch('https://electron-backend.carlos-mdtz9.workers.dev/api/ads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          workspace_id: parseInt(selectedWorkspace),
          character_ids: selectedCharacters,
          ad_type: adType,
          topic: adTopic,
          quantity: adQuantity
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Ad generation started! Ads will be available shortly.')
        setAdTopic('')
        setShowAdForm(false)
        // Refresh ads after a delay
        setTimeout(() => fetchAds(selectedWorkspace, token), 5000)
      } else {
        setMessage(data.error || 'Failed to generate ads')
      }
    } catch (error) {
      setMessage('Network error')
    } finally {
      setLoading(false)
    }
  }

  const handleCharacterCheckbox = (characterId: number, checked: boolean) => {
    if (checked) {
      setSelectedCharacters(prev => [...prev, characterId])
    } else {
      setSelectedCharacters(prev => prev.filter(id => id !== characterId))
    }
  }

  const handleWorkspaceSelect = (workspaceId: string) => {
    setSelectedWorkspace(workspaceId)
    const token = localStorage.getItem('token')
    if (token) {
      fetchAnalyses(workspaceId, token)
      fetchCharacters(workspaceId, token)
      fetchAds(workspaceId, token)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    router.push('/')
  }

  if (!userId) {
    return <div>Loading...</div>
  }

  return (
    <main className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-6">
        <h2 className="text-2xl font-bold mb-6">Workspaces</h2>
        <div className="space-y-2">
          {workspaces.map((workspace) => (
            <button
              key={workspace.id}
              onClick={() => handleWorkspaceSelect(workspace.id.toString())}
              className={`w-full text-left px-4 py-2 rounded-md hover:bg-gray-700 ${
                selectedWorkspace === workspace.id.toString() ? 'bg-gray-700' : ''
              }`}
            >
              {workspace.name}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          + New Workspace
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {message && (
          <p className={`mb-4 text-center ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Workspaces</h2>
            <p className="text-gray-600 mb-4">Manage your marketing workspaces</p>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              {showCreateForm ? 'Cancel' : 'Create Workspace'}
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Brand Discovery</h2>
            <p className="text-gray-600 mb-4">Analyze brands with AI</p>
            <button
              onClick={() => setShowAnalysisForm(!showAnalysisForm)}
              className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
            >
              {showAnalysisForm ? 'Cancel' : 'Start Analysis'}
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Brand Voice</h2>
            <p className="text-gray-600 mb-4">Create AI brand characters</p>
            <button
              onClick={() => setShowCharacterForm(!showCharacterForm)}
              className="bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600"
            >
              {showCharacterForm ? 'Cancel' : 'Generate Characters'}
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Ad Creation</h2>
            <p className="text-gray-600 mb-4">Generate ads using AI characters</p>
            <button
              onClick={() => setShowAdForm(!showAdForm)}
              className="bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600"
            >
              {showAdForm ? 'Cancel' : 'Generate Ads'}
            </button>
          </div>
        </div>

        {showCreateForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-semibold mb-4">Create New Workspace</h3>
            <form onSubmit={handleCreateWorkspace}>
              <div className="mb-4">
                <label htmlFor="workspaceName" className="block text-sm font-medium mb-1">
                  Workspace Name
                </label>
                <input
                  type="text"
                  id="workspaceName"
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter workspace name"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Workspace'}
              </button>
            </form>
          </div>
        )}

        {showAnalysisForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-semibold mb-4">Start Brand Analysis</h3>
            <form onSubmit={handleStartAnalysis}>
              <div className="mb-4">
                <label htmlFor="workspaceSelect" className="block text-sm font-medium mb-1">
                  Select Workspace
                </label>
                <select
                  id="workspaceSelect"
                  value={selectedWorkspace}
                  onChange={(e) => handleWorkspaceSelect(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Choose a workspace...</option>
                  {workspaces.map((workspace) => (
                    <option key={workspace.id} value={workspace.id.toString()}>
                      {workspace.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="analysisUrl" className="block text-sm font-medium mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  id="analysisUrl"
                  value={analysisUrl}
                  onChange={(e) => setAnalysisUrl(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="https://example.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !selectedWorkspace}
                className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
              >
                {loading ? 'Starting Analysis...' : 'Start Analysis'}
              </button>
            </form>
          </div>
        )}

        {showCharacterForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-semibold mb-4">Generate Brand Voice Characters</h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-4">
                This will generate 3 unique AI characters based on your brand analysis.
                Make sure you have completed a brand analysis first for better results.
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Selected Workspace
                </label>
                <select
                  value={selectedWorkspace}
                  onChange={(e) => handleWorkspaceSelect(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Choose a workspace...</option>
                  {workspaces.map((workspace) => (
                    <option key={workspace.id} value={workspace.id.toString()}>
                      {workspace.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleGenerateCharacters}
                disabled={loading || !selectedWorkspace}
                className="bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              >
                {loading ? 'Generating Characters...' : 'Generate Characters'}
              </button>
            </div>
          </div>
        )}

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

        {selectedWorkspace && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h3 className="text-xl font-semibold mb-4">Analysis Results</h3>
              {analyses.length === 0 ? (
                <p className="text-gray-600">No analyses yet. Start your first analysis above!</p>
              ) : (
                <div className="space-y-4">
                  {analyses.map((analysis) => (
                    <div key={analysis.id} className="border border-gray-200 rounded-md p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-medium">{analysis.url}</h4>
                        <span className={`px-2 py-1 rounded text-sm ${
                          analysis.status === 'completed' ? 'bg-green-100 text-green-800' :
                          analysis.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {analysis.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Created: {new Date(analysis.created_at).toLocaleDateString()}
                      </p>
                      {analysis.ai_analysis && (
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-sm">{analysis.ai_analysis}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

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
                        <span className="px-2 py-1 rounded text-sm bg-orange-100 text-orange-800">
                          {ad.ad_type.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Created: {new Date(ad.created_at).toLocaleDateString()}
                      </p>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-sm whitespace-pre-wrap">{ad.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {workspaces.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Workspace Details</h3>
            <div className="space-y-4">
              {workspaces.map((workspace) => (
                <div key={workspace.id} className="border border-gray-200 rounded-md p-4">
                  <h4 className="text-lg font-medium">{workspace.name}</h4>
                  <p className="text-sm text-gray-600">
                    Created: {new Date(workspace.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
