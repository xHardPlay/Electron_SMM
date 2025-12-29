'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import AnalysisResultCard from '../../components/AnalysisResultCard'

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
  // New state for enhanced Brand Discovery
  const [analysisType, setAnalysisType] = useState<'brand' | 'product'>('brand')
  const [brandName, setBrandName] = useState('')
  const [productName, setProductName] = useState('')
  const [analysisUrls, setAnalysisUrls] = useState<string[]>([''])
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [adType, setAdType] = useState<string>('linkedin_post')
  const [adTopic, setAdTopic] = useState('')
  const [adQuantity, setAdQuantity] = useState<number>(1)
  const [selectedCharacters, setSelectedCharacters] = useState<number[]>([])
  const [ads, setAds] = useState<any[]>([])
  const [characterImages, setCharacterImages] = useState<any[]>([])
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null)
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

  // Polling effect for analysis updates
  useEffect(() => {
    if (selectedWorkspace && analyses.some(a => a.status === 'processing')) {
      const token = localStorage.getItem('token')
      if (!token) return

      // Start polling every 5 seconds
      const interval = setInterval(() => {
        fetchAnalyses(selectedWorkspace, token)
      }, 5000)

      setPollingInterval(interval)

      return () => {
        clearInterval(interval)
        setPollingInterval(null)
      }
    } else if (pollingInterval) {
      // Clear polling when no analyses are processing
      clearInterval(pollingInterval)
      setPollingInterval(null)
    }

    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval)
        setPollingInterval(null)
      }
    }
  }, [selectedWorkspace, analyses, pollingInterval])

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
      console.log('Fetching analyses for workspace:', workspaceId)
      const response = await fetch(`https://electron-backend.carlos-mdtz9.workers.dev/api/analyses?workspace_id=${workspaceId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Analyses fetched:', data.analyses)
        setAnalyses(data.analyses || [])
      } else {
        console.error('Failed to fetch analyses:', response.status, response.statusText)
        const errorText = await response.text()
        console.error('Error response:', errorText)
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

    if (!selectedWorkspace) return

    const name = analysisType === 'brand' ? brandName : productName
    if (!name.trim()) return

    if (analysisUrls.length === 0 && uploadedFiles.length === 0) {
      setMessage('Please add at least one URL or upload a file')
      return
    }

    setLoading(true)
    setMessage('')

    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const formData = new FormData()
      formData.append('workspace_id', selectedWorkspace)
      formData.append('analysis_type', analysisType)
      formData.append('name', name)

      // Add URLs
      analysisUrls.forEach((url, index) => {
        if (url.trim()) {
          formData.append(`url_${index}`, url.trim())
        }
      })

      // Add files
      uploadedFiles.forEach((file, index) => {
        formData.append(`file_${index}`, file)
      })

      const response = await fetch('https://electron-backend.carlos-mdtz9.workers.dev/api/analyses', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Brand/Product discovery started! Analysis will be available shortly.')
        setBrandName('')
        setProductName('')
        setAnalysisUrls([''])
        setUploadedFiles([])
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

  const fetchCharacterImages = async (workspaceId: string, token: string) => {
    try {
      const response = await fetch(`https://electron-backend.carlos-mdtz9.workers.dev/api/character-images?workspace_id=${workspaceId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setCharacterImages(data.images || [])
      } else {
        console.error('Failed to fetch character images')
      }
    } catch (error) {
      console.error('Error fetching character images:', error)
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
      fetchCharacterImages(workspaceId, token)
    }
  }

  const handleUploadImage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedWorkspace || !uploadedImage) return

    setLoading(true)
    setMessage('')

    const token = localStorage.getItem('token')
    if (!token) return

    const formData = new FormData()
    formData.append('workspace_id', selectedWorkspace)
    formData.append('image', uploadedImage)

    try {
      const response = await fetch('https://electron-backend.carlos-mdtz9.workers.dev/api/character-images', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Image uploaded successfully!')
        setUploadedImage(null)
        fetchCharacterImages(selectedWorkspace, token) // Refresh the list
      } else {
        setMessage(data.error || 'Failed to upload image')
      }
    } catch (error) {
      setMessage('Network error')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAnalysis = async (analysisId: string) => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const response = await fetch(`https://electron-backend.carlos-mdtz9.workers.dev/api/analyses/${analysisId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setMessage('Analysis deleted successfully!')
        // Refresh analyses after deletion
        if (selectedWorkspace) {
          fetchAnalyses(selectedWorkspace, token)
        }
      } else {
        const data = await response.json()
        setMessage(data.error || 'Failed to delete analysis')
      }
    } catch (error) {
      setMessage('Network error')
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Brand Discovery</h2>
              <p className="text-gray-600 mb-4">Get comprehensive information about brands or products</p>
              <button
                onClick={() => setShowAnalysisForm(!showAnalysisForm)}
                className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
              >
                {showAnalysisForm ? 'Cancel' : 'Start Discovery'}
              </button>
            </div>

            {showAnalysisForm && (
              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h3 className="text-xl font-semibold mb-4">Brand & Product Discovery</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Upload documents, add website links, and let AI analyze your brand or product comprehensively.
                  Information will be stored and can be edited for future use.
                </p>

                <form onSubmit={handleStartAnalysis}>
                  <div className="mb-6">
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

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3">
                      Analysis Type
                    </label>
                    <div className="flex gap-6">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="brand"
                          checked={analysisType === 'brand'}
                          onChange={(e) => setAnalysisType(e.target.value as 'brand' | 'product')}
                          className="mr-2"
                        />
                        <div>
                          <span className="font-medium">Brand Analysis</span>
                          <p className="text-xs text-gray-500">Analyze brand identity, values, target audience</p>
                        </div>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="product"
                          checked={analysisType === 'product'}
                          onChange={(e) => setAnalysisType(e.target.value as 'brand' | 'product')}
                          className="mr-2"
                        />
                        <div>
                          <span className="font-medium">Product Analysis</span>
                          <p className="text-xs text-gray-500">Analyze product features, benefits, positioning</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor={analysisType === 'brand' ? 'brandName' : 'productName'} className="block text-sm font-medium mb-1">
                      {analysisType === 'brand' ? 'Brand Name' : 'Product Name'}
                    </label>
                    <input
                      type="text"
                      id={analysisType === 'brand' ? 'brandName' : 'productName'}
                      value={analysisType === 'brand' ? brandName : productName}
                      onChange={(e) => analysisType === 'brand' ? setBrandName(e.target.value) : setProductName(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder={analysisType === 'brand' ? 'Enter brand name' : 'Enter product name'}
                    />
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-sm font-medium">
                        Website Links
                      </label>
                      <button
                        type="button"
                        onClick={() => setAnalysisUrls([...analysisUrls, ''])}
                        className="text-green-600 hover:text-green-700 text-sm font-medium"
                      >
                        + Add Link
                      </button>
                    </div>
                    {analysisUrls.map((url, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="url"
                          value={url}
                          onChange={(e) => {
                            const newUrls = [...analysisUrls]
                            newUrls[index] = e.target.value
                            setAnalysisUrls(newUrls)
                          }}
                          placeholder="https://example.com"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <button
                          type="button"
                          onClick={() => setAnalysisUrls(analysisUrls.filter((_, i) => i !== index))}
                          className="px-3 py-2 text-red-600 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    {analysisUrls.length === 0 && (
                      <p className="text-sm text-gray-500 italic">No links added yet</p>
                    )}
                  </div>

                  <div className="mb-6">
                    <label htmlFor="fileUpload" className="block text-sm font-medium mb-1">
                      Upload Documents
                    </label>
                    <input
                      type="file"
                      id="fileUpload"
                      multiple
                      accept=".pdf,.docx,.txt,.md,.pptx,.xlsx"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || [])
                        setUploadedFiles([...uploadedFiles, ...files])
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Supported formats: PDF, DOCX, TXT, MD, PPTX, XLSX (max 10MB each)
                    </p>

                    {uploadedFiles.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium mb-2">Uploaded Files:</p>
                        <div className="space-y-1">
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                              <span className="text-sm">{file.name}</span>
                              <button
                                type="button"
                                onClick={() => setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))}
                                className="text-red-600 hover:text-red-700 ml-2"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !selectedWorkspace || (!brandName && !productName) || (analysisUrls.length === 0 && uploadedFiles.length === 0)}
                    className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    {loading ? 'Analyzing...' : `Analyze ${analysisType === 'brand' ? 'Brand' : 'Product'}`}
                  </button>
                </form>
              </div>
            )}
          </>

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
            <h2 className="text-2xl font-semibold mb-4">Brand Ads</h2>
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

        {showCharacterForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-semibold mb-4">Create Brand Voice Characters</h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-4">
                Upload images and generate AI characters based on your brand analysis.
                Images will be associated with your characters for later use.
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
              <div className="mb-4">
                <label htmlFor="characterImageUpload" className="block text-sm font-medium mb-1">
                  Upload Character Images (Optional)
                </label>
                <input
                  type="file"
                  id="characterImageUpload"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={(e) => setUploadedImage(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: JPEG, PNG, GIF, WebP (max 5MB each)
                </p>
                {uploadedImage && (
                  <p className="text-sm text-green-600 mt-1">
                    Selected: {uploadedImage.name} ({(uploadedImage.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
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
            <div className="space-y-6">
                  {analyses.map((analysis) => (
                    <AnalysisResultCard
                      key={analysis.id}
                      analysis={analysis}
                      onDelete={handleDeleteAnalysis}
                    />
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
