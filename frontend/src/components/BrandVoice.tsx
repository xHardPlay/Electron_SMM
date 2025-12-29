'use client'

interface BrandVoiceProps {
  showCharacterForm: boolean
  setShowCharacterForm: (show: boolean) => void
  selectedWorkspace: string
  workspaces: any[]
  uploadedImage: File | null
  setUploadedImage: (file: File | null) => void
  loading: boolean
  handleWorkspaceSelect: (workspaceId: string) => void
  handleGenerateCharacters: () => void
}

export default function BrandVoice({
  showCharacterForm,
  setShowCharacterForm,
  selectedWorkspace,
  workspaces,
  uploadedImage,
  setUploadedImage,
  loading,
  handleWorkspaceSelect,
  handleGenerateCharacters
}: BrandVoiceProps) {
  return (
    <>
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
    </>
  )
}
